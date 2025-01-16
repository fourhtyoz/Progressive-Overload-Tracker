import * as SQLite from 'expo-sqlite/legacy';


const db = SQLite.openDatabase('db.db');

const createTable = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, type TEXT);'
      );
    });
};

const addExercise = (title, type) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO exercises (title, type) VALUES (?, ?)', 
            [title, type], 
            (_, result) => { console.log('Data inserted', result) },
            (_, error) => { console.log('Error inserting data', error) }
        );
    });
};

const fetchExercises = () => {
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM exercises',
            [],
            (_, result) => { console.log('Data fetched:', result.rows._array) },
            (_, error) => { console.log('Error fetching data', error) }
        );
    });
};

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
            (_, error) => { console.log('Error deleting data', error) }
        );
    });
};

export { createTable, fetchExercises, addExercise, deleteExercise }