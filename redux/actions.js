export const GET_AFFIRMATIONS = 'GET_AFFIRMATIONS';
export const PUSH_AFFIRMATIONS = 'PUSH_AFFIRMATIONS';
export const SAVED_SETTINGS = 'SAVED_SETTINGS'
import { db } from '../screens/Sqlite'
import * as affirmations from '../screens/dummyAffirmations'

export const pushallaffirmation = () => {
    return async dispatch => {
        try {
            affirmations.Generalaffirmation.forEach(v => {
                db.transaction(async tx => {
                    db.transaction(tx => {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + `${v.name} ` +
                            '(ID INTEGER PRIMARY KEY AUTOINCREMENT, qoutes null);')
                    }).then(res => {
                        console.log('res');
                        db.transaction(async tx => {
                            await tx.executeSql(`INSERT INTO ${v.name} (qoutes) VALUES (?)`,
                                [v.values])
                        })
                        dispatch({
                            type: PUSH_AFFIRMATIONS,
                            data: v
                        })
                    })
                })
            })
        }
        catch (e) {
            console.log('errors')
        }
    }
}
export const getdata = () => {
    return async dispatch => {
        try {
            await db.transaction(async tx => {
                await tx.executeSql('SELECT * FROM affirmations2', [], (tx, results) => {
                    const arr = []
                    for (let i = 0; i < results.rows.length; i++) {
                        arr.push(results.rows.item(i));
                    }
                    dispatch({
                        type: GET_AFFIRMATIONS,
                        data: arr,
                    })
                })
            })
            // await db.transaction(async tx => {
            //     await tx.executeSql('SELECT * FROM affirmations2', [], (tx, results) => {
            //         var len = results.rows.length;
            //         console.log(results.rows)
            //         dispatch({
            //             type: GET_AFFIRMATIONS,
            //             data: results.rows,
            //         })
            //     })
            // })
        }
        catch (error) {
            throw error
        }
    }
}