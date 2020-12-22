import firebase from 'firebase';

class Backend {
    uid = '';
    messagesRef = null;
    // initialize Firebase Backend
    constructor() {
        if (!firebase.apps.length) {
        firebase.initializeApp({
            
            apiKey: "AIzaSyDMsNj3Ymu74XW9MO4pgjX9k1atmHSfO64",
            authDomain: "reactpwa-2a98d.firebaseapp.com",
            projectId: "reactpwa-2a98d",
            storageBucket: "reactpwa-2a98d.appspot.com",
            messagingSenderId: "679472623547",
            appId: "1:679472623547:web:3eb02527f5ed5e11c91e9e",
            measurementId: "G-9BTSLHLNHG"
        })}
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setUid(user.uid);
            } else {
                return null
            }
        });
    }
    setUid(value) {
        this.uid = value;
    }
    getUid() {
        return this.uid;
    }
    // retrieve the messages from the Backend
    loadMessages(callback) {
        this.messagesRef = firebase.database().ref('messages');
        this.messagesRef.off();
        const onReceive = (data) => {
            const message = data.val();
            callback({
                _id: data.key,
                text: message.text,
                createdAt: new Date(message.createdAt),
                user: {
                    _id: message.user._id,
                    name: message.user.name,
                },
            });
        };
        this.messagesRef.limitToLast(20).on('child_added', onReceive);
    }
    // send the message to the Backend
    sendMessage(message) {
        for (let i = 0; i < message.length; i++) {
            this.messagesRef.push({
                text: message[i].text,
                user: message[i].user,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
            });
        }
    }
    // close the connection to the Backend
    closeChat() {
        if (this.messagesRef) {
            this.messagesRef.off();
        }
    }
}

export default new Backend()

// import firebase from 'firebase';

// class Fire {
//     constructor() {
//         this.init();
//     }
//     // 2.
//     init = () =>
//         firebase.initializeApp({
//             apiKey: "AIzaSyCp-f4Ok-rYZvdWH2ahfk4kos8yvMiU88M",
//             authDomain: "chatwithfirebase-45c82.firebaseapp.com",
//             databaseURL: "https://chatwithfirebase-45c82.firebaseio.com",
//             projectId: "chatwithfirebase-45c82",
//             storageBucket: "chatwithfirebase-45c82.appspot.com",
//             messagingSenderId: "82883003307",
//             appId: "1:82883003307:web:c00941d0d25e1135f508ee",
//             measurementId: "G-3392HSNWHL"
//         });
// }
// Fire.shared = new Fire();
// export default Fire;