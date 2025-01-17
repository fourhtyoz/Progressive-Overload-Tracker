import * as SQLite from 'expo-sqlite/legacy';


const db = SQLite.openDatabase('db.db');

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
                exercise TEXT NOT NULL,
                date TEXT NOT NULL,
                muscleGroup TEXT NOT NULL,
                reps INTEGER NOT NULL,
                weight INTEGER NOT NULL,
                units TEXT NOT NULL
            );`
        );
    });
};


// EXERCISES
const addExercise = (title, type) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO exercises (title, type) VALUES (?, ?)', 
            [title, type], 
            (_, result) => { console.log('Data inserted', result) },
            (_, error) => { console.error('Error inserting data', error) }
        );
    });
};


const fetchExercises = async () => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM exercises',
                    [],
                    (_, result) => resolve(result.rows._array),
                    (_, error) => reject(error)
                );
            });
        });
        return res
    } catch (e) {
        console.error('fetchExercises', e)
    };
};


const updateExercise = (id, title, type) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE exercises SET title = ?, type = ? WHERE id = ?',
            [title, type, id],
            (_, result) => { console.log('Data updated', result) },
            (_, error) => { console.error('Error updating data', error) }
        );
    });
};


const deleteExercise = (id) => {
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM exercises WHERE id = ?',
            [id],
            (_, result) => { console.log('Data deleted', result) },
            (_, error) => { console.error('Error deleting data', error) }
        );
    });
};


// RESULTS
const addResult = (exercise, date, muscleGroup, reps, weight, units) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO results (exercise, date, muscleGroup, reps, weight, units) VALUES (?, ?, ?, ?, ?, ?)',
            [exercise, date, muscleGroup, reps, weight, units],
            (_, result) => { console.log('Data inserted', result) },
            (_, error) => { console.error('Error inserting data', error) }
        );
    });
};


const updateResult = (id, date, reps, weight ) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE results SET date = ?, reps = ?, weight = ? WHERE id = ?',
            [date, reps, weight, id],
            (_, result) => { console.log('Data updated', result) },
            (_, error) => { console.error('Error updating data', error) }
        );
    });
};



const deleteResult = (id) => {
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM results WHERE id = ?',
            [id],
            (_, result) => { console.log('Data deleted', result) },
            (_, error) => { console.error('Error deleting data', error) }
        );
    });
};


const fetchResults = async () => {
    try {
        const res = await new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM results',
                    [],
                    (_, result) => resolve(result.rows._array),
                    (_, error) => reject(error)
                )
            })
        })
        return res
    } catch (e) {
        console.error('fetchResults', e)
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
    updateExercise,
    deleteExercise, 
    fetchExercises, 
    addResult,
    updateResult,
    deleteResult,
    fetchResults,
    deleteTables
}