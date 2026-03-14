import * as SQLite from 'expo-sqlite/legacy';
import { DBResult, TExercise, TResult } from '../types';
import { handleTransactionError } from '../utils/utils';

export const db = SQLite.openDatabase('progressive_overload_tracker.db');

export const createTables = () => {
    // exercises
    db.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS exercises (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                title TEXT NOT NULL,
                type TEXT NOT NULL
            );`
        );
    });

    // results
    db.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                exercise_id INTEGER NOT NULL,
                exercise TEXT NOT NULL,
                date TEXT NOT NULL,
                muscleGroup TEXT NOT NULL,
                reps INTEGER NOT NULL,
                weight INTEGER NOT NULL,
                units TEXT NOT NULL,
                FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
            );`,
            [],
            (_, result) => console.log('createTables', result),
        );
    });
};

// EXERCISES
export const exerciseExist = async (title: string, type: string): Promise<boolean> => {
    try {
        const exists = await new Promise<boolean>((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT 1 FROM exercises WHERE title = ? AND type = ? LIMIT 1',
                    [title, type],
                    (_, result) => {
                        resolve(result.rows.length > 0)
                        return true
                    },
                    (_, error): boolean => {
                        reject(error)
                        return false
                    }
                );
            });
        });
        return exists
    } catch (e) {
        console.error('exerciseExist error', e);
        return false
    }
}

export const addExercise = async (title: string, type: string) => {
    try {
        const data = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO exercises (title, type) VALUES (?, ?)',
                    [title, type],
                    (_, result) => resolve(result.insertId),
                    (_, error) => {
                        reject(error)
                        return false
                    }
                );
            });
        });
        return { success: true, data, error: '' };
    } catch (e) {
        return handleTransactionError(e, 'Failed to add exercises', 'addExercise')
    }
};

export const fetchExercises = async (): Promise<DBResult<TExercise[]>> => {
    try {
        const data = await new Promise<TExercise[]>((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM exercises ORDER BY title',
                    [],
                    (_, result) => {
                        const exercises: TExercise[] = result.rows._array;
                        resolve(exercises);
                    },
                    (_, error): boolean => {
                        reject(error);
                        return false;
                    }
                );
            });
        });
        return { success: true, data };
    } catch (e) {
        return handleTransactionError(e, 'Failed to fetch exercises', 'fetchExercises')
    }
};

// const updateExercise = (id, title, type) => {
//     db.transaction(tx => {
//         tx.executeSql(
//             'UPDATE exercises SET title = ?, type = ? WHERE id = ?',
//             [title, type, id],
//             (_, result) => { console.log('Data updated', result) },
//             (_, error) => { console.error('Error updating data', error) }
//         );
//     });
// };

// const deleteExercise = (id) => {
//     db.transaction(tx => {
//         tx.executeSql(
//             'DELETE FROM exercises WHERE id = ?',
//             [id],
//             (_, result) => { console.log('Data deleted', result) },
//             (_, error) => { console.error('Error deleting data', error) }
//         );
//     });
// };

// RESULTS
export const addResult = async (exercise: string, exercise_id: number, date: string, muscleGroup: string, reps: number, weight: number, units: string) => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'INSERT INTO results (exercise, exercise_id, date, muscleGroup, reps, weight, units) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [exercise, exercise_id, date, muscleGroup, reps, weight, units],
                    (_, result) => {
                        resolve(result.insertId);
                    },
                    (_, error) => {
                        reject(error);
                        return false
                    }
                );
            });
        });
        return { success: true, data: res };
    } catch (e) {
        return handleTransactionError(e, 'Failed to add result', 'addResult')
    }
};

export const updateResult = async (id: number, exercise: string, exercise_id: number, date: string, muscleGroup: string, reps: number, weight: number, units: string) => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'UPDATE results SET exercise = ?, exercise_id = ?, date = ?, muscleGroup = ?, reps = ?, weight = ?, units = ? WHERE id = ?',
                    [exercise, exercise_id, date, muscleGroup, reps, weight, units, id],
                    (_, result) => resolve(result.rowsAffected),
                    (_, error) => {
                        reject(error)
                        return false
                    }
                );
            });
        });
        if (typeof res === 'number' && res > 0)  {
            return { success: true, data: res };
        }
        return { success: false, error: 'No rows were updated' };
    } catch (e) {
        return handleTransactionError(e, 'Failed to update result', 'updateResult')
    }
};

export const deleteResult = async (id: number) => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    'DELETE FROM results WHERE id = ?',
                    [id],
                    (_, result) => resolve(result.rowsAffected),
                    (_, error) => {
                        reject(error)
                        return false
                    }
                );
            });
        });
        if (typeof res === 'number' && res > 0) {
            return { success: true, data: res };
        }
        return { success: false, error: 'No rows were deleted' };
    } catch (e) {
        return handleTransactionError(e, 'Failed to delete result', 'deleteResult')
    }
};

export const fetchResultById = async (id: number) => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM results WHERE id = ?`,
                    [id],
                    (_, result) => resolve(result.rows._array[0]),
                    (_, error) => {
                        reject(error)
                        return false
                    }
                );
            });
        });
        return { success: true, data: res, error: '' };
    } catch (e) {
        return handleTransactionError(e, 'Failed to fetch result', 'fetchResultById')
    }
};

export const fetchResultsByExerciseId = async (exercise_id: number): Promise<DBResult<TResult[]>>=> {
    try {
        const res: TResult[] = await new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * from results WHERE exercise_id = ?`,
                    [exercise_id],
                    (_, result) => {
                        const results: TResult[] = result.rows._array;
                        resolve(results);
                    },
                    (_, error) => {
                        reject(error)
                        return false
                    }
                );
            });
        });
        return { success: true, data: res };
    } catch (e) {
        return handleTransactionError(e, 'Failed to fetch result by exercise id', 'fetchResultsByExerciseId')
    }
};

export const deleteTables = () => {
    db.transaction((tx) => {
        tx.executeSql(
            'DROP TABLE exercises',
            [],
            (_, result) => {
                console.log('Data table exercises', result);
                return true
            },
            (_, error) => {
                console.error('Error deleting table exercises', error);
                return false
            }
        );
    });

    db.transaction((tx) => {
        tx.executeSql(
            'DROP TABLE results',
            [],
            (_, result) => {
                console.log('Data table results', result);
                return true
            },
            (_, error) => {
                console.error('Error deleting table results', error);
                return false
            }
        );
    });
};
