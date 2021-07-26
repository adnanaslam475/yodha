import React, { useEffect, useState } from 'react'
import {
    View, Text, ToastAndroid, ActivityIndicator,
    TouchableOpacity, ScrollView, Dimensions
} from 'react-native'
import { styles } from '../styles'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign'
// import * as affir from './dummyAffirmations'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db, ExecuteQuery } from './Sqlite';

const audioRecorderPlayer = new AudioRecorderPlayer();
const RecordingList = ({ route, navigation }) => {
    const [curr, setCurr] = useState('')
    const [playComplete, setPlayComplete] = useState(false);
    const [list, setList] = useState([])
    const [loading, setloading] = useState(true);
    const [time, settime] = useState('')

    const toast = msg => {
        return ToastAndroid.show(msg,
            ToastAndroid.SHORT, ToastAndroid.CENTER)
    }

    const onStartPlay = async (id, file) => {
        setCurr(id)
        setPlayComplete(true);
        const filepath = `${RNFS.DocumentDirectoryPath}/123.mp4`;
        RNFS.writeFile(filepath, file, 'base64').then(async () => {
            await audioRecorderPlayer.startPlayer(filepath);
            await audioRecorderPlayer.setVolume(1.0);
            audioRecorderPlayer.addPlayBackListener(e => {
                if (e.currentPosition === e.duration) {
                    settime(e.currentPosition);
                    setPlayComplete(false)
                    setCurr('');
                    onStartPlay(id, file)
                }
                return;
            })
        })
    }

    useEffect(() => {
        setloading(false)
        const SelectQuery = async () => {
            let arr = []
            let selectQuery = await ExecuteQuery("SELECT * FROM RECORDINGS", []);
            var rows = selectQuery.rows;
            for (let i = 0; i < rows.length; i++) {
                arr.push({
                    id: rows.item(i).ID,
                    name: rows.item(i).name,
                    file: rows.item(i).file
                })
            }
            setList(arr)
        }
        SelectQuery();
    }, [route.params])


    const deleteaffirmtion = async id => {
        try {
            await ExecuteQuery(`DELETE FROM RECORDINGS WHERE ID=${id}`, []);
            setList(list.filter((v, i) => v.id !== id))
            toast('deleted successfully')
        }
        catch (error) {
            toast('cannot delete')
        }
    }

    const onStopPlay = async () => {
        await audioRecorderPlayer.stopPlayer();
        await audioRecorderPlayer.removePlayBackListener();
        setCurr('')
    };

    return (
        <ScrollView>
            {loading ? <ActivityIndicator color='red' size='large' style={styles.act} /> :
                list.map((v, i) => {
                    return (<View key={i} style={{
                        ...styles.card,
                        backgroundColor: 'pink'
                    }}>
                        <Text style={{ width: width * 0.6 }}>{v.name}</Text>
                        <AntDesign name='delete'
                            onPress={() => deleteaffirmtion(v.id)}
                            color='gray' size={40} />
                        {playComplete && curr == v.id ? <Ionicons name={'pause'}
                            style={{}}
                            onPress={onStopPlay}
                            color='gray' size={40} /> : <Ionicons name={'play'}
                                style={{}}
                                onPress={() => onStartPlay(v.id, v.file)}
                                color='gray' size={40} />}
                        <AntDesign name='edit'
                            onPress={() => navigation.navigate('affirm_create',
                                { data: v })}
                            color='gray' size={40} />
                    </View>)
                })}
        </ScrollView>
    )
}

const { width, height } = Dimensions.get('window')
export default RecordingList;