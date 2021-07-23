import React, { useEffect, useState } from 'react'
import {
    View, Text, ToastAndroid, ActivityIndicator,
    TouchableOpacity, ScrollView, Dimensions
} from 'react-native'
import { styles } from '../styles'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import * as affir from './dummyAffirmations'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from './Sqlite'

const audioRecorderPlayer = new AudioRecorderPlayer();
const RecordingList = ({ route, navigation }) => {
    // const [affirmations, setAffirmations] = useState([])
    const [curr, setCurr] = useState('')
    const [playComplete, setPlayComplete] = useState(false);
    const [list, setList] = useState([])
    const [loading, setloading] = useState(true)


    console.log('reording slit', route.params)
    const onStartPlay = async id => {
        setCurr(id)
        setPlayComplete(true);
        let newpath = '';
        await db.transaction(async tx => {
            await tx.executeSql(`SELECT * FROM ${route.params} WHERE ID=${id}`,
                [], (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {
                        newpath = results.rows.item(i).file
                    }
                    if (newpath) {
                        const filepath = `${RNFS.DocumentDirectoryPath}/123.mp4`;
                        RNFS.writeFile(filepath, newpath, 'base64').then(async () => {
                            await audioRecorderPlayer.startPlayer(filepath);
                            await audioRecorderPlayer.setVolume(1.0);
                            audioRecorderPlayer.addPlayBackListener(e => {
                                if (e.currentPosition === e.duration) {
                                    setPlayComplete(false)
                                    setCurr('')
                                }
                                return;
                            })
                        })
                    }
                })
        })
    }

    useEffect(() => {
        setloading(false)
         async function f() {
            await db.transaction(tx => {
                tx.executeSql(`SELECT * FROM RECORDINGS`, [], (tx, results) => {
                    var affirmationarr = [];
                    for (let i = 0; i <= results.rows.length; i++) {
                        console.log('record from db',results.rows.item())
                        affirmationarr.push({
                            id: results.rows.item(i).ID,
                            name: results.rows.item(i).name,
                            filexist: results.rows.item(i).file ? true : false,
                            file: results.rows.item(i).file
                        })
                    }
                    setList(affirmationarr)
                })
            })
        };
        f();
    }, [])

    // const deleteaffirmtion = async id => {
    //     try {
    //         await db.transaction(async tx => {
    //             await tx.executeSql(`DELETE FROM RECORDINGS WHERE ID=${id}`,
    //                 [], (tx, results) => {
    //                     setAffirmations(affirmations.filter((v, i) => v.id !== id))
    //                     ToastAndroid.show('deleted successfully',
    //                         ToastAndroid.SHORT, ToastAndroid.CENTER)
    //                 })
    //         })
    //     }
    //     catch (error) {
    //     }
    // }


    return (
        <ScrollView>
            {loading ? <ActivityIndicator color='red' size='large' style={styles.act} /> :
                list?.map((v, i) => {
                    return (<TouchableOpacity key={i} style={{
                        ...styles.card,
                        backgroundColor: 'pink'
                    }}>
                        <Text style={{ width: width * 0.87 }}>{v.name}</Text>
                        <Ionicons name='add' onPress={() => add(v)} size={30} />
                    </TouchableOpacity>)
                })
            }
        </ScrollView >
    )
}

const { width, height } = Dimensions.get('window')
export default RecordingList;