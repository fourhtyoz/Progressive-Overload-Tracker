import * as SQLite from 'expo-sqlite';

import { handleTransactionError } from '@/app/shared/lib/errors.lib';
import { DBResult, TExercise, TResult } from '@/app/shared/types';

const DB_NAME = 'progressive_overload_tracker.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (!dbPromise) {
        dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
            await db.execAsync('PRAGMA foreign_keys = ON');
            return db;
        });
    }
    return dbPromise;
}

export async function closeDatabase(): Promise<void> {
    if (dbPromise) {
        const db = await dbPromise;
        await db.closeAsync();
        dbPromise = null;
    }
}

export async function initializeDatabase(): Promise<void> {
    const db = await getDatabase();
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            type TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exercise_id INTEGER NOT NULL,
            exercise TEXT NOT NULL,
            date TEXT NOT NULL,
            muscleGroup TEXT NOT NULL,
            reps INTEGER NOT NULL,
            weight REAL NOT NULL,
            units TEXT NOT NULL,
            FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
        );
    `);
}

// EXERCISES
export const exerciseExist = async (title: string, type: string): Promise<boolean> => {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM exercises WHERE title = ? AND type = ? LIMIT 1',
        [title, type]
    );
    return !!row;
};

export const addExercise = async (title: string, type: string): Promise<DBResult<number>> => {
    try {
        const db = await getDatabase();
        const result = await db.runAsync(
            'INSERT INTO exercises (title, type) VALUES (?, ?)',
            [title, type]
        );
        return { success: true, data: result.lastInsertRowId };
    } catch (e) {
        return handleTransactionError(e, 'Failed to add exercises', 'addExercise');
    }
};

export const fetchExercises = async (): Promise<DBResult<TExercise[]>> => {
    try {
        const db = await getDatabase();
        const data = await db.getAllAsync<TExercise>('SELECT * FROM exercises ORDER BY title');
        return { success: true, data };
    } catch (e) {
        return handleTransactionError(e, 'Failed to fetch exercises', 'fetchExercises');
    }
};

// RESULTS
export const addResult = async (
    exercise: string,
    exercise_id: number,
    date: string,
    muscleGroup: string,
    reps: number,
    weight: number,
    units: string
): Promise<DBResult<number>> => {
    try {
        const db = await getDatabase();
        const result = await db.runAsync(
            'INSERT INTO results (exercise, exercise_id, date, muscleGroup, reps, weight, units) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [exercise, exercise_id, date, muscleGroup, reps, weight, units]
        );
        return { success: true, data: result.lastInsertRowId };
    } catch (e) {
        return handleTransactionError(e, 'Failed to add result', 'addResult');
    }
};

export const updateResult = async (
    id: number,
    exercise: string,
    exercise_id: number,
    date: string,
    muscleGroup: string,
    reps: number,
    weight: number,
    units: string
): Promise<DBResult<number>> => {
    try {
        const db = await getDatabase();
        const result = await db.runAsync(
            'UPDATE results SET exercise = ?, exercise_id = ?, date = ?, muscleGroup = ?, reps = ?, weight = ?, units = ? WHERE id = ?',
            [exercise, exercise_id, date, muscleGroup, reps, weight, units, id]
        );
        if (result.changes > 0) {
            return { success: true, data: result.changes };
        }
        return { success: false, error: 'No rows were updated' };
    } catch (e) {
        return handleTransactionError(e, 'Failed to update result', 'updateResult');
    }
};

export const deleteResult = async (id: number): Promise<DBResult<number>> => {
    try {
        const db = await getDatabase();
        const result = await db.runAsync('DELETE FROM results WHERE id = ?', [id]);
        if (result.changes > 0) {
            return { success: true, data: result.changes };
        }
        return { success: false, error: 'No rows were deleted' };
    } catch (e) {
        return handleTransactionError(e, 'Failed to delete result', 'deleteResult');
    }
};

export const fetchResultById = async (id: number): Promise<DBResult<TResult>> => {
    try {
        const db = await getDatabase();
        const data = await db.getFirstAsync<TResult>('SELECT * FROM results WHERE id = ?', [id]);
        if (data) {
            return { success: true, data };
        }
        return { success: false, error: 'Result not found' };
    } catch (e) {
        return handleTransactionError(e, 'Failed to fetch result', 'fetchResultById');
    }
};

export const fetchResultsByExerciseId = async (
    exercise_id: number
): Promise<DBResult<TResult[]>> => {
    try {
        const db = await getDatabase();
        const data = await db.getAllAsync<TResult>(
            'SELECT * FROM results WHERE exercise_id = ?',
            [exercise_id]
        );
        return { success: true, data };
    } catch (e) {
        return handleTransactionError(
            e,
            'Failed to fetch result by exercise id',
            'fetchResultsByExerciseId'
        );
    }
};

export const deleteTables = async (): Promise<{ success: boolean; error?: string }> => {
    try {
        const db = await getDatabase();
        await db.execAsync(`
            DROP TABLE IF EXISTS results;
            DROP TABLE IF EXISTS exercises;
        `);
        return { success: true };
    } catch (e) {
        return handleTransactionError(e, 'Failed to delete tables', 'deleteTables');
    }
};
