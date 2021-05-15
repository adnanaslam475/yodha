import React, { useRef, useEffect, useState } from 'react'
import {
    Text, View, Image, TouchableOpacity,
    ScrollView, StyleSheet, Dimensions, Alert,
    ActivityIndicator, BackHandler, Button
} from 'react-native';
import firebase from 'firebase';
import { app } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import moment from 'moment';

const OpenChallenges = ({ navigation, route }) => {
    const deviceId = useSelector(d => d.user.device_id);
    const [challenges, setChallenges] = useState(null);
    const [disabled, setdisabled] = useState(false);
    const [challengeIds, setChallengeIds] = useState(null);
    const firebaseref = app.database().ref('challenges');
    const [click, setclick] = useState(false);
    const [text, setText] = useState('');
    const [offline, setOffline] = useState('')

    useEffect(() => {
        let arr = [];
        firebaseref.get().then(res => {
            setChallengeIds(res && Object.keys(res.toJSON()))
            res?.forEach(el => {
                arr.push(el.toJSON())
            })
            setText('There are no open challenges open yet to show')
            setChallenges(arr);
            setOffline('')
        }).catch(e => {
            setOffline('Network Error')
        })
    }, [])

    const accept = async (challenge_id, creatorId) => {
        if (deviceId === creatorId) {
            Alert.alert("SORRY!", "You cannot accept your Challenge", [{ text: "OK" }])
        }
        else {
            setclick(true);
            try {
                firebaseref.child(`${challenge_id}`).update({
                    acceptedBy: deviceId,
                    acceptedTime: firebase.database.ServerValue.TIMESTAMP
                }).then(res => {
                    setdisabled(true);
                    navigation.navigate('accepted', { deviceId, challenge_id })
                })
                    .catch(e => { console.log('errr', e) })
            } catch (error) {
                console.log(error);
            }
        }
    }
    const deleteChallenge = async (challengeId, i) => {

        try {
            Alert.alert(
                "REMOVE CHALLENGE!!",
                "Are You sure you want to delete challenge?",
                [{ text: "Cancel", style: "cancel" },
                {
                    text: "OK", onPress: async () => {
                        setclick(true);
                        console.log('che_id', challengeId);
                        await app.database().ref('challenges/' + challengeId).remove();
                        await app.database().ref('challenge_ratings/' + challengeId).remove();
                        setChallengeIds(challengeIds.filter((v, idx) => idx !== i));
                        setChallenges(challenges.filter((v, idx) => idx !== i))
                        setclick(false)
                    }
                }
                ]
            );
        } catch (error) {
            console.log('cannot delete challenge')
        }
    }




    return (
        <ScrollView style={{ opacity: click ? 0.5 : 1 }} >
            {click ? <ActivityIndicator style={{
                marginTop: height / 2, position: 'absolute',
                zIndex: 10, alignSelf: 'center', display: 'flex'
            }}
                color='purple' size='large' /> : null}
            {offline ? <Text style={{
                fontSize: 20, fontWeight: 'bold',
                textAlign: 'center'
            }}>{offline}</Text> : null}
            {challenges === null ? <View style={{
                marginTop: height * 0.3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'space-between'
            }}>
                <Text > {text} </Text>
            </View> : <Text style={{ fontSize: 40 }}>Open Challenges</Text>}
            {challenges?.map((v, i) => {
                const ids = challengeIds.filter((val, index) => index === i)
                const playBtnStatus = Object.values(v).includes(deviceId);
                return (<View style={styles.card} key={ids}
                // onLayout={() => deletechallenge(v.createdAt, ids)} 
                >
                    <TouchableOpacity style={{ zIndex: 10 }}
                    >
                        <Text style={{
                            alignSelf: 'center',
                            marginBottom: 10
                        }}>{v.deviceId === deviceId ? 'You ' : v.deviceId}
                            {' '}created a {v.categoryType} challenge about {moment(v.createdAt).fromNow()}</Text>
                    </TouchableOpacity>
                    {(v.acceptorVideo && v.creatorVideo) ? <View>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 5 }}>Completed</Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('completed', {
                                challenge_id: ids[0],
                                completed: true
                            })
                        }} style={{
                            ...styles.btn, width: width * 0.6
                        }}><Text style={styles.txt}>Rate this challenge</Text></TouchableOpacity>
                    </View> : <View style={styles.btnsView}>
                        <TouchableOpacity style={{
                            ...styles.btn,
                            opacity: v.acceptedBy !== undefined || disabled ? 0.5 : 1
                        }}
                            disabled={v.acceptedBy !== undefined || disabled}
                            onPress={() => accept(ids, v.deviceId)}>
                            <Text style={{ color: 'white' }}>{v.acceptedBy !== undefined ?
                                'Accepted' : 'Accept Now'}</Text>
                        </TouchableOpacity>
                        {/* play btn  */}
                        <TouchableOpacity style={{
                            ...styles.btn, backgroundColor: 'green',
                            opacity: v.acceptedBy === undefined || !playBtnStatus ? 0.5 : 1,
                        }}
                            disabled={v.acceptedBy === undefined || !playBtnStatus}
                            onPress={() => navigation.navigate('accepted',
                                { acceptedBy: v.acceptedBy, challenge_id: ids[0] })}>
                            <Text style={{ color: 'white' }}>Play now</Text></TouchableOpacity>
                        {v.deviceId === deviceId ? <TouchableOpacity style={{ ...styles.btn, backgroundColor: 'red' }}
                            onPress={() => deleteChallenge(ids[0], i)}>
                            <Text style={{ color: 'white' }}>Remove</Text></TouchableOpacity> : null}
                    </View>}
                </View>)
            })}
        </ScrollView>
    )
}
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    btnsView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    card: {
        width: width * 0.99,
        margin: 5,
        marginTop: 0,
        // height: height * 0.29,
        elevation: 2,
        borderRadius: 5,
        padding: 5,
        alignSelf: 'center'
    },
    txt: {
        color: 'white',
    },
    btn: {
        width: width * 0.3,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 10,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'purple',
    },
})

export default OpenChallenges;

// turboId: ac7afe6b8723e9f3