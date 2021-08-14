import React, { useEffect, useState } from 'react'
import {
    View, Text, ToastAndroid, ActivityIndicator,
    TouchableOpacity, ScrollView, Dimensions,
    BackHandler
} from 'react-native'
import { styles } from '../styles'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import * as affir from './dummyAffirmations'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db, ExecuteQuery } from './Sqlite'

const audioRecorderPlayer = new AudioRecorderPlayer();
const AffirmationList = ({ route, navigation }) => {
    const [affirmations, setAffirmations] = useState([])
    const [curr, setCurr] = useState('')
    const [playComplete, setPlayComplete] = useState(false);
    const [list, setList] = useState([])
    const [loading, setloading] = useState(true)



    const onStartPlay = async id => {
        setCurr(id)
        setPlayComplete(true)
        let newpath = '';
        await db.transaction(async tx => {
            await tx.executeSql(`SELECT * FROM ${route.params?.title} WHERE ID=${id}`,
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
        setList(affir.Generalaffirmation.filter(v => v.name === route.params?.title)[0]?.values)
    }, [])


    useEffect(() => {
        const backAction = async () => {
            console.log('this1');
            await audioRecorderPlayer.removePlayBackListener();
            await audioRecorderPlayer.removeRecordBackListener();
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);
    

    const deleteaffirmtion = async id => {
        try {
            await ExecuteQuery(`DELETE FROM ${route.params.title} WHERE ID=${id}`, []);
            setAffirmations(affirmations.filter((v, i) => v.id !== id))
            ToastAndroid.show('deleted successfully',
                ToastAndroid.SHORT, ToastAndroid.CENTER)
        }
        catch (error) {
            console.log('err68', error)
        }
    }

    const add = async v => {
        console.log(v)
        await ExecuteQuery('CREATE TABLE IF NOT EXISTS ' + `${route.params.title} ` +
            '(ID INTEGER PRIMARY KEY AUTOINCREMENT, qoutes TEXT);')
        await ExecuteQuery(`INSERT INTO ${route.params.title} (qoutes) VALUES (?)`, [v]);
        ToastAndroid.show('added successfully',
            ToastAndroid.SHORT, ToastAndroid.CENTER);
    }

    return (
        <ScrollView>
            {loading ? <ActivityIndicator color='red' size='large' style={styles.act} /> :
                list?.map((v, i) => {
                    return (<TouchableOpacity key={i} style={{
                        ...styles.card,
                        backgroundColor: 'pink'
                    }}>
                        <Text style={{ width: width * 0.87 }}>{v}</Text>
                        <Ionicons name='add' onPress={() => add(v)} size={30} />
                    </TouchableOpacity>)
                })
            }
        </ScrollView >
    )
}

const { width, height } = Dimensions.get('window')
export default AffirmationList;