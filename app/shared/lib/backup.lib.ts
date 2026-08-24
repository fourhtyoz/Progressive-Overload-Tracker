import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { fetchAllData, replaceAllData } from '@/app/shared/api/db';
import { TExercise, TResult } from '@/app/shared/types';

const BACKUP_FILE_NAME = 'progressive-overload-backup.json';
const BACKUP_APP = 'progressive-overload-tracker';
const BACKUP_VERSION = 1;

function buildPayload(exercises: TExercise[], results: TResult[]) {
    return {
        app: BACKUP_APP,
        version: BACKUP_VERSION,
        exportedAt: new Date().toISOString(),
        exercises,
        results,
    };
}

function isExercise(value: unknown): value is TExercise {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return typeof v.id === 'number' && typeof v.title === 'string' && typeof v.type === 'string';
}

function isResult(value: unknown): value is TResult {
    if (typeof value !== 'object' || value === null) return false;
    const v = value as Record<string, unknown>;
    return (
        typeof v.id === 'number' &&
        typeof v.exercise_id === 'number' &&
        typeof v.date === 'string' &&
        typeof v.reps === 'number' &&
        typeof v.weight === 'number' &&
        typeof v.units === 'string' &&
        typeof v.sets === 'number'
    );
}

function parsePayload(text: string): { exercises: TExercise[]; results: TResult[] } {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Invalid backup file');
    }
    const p = parsed as Record<string, unknown>;
    if (!Array.isArray(p.exercises) || !Array.isArray(p.results)) {
        throw new Error('Invalid backup file');
    }
    if (!p.exercises.every(isExercise) || !p.results.every(isResult)) {
        throw new Error('Invalid backup file');
    }
    return {
        exercises: p.exercises as TExercise[],
        results: p.results as TResult[],
    };
}

export async function exportBackup(): Promise<void> {
    const res = await fetchAllData();
    if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to export data');
    }

    const payload = buildPayload(res.data.exercises, res.data.results);
    const json = JSON.stringify(payload, null, 2);

    if (!FileSystem.cacheDirectory) {
        throw new Error('Cache directory unavailable');
    }
    const uri = `${FileSystem.cacheDirectory}${BACKUP_FILE_NAME}`;
    await FileSystem.writeAsStringAsync(uri, json);

    if (!(await Sharing.isAvailableAsync())) {
        throw new Error('Sharing unavailable on this device');
    }
    await Sharing.shareAsync(uri, {
        mimeType: 'application/json',
        dialogTitle: BACKUP_FILE_NAME,
    });
}

export async function importBackup(): Promise<number> {
    const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets[0]) return 0;

    const text = await FileSystem.readAsStringAsync(result.assets[0].uri);
    const { exercises, results } = parsePayload(text);

    const res = await replaceAllData(exercises, results);
    if (!res.success) {
        throw new Error(res.error || 'Failed to import data');
    }
    return res.data ?? 0;
}
