import React, { useEffect, useState } from 'react'
import {
    View, Text, ToastAndroid, ActivityIndicator,
    TouchableOpacity, ScrollView, Dimensions
} from 'react-native'
import { styles } from '../styles'
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import RNFS from 'react-native-fs';
// import * as affir from './dummyAffirmations'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db } from './Sqlite'

const MyAffirmations = ({ route, navigation }) => {
    const [affirmations, setAffirmations] = useState([])
    const [list, setList] = useState([])
    const [loading, setloading] = useState(true)

    useEffect(() => {
        setloading(false)
        const f = async function () {
            await db.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${route.params.title}`, [], (tx, results) => {
                    var affirmationarr = [];
                    for (let i = 0; i <= results.rows.length; i++) {
                        affirmationarr.push({
                            id: results.rows.item(i).ID,
                            qoute: results.rows.item(i).qoute,
                        })
                    }
                    setList(affirmationarr)
                })
            })
        }
        f();
    }, [])



    const deleteaffirmtion = async id => {
        try {
            await db.transaction(async tx => {
                await tx.executeSql(`DELETE FROM ${route.params?.title} WHERE ID=${id}`,
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


    return (
        <ScrollView>
            {loading ? <ActivityIndicator color='red' size='large' style={styles.act} /> :
                list.map((v, i) => {
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
export default MyAffirmations;