import React, { useRef, useEffect, useState } from 'react'
import {
    Text, View, Image, TouchableOpacity, TextInput, Alert,
    ScrollView, StyleSheet, Dimensions,
} from 'react-native';
import Nutmeg from '../../assets/nutmeg_challenge.jpg';
import Rabona from '../../assets/rabona_challenge.jpg';
import Kick from '../../assets/kick_challenge.jpg';
import firebase from 'firebase';
import { app } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import moment from 'moment';

const Challenges = ({ navigation, deletemsg }) => {
    const deviceId = useSelector(d => d.user.device_id)
    const [click, setclick] = useState(false);
    const [challenge, setChallenge] = useState(null);
    const [challengeId, setChallengeId] = useState(null);
    const [time, setTime] = useState(null)
    const [AcceptorName, setAcceptorName] = useState('');

    const arr = [
        { id: 1, img: Rabona, text: 'Rabona' },
        { id: 2, img: Kick, text: 'Kick' },
        { id: 3, img: Nutmeg, text: 'Nutmeg' }
    ];
    useEffect(() => {
        setclick(true)
        app.database().ref('challenges').orderByChild('deviceId').equalTo(deviceId)
            .get().then(res => {
                const obj = Object.values(res.toJSON())
                setChallengeId(Object.keys(res.toJSON()));
                setChallenge(arr.filter((v, i) => v.text === obj[0].categoryType))
                setAcceptorName(obj[0].acceptedBy);
                setTime(moment(obj[0].createdAt).fromNow());
                setclick(false);

            }).catch(e => {
                setclick(false);
                console.log('==>', e);
            })
    }, [])
    console.log('challenges.js', challengeId)
    const createChallenge = async id => {
        setclick(true)
        try {
            app.database().ref('challenges').push({
                deviceId,
                categoryType: id,
                creatorId: deviceId,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            }).then(response => {
                setclick(false);
                response.get().then(res => {
                    setChallengeId(res.key);
                    setChallenge(arr.filter((v, i) => v.text === res.toJSON().categoryType))
                    setAcceptorName(res.toJSON().acceptedBy)
                    setTime(moment(res.toJSON().createdAt).fromNow())
                })
                    .catch(e => { })
            }).catch(e => {
                setclick(false);
            })
        }
        catch (error) {
            console.log(error)
        }
    }
    const deleteChallenge = async () => {
        try {
            Alert.alert(
                "REMOVE CHALLENGE!!",
                "Are You sure you want to delete challenge?",
                [
                    {
                        text: "Cancel",
                        onPress: () => { },
                        style: "cancel"
                    },
                    {
                        text: "OK", onPress: async () => {
                            setclick(true);
                            console.log('che_id', challengeId);
                            await app.database().ref('challenges/' + challengeId).remove();
                            await app.database().ref('challenge_ratings/' + challengeId).remove();
                            setChallenge(null);
                            setTime(null)
                            setclick(false);
                        }
                    }
                ]
            );
        } catch (error) {
            console.log('cannot delete challenge')
        }
    }

    return (
        <View >
            <Text style={{ fontSize: width * 0.09, alignSelf: 'center' }}>Challenges</Text>
            <View style={{
                opacity: click ? 0.2 : 1,
                zIndex: 3,
                justifyContent: 'center'
            }}>
                {click ? <ActivityIndicator style={{
                    position: 'absolute',
                    zIndex: 10, alignSelf: 'center'
                }}
                    color='purple' size='large' /> : null}
                {challenge !== null ? <View style={{ ...styles.card, height: height * 0.47 }}>
                    <Image style={styles.img}
                        resizeMode='cover'
                        source={challenge[0].img}
                    />
                    <View style={{ marginTop: 5, justifyContent: 'space-evenly' }}>
                        <Text style={{ alignSelf: 'center', marginBottom: 10 }}>you created {challenge[0].text} challenge about {time}</Text>
                        <TouchableOpacity style={{
                            ...styles.btn, alignSelf: 'center',
                            marginBottom: 10
                        }} onPress={deleteChallenge}>
                            <Text style={{ color: 'white' }}>Remove Now </Text>
                        </TouchableOpacity>
                    </View>
                    {AcceptorName !== undefined &&
                        <><Text>CONGRATULATIONS! your challenge has been accepted by {' '}{AcceptorName}</Text>
                            <TouchableOpacity style={{ ...styles.btn, alignSelf: 'center', backgroundColor: 'green' }}
                                onPress={() => navigation.navigate('accepted',
                                    { deviceId, challenge_id: challengeId[0] })}>
                                <Text style={{ color: 'white' }}>Play</Text>
                            </TouchableOpacity></>}
                </View> :
                    <View >{arr.map((v, i) => <View key={i} style={styles.card}>
                        <TouchableOpacity>
                            <Image style={styles.img}
                                resizeMode='cover'
                                source={v.img} />
                            <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                <Text style={{ marginTop: 5, fontSize: 20, fontWeight: 'bold' }}>{v.text}</Text>
                                <TouchableOpacity style={styles.btn} disabled={click} onPress={() => createChallenge(v.text)}>
                                    <Text style={{ color: 'white' }}>Create challenge</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>)}
                    </View>}
            </View>
        </View >
    )
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({

    card: {
        width: width * 0.99,
        margin: 5,
        marginTop: 0,
        height: height * 0.29,
        elevation: 2,
        borderRadius: 5,
        alignSelf: 'center'
    },
    img: {
        width: width * 0.98,
        alignSelf: 'center',
        height: height * 0.19,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    btn: {
        width: width * 0.5,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'purple',
    },
})
export default Challenges;

// {open && <Modal onRequestClose={() => setopen(false)} >
//                 <View style={{
//                     margin: 20, alignContent: 'center', alignItems: 'center',
//                     display: 'flex', alignSelf: 'center'
//                 }}><Text style={{ fontSize: 40 }}>Create Highlight</Text>
//                     <TextInput placeholder='set highlight details...' style={styles.input}
//                         value={text} onChangeText={t => settext(t)} />
//                     <View style={{
//                         display: 'flex', flexDirection: 'row',
//                         justifyContent: 'space-between'
//                     }}>
//                         <TouchableOpacity style={{ ...styles.btn, backgroundColor: 'gray' }}
//                             onPress={() => { setopen(false); }}><Text>cancel</Text></TouchableOpacity>
//                         <TouchableOpacity style={styles.btn} onPress={submit}><Text>Create</Text></TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>}