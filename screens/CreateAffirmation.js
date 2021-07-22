import React, { useState, useEffect } from 'react'
import {
    TouchableOpacity, TextInput,
    Text, View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { db } from './Sqlite'
import RNFetchBlob from 'rn-fetch-blob';
import { styles } from '../styles';

const audioRecorderPlayer = new AudioRecorderPlayer();

const CreateAffirmation = ({ route, navigation }) => {
    const [text, settext] = useState(route.params?.data.qoute || '')
    const [recordTime, setrecordTime] = useState('')
    const [path, setPath] = useState(route.params?.data.file || '')
    const [start, setstart] = useState(false);
    const [playcomplete, setplaycomplete] = useState(false)
    const [show, setshow] = useState(route.params?.data.file ? true : false)
    const [recordstart, setrecordstart] = useState(false)
    const [msg, setmsg] = useState('');

    console.log('recerate afiramtion')


    const onStartRecord = async () => {
        setmsg('')
        const res = await audioRecorderPlayer.startRecorder();
        audioRecorderPlayer.addRecordBackListener(e => {
            setrecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)))
        })
        setstart(true)
        setrecordstart(true)
        res && setPath(res)
    }

    const onStartPlay = async () => {
        const msg = await audioRecorderPlayer.startPlayer();
        await audioRecorderPlayer.setVolume(1.0);
        setPath(msg)
        setplaycomplete(true)
        audioRecorderPlayer.addPlayBackListener((e) => {
            if (e.currentPosition == e.duration) {
                setplaycomplete(false)
            }
            return;
        })
    };

    const onStopRecord = async () => {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        setstart(false)
        setrecordstart(false)
        console.log('klklkl', result);
    };

    const save = async () => {
        console.log(route.params?.data)
        if (text.trim().length == 0 || path.trim().length == 0) {
            setmsg('please enter affirmation or record voice')
        } else {
            try {
                let base64 = null
                if (path) {
                    const file = await RNFetchBlob.fs.readFile(path, 'base64')
                    base64 = file
                }
                db.transaction(tx => {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + `${route.params.title} ` +
                        '(ID INTEGER PRIMARY KEY AUTOINCREMENT, qoute TEXT, file TEXT);')
                })
                await db.transaction(async tx => {
                    if (route.params?.data) {
                        await tx.executeSql(`UPDATE ${route.params.title} SET qoute = ? , file = ? WHERE id = ${route.params?.data?.id}`,
                            [text, base64])
                    } else {
                        await tx.executeSql(`INSERT INTO ${route.params.title} (qoute,file) VALUES (?, ?)`,
                            [text, base64])
                    }
                })
                navigation.navigate('list',
                    {
                        title: route.params?.title,
                        save: route.params?.id ? 'update successfully' :
                            'saved successfully'
                    })
            } catch (error) {
                console.log('nahi bna 67', error)
            }
        }
    }


    return (
        <View style={{ paddingTop: 40 }}>
            <TextInput style={styles.input} placeholder='enter Affirmation'
                value={text} onChangeText={t => { settext(t); setmsg('') }} />
            <View style={{ display: 'flex', padding: 50 }}>
                {!show ? <TouchableOpacity style={{ ...styles.savebtn, backgroundColor: 'darkred' }}
                    onPress={() => setshow(true)}>
                    <Text style={styles.text}>Record new audio</Text>
                </TouchableOpacity> : <View style={styles.icon_view}>
                    {path ? <TouchableOpacity onPress={onStartPlay}>
                        <Ionicons name={playcomplete ? 'pause' : 'play'} style={{ marginLeft: 50 }}
                            color='black' size={50} />
                    </TouchableOpacity> : null}
                    <TouchableOpacity onPress={start == false ? onStartRecord : onStopRecord}>
                        <Ionicons name={'mic'}
                            color={recordstart ? 'red' : 'black'} size={50} />
                    </TouchableOpacity>
                </View>}
            </View>
            <Text style={styles.err}>{msg}</Text>
            <TouchableOpacity onPress={save}
                style={styles.savebtn} >
                <Text style={styles.text}>{route.params?.data ? 'UPDATE' : "SAVE"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default CreateAffirmation
