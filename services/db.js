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

const addResult = (exercise, date, muscleGroup, reps, weight, units) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO results (exercise, date, muscleGroup, reps, weight, units) VALUES (?, ?, ?, ?, ?, ?)',
            [exercise, date, muscleGroup, reps, weight, units],
            (_, result) => { console.log('Data inserted', result) },
            (_, error) => { console.error('Error inserting data', error) }
        )
    })
}

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
}

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
        })
        return res
    } catch (e) {
        console.error('fetchExercises', e)
    }
}

// const updateExercise = (id, newTitle, newType) => {
//     db.transaction(tx => {
//         tx.executeSql(
//         'update exercises set title = ?, type = ? where id = ?',
//         [newTitle, newType, id],
//         (_, result) => {
//             console.log('Data updated', result);
//         },
//         (_, error) => {
//             console.log('Error updating data', error);
//         }
//         );
//     });
// };

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

// const deleteTable = () => {
//     db.transaction(tx => {
//         tx.executeSql('DROP TABLE exercises'),
//         [],
//         null,
//         null
//     })
// }



// const muscleGroups = ['trapezius', 'shoulders', 'chest', 'biceps', 'triceps', 'forearms', 'legs', 'glutes', 'back', 'abs', 'cardio'];

// const populateDB = () => {
//     db.transaction(tx => {
//         tx.executeSql(
//             'CREATE TABLE IF NOT EXISTS muscleGroups (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)',
//             [],
//             (_, result) => { console.log('Table muscleGroups has been created', result); },
//             (_, error) => { console.log('Error while creating muscleGroups', error); }
//         );
//     });

//     for (let i of muscleGroups) {
//         db.transaction(tx => {
//             tx.executeSql(
//                 'INSERT INTO muscleGroups (title) VALUES (?)',
//                 [i], // Correctly passing the value array
//                 (_, result) => { console.log(`Data inserted for ${i}`, result); },
//                 (_, error) => { console.log(`Error inserting data for ${i}`, error); }
//             );
//         });
//     }
// };


export { 
    db,
    createTables, 
    fetchExercises, 
    addExercise, 
    deleteExercise, 
    fetchResults,
    addResult,
}