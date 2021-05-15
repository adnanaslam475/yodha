import React, { useRef, useEffect, useState } from 'react'
// import RNVideo from 'react-native-video';
import {
    Text, View, Image, TouchableOpacity, TextInput,
    ScrollView, StyleSheet, Dimensions, Modal, Alert, SegmentedControlIOS,
} from 'react-native';
import { app } from '../../firebaseConfig';

import YouTube from 'react-native-youtube'
import { useSelector } from 'react-redux';

const MatchHighLights = ({ route }) => {
    const deviceId = useSelector(d => d.user.device_id);
    const [open, setopen] = useState(false)
    const [play, setPlay] = useState(false);
    const [text, settext] = useState('');
    const [highLights, setHighlights] = useState(null);
    const [savetime, setSaveTime] = useState('');
    const [jumptime, setjumptime] = useState('');
    const videoref = useRef();
    const [highlightIds, setHighlightIds] = useState(null)
    const firebaseref = app.database().ref('highlights')


    useEffect(() => {
        const arr = []
        firebaseref.orderByChild("videoId")
            .equalTo(route.params.videoId).once("value", res => {
                const IdArr = [];
                console.log(res.toJSON())
                res.forEach(el => {
                    arr.push(el.toJSON())
                })
                setHighlights(arr)
            }).then(res => {
                setHighlightIds(Object.keys(res.toJSON()))

            }).catch(e => {
                console.log('fetch err==>', e)
            })
    }, [open])

    const timepress = async () => {
        try {
            const elapsed_sec = await videoref.current.getCurrentTime();
            const elapsed_ms = Math.floor(elapsed_sec * 1000);
            const min = Math.floor(elapsed_ms / 60000);
            const seconds = Math.floor((elapsed_ms - min * 60000) / 1000);
            setopen(true);
            if (elapsed_sec < 60) {
                setjumptime('0' + ':' + seconds.toString().padStart(2, '0'))
            }
            else if (elapsed_sec < 3540 && elapsed_sec > 60) {
                setjumptime(min.toString().padStart(2, '0') +
                    ':' +
                    seconds.toString().padStart(2, '0'))
            }
            else if (elapsed_sec > 3540) {
                const hours = Math.floor(elapsed_sec / 3600); //ye hour klye
                const newnum = elapsed_sec - (hours * 3600);
                const mints = (newnum / 60).toString().split('.')[0]
                setjumptime(hours.toString().padStart(1, '0') + ':' +
                    mints.toString().padStart(2, '0') + ':' +
                    seconds.toString().padStart(2, '0'))
            }
            setSaveTime(elapsed_sec)
        } catch (error) {
            console.log('time not get error')
        }
    }
    const timepressfromcomment = async time => {
        try {
            const times = await videoref.current.seekTo(time);
        } catch (error) {
            console.log('seek not  error')
        }
    }

    const submit = async () => {
        await firebaseref.push({
            videoId: route.params.videoId,
            text: text,
            avatar: 'https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg',
            jumptime: jumptime,
            deviceId: deviceId,
            savetime: savetime,
        }).then(r => {
            settext('');
            setopen(false);
            r.toJSON()
        }).catch(e => {
            Alert.alert(
                'Error!!!',
                "submit Error, May be network Error",
                [{ text: "OK" }]
            )
        })
    }

    const deleteHighlight = index => {
        const Id = highlightIds.filter((v, i) => i == index);
        firebaseref.child(`${Id[0]}`).remove().then(res => {
            console.log('resaaa')
            setHighlights(highLights.filter((v, i) => i !== index))
        }).catch(e => {
            Alert.alert(
                'Error!!!',
                "HighLight can't be delete, May be network Error",
                [{ text: "OK" }]
            )
        })
    }

    return (
        <View style={{
            height: height, width: width, borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        }}>
            {open && <Modal onRequestClose={() => setopen(false)} >
                <View style={{
                    margin: 20, alignContent: 'center', alignItems: 'center',
                    display: 'flex', alignSelf: 'center'
                }}><Text style={{ fontSize: 40 }}>Create Highlight</Text>
                    <Text>your highlight starts from {jumptime} </Text>
                    <TextInput placeholder='please set highlight details...' style={styles.input}
                        value={text} onChangeText={t => settext(t)} />
                    <View style={{
                        display: 'flex', flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <TouchableOpacity style={{ ...styles.btn, backgroundColor: 'lightgray' }}
                            onPress={() => setopen(false)}>
                            <Text>cancel</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.btn}
                            onPress={submit}><Text>Create</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>}
            <YouTube
                apiKey='AIzaSyD6EuzRU38k9pfvca_CbtFZ68uDxaL97wc'
                videoId={route.params.videoId}
                ref={videoref}
                onReady={() => setPlay(true)}
                play={play}
                loop
                style={{ alignSelf: 'stretch', height: height * 0.4 }}
            />
            <TouchableOpacity style={styles.btn} onPress={timepress}>
                <Text style={{ color: 'white' }}>Create Highlight</Text></TouchableOpacity>
            <ScrollView>
                <View style={{
                    alignSelf: 'center', marginBottom: 5, width: width * 0.96,
                    justifyContent: 'center', alignContent: 'center'
                }}>{highLights?.map((v, i) => {
                    return (<View key={i} style={{ display: 'flex', flexDirection: 'row' }}>
                        <Image style={styles.avatar} source={{ uri: v.avatar }} />
                        <TouchableOpacity onPress={() => timepressfromcomment(v.savetime)}>
                            <Text style={{ color: 'blue' }}>{v.jumptime}</Text></TouchableOpacity>
                        <Text style={{ flex: 1 }}>{v.text}</Text>
                        {v.deviceId === deviceId && <TouchableOpacity onPress={() => deleteHighlight(i)}>
                            <Text>Remove</Text></TouchableOpacity>}
                    </View>)
                })}
                </View>
            </ScrollView>
        </View>)
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    btn: {
        width: width * 0.4,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'purple',

    },
    avatar: {
        borderRadius: 25,
        height: height * 0.06,
        marginRight: 5,
        width: width * 0.1,

    },
    input: {
        borderWidth: 0.5,
        borderRadius: 10,
        width: width / 2, height: height / 12,
        justifyContent: 'center', alignItems: 'center',
        marginTop: 20,
    }
})
export default MatchHighLights;