import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(false);
export const db = SQLite.openDatabase({
    name: "SQLite2",
    location: 'default'
}, () => { console.log('db create sucess=================>') },
    error => {
        console.log('err to craete=>')
    })

export const ExecuteQuery = (sql, params = []) => new Promise((resolve, reject) => {
    db.transaction((trans) => {
        trans.executeSql(sql, params, (trans, results) => {
            resolve(results);
            console.log('resolve')
        },
            (error) => {
                reject(error);
                console.log('reject')
            });
    });
});
export const createTable = async () => {
    await db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + 'affirmations3 ' +
            '(ID INTEGER PRIMARY KEY AUTOINCREMENT, qoute TEXT, file TEXT);')
    })
}