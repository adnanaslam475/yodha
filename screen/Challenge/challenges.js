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

    const arr = [
        { id: 1, img: Rabona, text: 'Rabona' },
        { id: 2, img: Kick, text: 'Kick' },
        { id: 3, img: Nutmeg, text: 'Nutmeg' }
    ];

    const createChallenge = id => {
        setclick(true)
        app.database().ref('challenges').push({
            deviceId,
            categoryType: id,
            creatorId: deviceId,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        }).then(response => {
            setclick(false)
            navigation.replace('open-challenges');
        }).catch(e => {
            setclick(false);
        })
    }


    return (
        <View style={{ opacity: click ? 0.5 : 1 }} >
            {click ? <ActivityIndicator style={{
                marginTop: height / 2, position: 'absolute',
                zIndex: 10, alignSelf: 'center', display: 'flex'
            }}
                color='purple' size='large' /> : null}
            <Text style={{
                fontSize: width * 0.09,
                alignSelf: 'center'
            }}>Challenges</Text>
            <View style={{ zIndex: 3, justifyContent: 'center' }}>
                {arr.map((v, i) => <View key={i} style={styles.card}>
                    <TouchableOpacity>
                        <Image style={styles.img}
                            resizeMode='cover'
                            source={v.img} />
                        <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <Text style={{ marginTop: 5, fontSize: 20, fontWeight: 'bold' }}>{v.text}</Text>
                            <TouchableOpacity style={styles.btn} onPress={() => createChallenge(v.text)}>
                                <Text style={{ color: 'white' }}>Create challenge</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>)}
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