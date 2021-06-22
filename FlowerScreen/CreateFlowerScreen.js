import React, { useEffect, useState } from 'react'
import {
    Text, View, StyleSheet, ActivityIndicator,
    Dimensions, TouchableOpacity, Alert, TextInput
} from 'react-native';
import Dialog from "react-native-dialog";
import { app } from '../firebaseconfig';
import AsyncStorage from "@react-native-async-storage/async-storage";



const FlowerScreen = ({ navigation }) => {
    const [arr, setArr] = useState([]);
    const [email, setEmail] = useState('');
    const [topic, setTopic] = useState('')
    const [idea, setIdea] = useState('');
    const [counterIdea, setCounterIdea] = useState('')
    const [judgement, setJudgement] = useState('');
    const [show, setshow] = useState({});
    const [alternative, setAlternative] = useState('')
    const [isLoading, setIsloading] = useState(false);

    useEffect(() => {
        const fun = async () => {
            setEmail(await AsyncStorage.getItem('auth'))
        }
        fun();
    }, [])





    const send = async () => {
        try {
            const res = await app.database().ref('flowers').push({
                topic, idea, judgement, alternative, counterIdea
            })
            res && navigation.navigate('feeds')
        } catch (error) {

            console.log(error)
        }
    }

    // console.log(topic, 'i=>', idea, 'cou-->', counterIdea, 'ju-->', 
    // judgement, 'al==>', alternative,arr.length);


    return (
        <View style={{
            height: height - 80,
            position: 'relative',
            padding: 20
        }}>
            <Dialog.Container visible={show.show}>
                <Dialog.Title children='ssssss'>{show.name}</Dialog.Title>
                <Dialog.Description style={{ borderColor: 'black' }}>
                    <Dialog.Input style={{
                        width: width * 0.5,
                    }} onChangeText={t => {
                        switch (show.name) {
                            case 'topic':
                                setTopic(t)
                                break;
                            case 'idea':
                                setIdea(t)
                                break;
                            case 'counter':
                                setCounterIdea(t)
                                break;
                            case 'judgement':
                                setJudgement(t)
                                break;
                            case 'alternative':
                                setAlternative(t)
                                break;
                            default:
                                break;
                        }
                    }} />
                </Dialog.Description>
                <Dialog.Button label='ok' onPress={() => setshow({})} />
            </Dialog.Container>
            <TouchableOpacity style={{
                ...styles.main,
                backgroundColor: 'yellow',
                marginTop: height / 3.5,
                height: height * 0.23,
                width: width * 0.4,
            }} onPress={() => setshow({ show: true, name: 'topic' })}>
                <Text>{topic}</Text>
            </TouchableOpacity>
            {arr.includes('idea') && <TouchableOpacity style={{
                ...styles.main,
                backgroundColor: 'red',
                top: height / 1.9
            }} onPress={() => setshow({ show: true, name: 'idea' })}>
                <Text>{idea}</Text>
            </TouchableOpacity>}
            {arr.includes('counter') && <TouchableOpacity style={{
                ...styles.main,
                backgroundColor: 'lightblue',
                marginTop: height / 10
            }} onPress={() => setshow({ show: true, name: 'counter' })}>
                <Text>{counterIdea}</Text>
            </TouchableOpacity>}
            {arr.includes('judgement') && <TouchableOpacity
                style={{
                    ...styles.main, backgroundColor: 'orange',
                    right: height * 0.02,
                    top: height * 0.28
                }} onPress={() => setshow({ show: true, name: 'judgement' })}>
                <Text>{judgement}</Text>
            </TouchableOpacity>}
            {arr.includes('alternative') && <TouchableOpacity style={{
                ...styles.main, backgroundColor: 'blue',
                left: height * 0.02,
                top: height * 0.28
            }} onPress={() => setshow({
                show: true,
                name: 'alternative'
            })}>
                <Text>{alternative}</Text>
            </TouchableOpacity>}
            {isLoading ? <ActivityIndicator color='pink' size='large' /> : <TouchableOpacity
                style={{ ...styles.creat_btn, opacity: arr.length < 4 ? 0.5 : 1 }}
                onPress={send} disabled={arr.length < 4} >
                <Text style={{ textAlign: 'center' }}>create</Text>
            </TouchableOpacity>}
            <View style={styles.bottom}>
                {['idea', 'counter', 'judgement',
                    'alternative'].map((v, i) => <TouchableOpacity
                        onPress={() => setArr([...arr, v])}
                        style={{
                            backgroundColor: arr.includes(v) ? 'red' : 'pink',
                            margin: 5,
                            paddingLeft: 15,
                            paddingTop: 5,
                            paddingRight: 15, borderRadius: 5,
                        }}
                        key={i}><Text>{v}</Text></TouchableOpacity>)}
            </View>
        </View >
    )
}

const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
    creat_btn: {
        width: width * 0.5,
        backgroundColor: 'pink',
        position: 'absolute',
        bottom: height * 0.1,
        justifyContent: 'center',
        borderRadius: 5,
        height: height * 0.06,
        alignSelf: 'center'
    },
    bottom: {
        bottom: 0,
        flexDirection: 'row',
        height: height * 0.07,
        position: 'absolute',
        marginLeft: 5,
        width: width
    },
    main: {
        borderRadius: width * 0.3,
        height: height * 0.16,
        width: width * 0.27,
        backgroundColor: 'pink',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute'
    }
})
export default FlowerScreen;