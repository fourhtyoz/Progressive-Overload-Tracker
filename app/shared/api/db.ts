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

type Migration = {
    version: number;
    up: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

// Append new migrations here (never edit existing ones) and bump the version.
const MIGRATIONS: Migration[] = [
    {
        version: 1,
        up: async (db) => {
            await db.execAsync(`
                CREATE TABLE IF NOT EXISTS exercises (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL COLLATE NOCASE,
                    type TEXT NOT NULL CHECK (type IN (
                        'trapezius', 'shoulders', 'chest', 'biceps', 'triceps', 'forearms',
                        'legs', 'glutes', 'back', 'abs', 'cardio'
                    )),
                    UNIQUE (title, type)
                );
                CREATE TABLE IF NOT EXISTS results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    exercise_id INTEGER NOT NULL,
                    date TEXT NOT NULL,
                    reps INTEGER NOT NULL CHECK (reps > 0),
                    weight REAL NOT NULL CHECK (weight >= 0),
                    units TEXT NOT NULL CHECK (units IN ('kg', 'lb')),
                    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_results_exercise_id ON results(exercise_id);
            `);
        },
    },
];

export async function initializeDatabase(): Promise<void> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    let current = row?.user_version ?? 0;

    for (const migration of MIGRATIONS) {
        if (migration.version <= current) continue;
        await db.withExclusiveTransactionAsync(async (txn) => {
            await migration.up(txn);
            await txn.execAsync(`PRAGMA user_version = ${migration.version}`);
        });
        current = migration.version;
    }
}

// EXERCISES
export const exerciseExist = async (title: string, type: string): Promise<boolean> => {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM exercises WHERE LOWER(title) = LOWER(?) AND type = ? LIMIT 1',
        [title, type]
    );
    return !!row;
};

export const addExercise = async (title: string, type: string): Promise<DBResult<number>> => {
    try {
        const db = await getDatabase();
        const result = await db.runAsync('INSERT INTO exercises (title, type) VALUES (?, ?)', [
            title,
            type,
        ]);
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

export const renameExercise = async (id: number, title: string): Promise<DBResult<number>> => {
    try {
        const db = await getDatabase();
        await db.runAsync('UPDATE exercises SET title = ? WHERE id = ?', [title, id]);
        return { success: true, data: id };
    } catch (e) {
        return handleTransactionError(e, 'Failed to rename exercise', 'renameExercise');
    }
};

export const deleteExercise = async (id: number): Promise<DBResult<number>> => {
    try {
        const db = await getDatabase();
        const result = await db.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
        if (result.changes > 0) {
            return { success: true, data: result.changes };
        }
        return { success: false, error: 'No exercise was deleted' };
    } catch (e) {
        return handleTransactionError(e, 'Failed to delete exercise', 'deleteExercise');
    }
};

// RESULTS
export const addResult = async (
    exercise_id: number,
    date: string,
    reps: number,
    weight: number,
    units: string
): Promise<DBResult<number>> => {
    try {
        const db = await getDatabase();
        const result = await db.runAsync(
            'INSERT INTO results (exercise_id, date, reps, weight, units) VALUES (?, ?, ?, ?, ?)',
            [exercise_id, date, reps, weight, units]
        );
        return { success: true, data: result.lastInsertRowId };
    } catch (e) {
        return handleTransactionError(e, 'Failed to add result', 'addResult');
    }
};

export const updateResult = async (
    id: number,
    exercise_id: number,
    date: string,
    reps: number,
    weight: number,
    units: string
): Promise<DBResult<number>> => {
    try {
        const db = await getDatabase();
        const result = await db.runAsync(
            'UPDATE results SET exercise_id = ?, date = ?, reps = ?, weight = ?, units = ? WHERE id = ?',
            [exercise_id, date, reps, weight, units, id]
        );
        return { success: true, data: result.changes };
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
        const data = await db.getAllAsync<TResult>('SELECT * FROM results WHERE exercise_id = ?', [
            exercise_id,
        ]);
        return { success: true, data };
    } catch (e) {
        return handleTransactionError(
            e,
            'Failed to fetch result by exercise id',
            'fetchResultsByExerciseId'
        );
    }
};

export const fetchLatestResultByExerciseId = async (
    exercise_id: number
): Promise<DBResult<TResult>> => {
    try {
        const db = await getDatabase();
        const data = await db.getFirstAsync<TResult>(
            'SELECT * FROM results WHERE exercise_id = ? ORDER BY date DESC, id DESC LIMIT 1',
            [exercise_id]
        );
        if (data) {
            return { success: true, data };
        }
        return { success: false, error: 'No results found' };
    } catch (e) {
        return handleTransactionError(
            e,
            'Failed to fetch latest result',
            'fetchLatestResultByExerciseId'
        );
    }
};

export const deleteTables = async (): Promise<{ success: boolean; error?: string }> => {
    try {
        const db = await getDatabase();
        await db.execAsync(`
            DROP TABLE IF EXISTS results;
            DROP TABLE IF EXISTS exercises;
            PRAGMA user_version = 0;
        `);
        return { success: true };
    } catch (e) {
        return handleTransactionError(e, 'Failed to delete tables', 'deleteTables');
    }
};
