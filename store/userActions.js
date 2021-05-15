export const USERS = 'USERS'
export const DEVICE_ID = 'DEVICE_ID'
export const MY_CHALLENGE='MY_CHALLENGE';
import { app } from '../firebaseConfig';
import { getAndroidId } from 'react-native-device-info';
export const getDeviceId = () => {
    return async dispatch => {
        getAndroidId().then(id => {
            dispatch({
                type: DEVICE_ID,
                device_id: id
            })
        });
    }
}

export const myChallenge = () => {
    return async dispatch => {
        app.database().ref('challenges').orderByChild('deviceId').equalTo(deviceId)
            .get().then(res => {
                const obj = Object.values(res.toJSON())
                setChallengeId(Object.keys(res.toJSON()));
                setChallenge(arr.filter((v, i) => v.text === obj[0].categoryType))
                setTime(moment(obj[0].createdAt).fromNow())
                setclick(false)
                dispatch({
                    type:''
                })
            }).catch(e => {
                console.log(e);
            })
    }
}
export const getUsers = () => {
    return async dispatch => {
        var ref = app.database().ref("users").once('value');
        ref.then(snapshot => {
            const items = [];
            // get children as an array

            snapshot.forEach(child => {
                items.push({
                    userId: child.val().userId,
                    name: child.val().name,
                    email: child.val().email,
                    online: child.val().online
                });
            })
            dispatch({
                type: USERS,
                payload: items
            })
        })
    }
}


export const getComments = () => {
    return async dispatch => {
        var ref = app.database().ref("comments");
        ref.then(snapshot => {
            const items = [];
            // get children as an array

            snapshot.forEach(child => {
                items.push({
                    userId: child.val().userId,
                    name: child.val().name,
                    email: child.val().email,
                    online: child.val().online
                });
            })
            dispatch({
                type: USERS,
                payload: items
            })
        })
    }
}