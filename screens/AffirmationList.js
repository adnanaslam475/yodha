import React, { useEffect, useState } from 'react'
import {
    View, Text, ToastAndroid, ActivityIndicator,
    TouchableOpacity, ScrollView, Alert, Dimensions
} from 'react-native'
import { styles } from '../styles'
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from './Sqlite'

const audioRecorderPlayer = new AudioRecorderPlayer();
const AffirmationList = ({ route, navigation }) => {
    const [affirmations, setAffirmations] = useState([])
    const [curr, setCurr] = useState('')
    const [playComplete, setPlayComplete] = useState(false);
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
        const f = async () => {
            try {
                await db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM ${route.params?.title}`, [], (tx, results) => {
                        var arr = [];
                        for (let i = 0; i <= results.rows.length; i++) {
                            arr.push({
                                id: results.rows.item(i).ID,
                                qoute: results.rows.item(i).qoute,
                                filexist: results.rows.item(i).file ? true : false,
                                file: results.rows.item(i).file
                            })
                            setAffirmations(results.rows.length == (i + 1) ? arr : []);
                        }
                    })
                })
            }
            catch (error) {
                setloading(false)
            }
        }
        f();
        setloading(false)
        route.params?.save && ToastAndroid.show(route.params?.save,
            ToastAndroid.SHORT, ToastAndroid.CENTER);
    }, [route.params])



    const deleteaffirmtion = async id => {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(`DELETE FROM ${route.params.title} WHERE ID=${id}`,
                    [], (tx, results) => {
                        setAffirmations(affirmations.filter((v, i) => v.id !== id))
                        ToastAndroid.show('deleted successfully',
                            ToastAndroid.SHORT, ToastAndroid.CENTER)
                    })
            })
        }
        catch (error) {
        }
    }


    console.log('a-->', affirmations.length)
    return (
        <ScrollView>
            {loading ? <ActivityIndicator color='red' size='large' style={styles.act} /> :
                affirmations?.map((v, i) => {
                    return (<TouchableOpacity key={i} style={styles.card}
                        onPress={() => navigation.navigate('create',
                            { title: route.params?.title, data: v })}>
                        <Text style={{ fontFamily: 'Roboto-bold' }}>{v.qoute}</Text>
                        {v.filexist == true && <View style={styles.icon}>
                            {(!curr && playComplete == false) || curr !== v.id ? <Ionicons
                                name={'play'}
                                onPress={() => onStartPlay(v.id)}
                                size={30} color='gray' />
                                : <Ionicons
                                    name={'pause'}
                                    size={30} color='gray' />}
                        </View>}
                        <AntDesign name='delete' size={30}
                            style={{
                                position: 'absolute', right: v.filexist ?
                                    height * 0.1 : height * 0.042
                            }}
                            color='gray' onPress={() => deleteaffirmtion(v.id)} />
                    </TouchableOpacity>)
                })}
        </ScrollView >
    )
}

const { width, height } = Dimensions.get('window')
export default AffirmationList;