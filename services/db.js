import * as SQLite from 'expo-sqlite/legacy';


const db = SQLite.openDatabase('progressive_overload_tracker.db');

const createTables = () => {
    // exercises
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS exercises (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                title TEXT NOT NULL,
                type TEXT NOT NULL
            );`
        );
    });

    // results
    db.transaction(tx => {
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
            (_, result) => console.log('result', result),
            (_, error) => console.log('error', error)
        );
    });
};


// EXERCISES
const addExercise = async (title, type) => {
    try {
        const exists = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT COUNT(*) AS count FROM exercises WHERE title = ? AND type = ?',
                    [title, type],
                    (_, result) => resolve(result.rows.item(0).count > 0),
                    (_, error) => reject(error)
                );
            });
        });

        if (exists) {
            throw new Error('This exercise already exists')
        }

        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO exercises (title, type) VALUES (?, ?)', 
                    [title, type], 
                    (_, result) => resolve(true),
                    (_, error) => reject(error)
                );
            });
        });
        return res;
    } catch (e) {
        console.error('addExercise error', e)
        throw new Error(e. message || e)
    }
};


const fetchExercises = async () => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM exercises ORDER BY title',
                    [],
                    (_, result) => resolve(result.rows._array),
                    (_, error) => reject(error)
                );
            });
        });
        return res
    } catch (e) {
        console.error('fetchExercises error', e)
        throw new Error(e)
    };
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
const addResult = async (exercise, exercise_id, date, muscleGroup, reps, weight, units) => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO results (exercise, exercise_id, date, muscleGroup, reps, weight, units) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [exercise, exercise_id, date, muscleGroup, reps, weight, units],
                    (_, result) => {
                        resolve(true)
                    },
                    (_, error) => {
                        reject(error)
                    }
                );
            });
        })
        return res;
    } catch (e) {
        console.error('addResult error', e)
        throw new Error(e)
    }
};


const updateResult = async (id, exercise, exercise_id, date, muscleGroup, reps, weight, units) => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'UPDATE results SET exercise = ?, exercise_id = ?, date = ?, muscleGroup = ?, reps = ?, weight = ?, units = ? WHERE id = ?',
                    [exercise, exercise_id, date, muscleGroup, reps, weight, units, id],
                    (_, result) => resolve(true),
                    (_, error) => reject(error)
                )
            })
        })
        return res
    } catch (e) {
        console.error('updateResult error', e)
        throw new Error(e)
    }
}


const deleteResult = async (id) => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM results WHERE id = ?',
                    [id],
                    (_, result) => resolve(true),
                    (_, error) => reject(error)
                )
            })
        })
        return res
    } catch (e) {
        console.error('deleteResult error', e)
        throw new Error(e)
    }
}

const fetchResultById = async (id) => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM results WHERE id = ?`,
                    [id],
                    (_, result) => resolve(result.rows._array[0]),
                    (_, error) => reject(error)
                )
            })
        })
        return res
    } catch (e) {
        console.error('fetchResultById error', e)
        throw new Error(e)
    }
}

const fetchResultByExerciseId = async (exercise_id) => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * from results WHERE exercise_id = ?`,
                    [exercise_id],
                    (_, result) => resolve(result.rows._array),
                    (_, error) => reject(error)
                )
            })
        })
        return res
    } catch (e) {
        console.error('fetchResultByExercise error', e)
        throw new Error(e)
    }
}

const fetchResults = async (sorting = 'asc') => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    `SELECT * FROM results ORDER BY date ${sorting}`,
                    [],
                    (_, result) => resolve(result.rows._array),
                    (_, error) => reject(error)
                )
            })
        })
        return res
    } catch (e) {
        console.error('fetchResults error', e)
        throw new Error(e)
    } 
};

const deleteTables = () => {
    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE exercises',
            [],
            (_, result) => { console.log('Data table exercises', result) },
            (_, error) => { console.error('Error deleting table exercises', error) }
        )
    })

    db.transaction(tx => {
        tx.executeSql(
            'DROP TABLE results',
            [],
            (_, result) => { console.log('Data table results', result) },
            (_, error) => { console.error('Error deleting table results', error) }
        )
    })

}

export { 
    db,
    createTables, 
    addExercise,
    // updateExercise,
    // deleteExercise, 
    fetchExercises,
    addResult,
    updateResult,
    deleteResult,
    fetchResults,
    fetchResultByExerciseId,
    fetchResultById,
    deleteTables
}