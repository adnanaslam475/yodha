import React, { useEffect, useState } from 'react'
import {
    Text, View, StyleSheet, ActivityIndicator,
    Dimensions, TouchableOpacity, Alert, TextInput,
    Animated, Easing
} from 'react-native';
import Dialog from "react-native-dialog";
import Card from './Card';
import { app } from '../firebaseconfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Gestures from 'react-native-easy-gestures';



const FlowerScreen = ({ navigation }) => {
    const [arr, setArr] = useState(['alternative']);
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
            const user_email = await AsyncStorage.getItem('auth')
            setEmail(user_email);
        }
        fun();
    }, [])





    const send = async () => {
        const num = 99999999999999999999;
        try {
            const topicobj = { topic, id: Math.floor(Math.random() * num) }
            const ideaobj = { idea, id: Math.floor(Math.random() * num) }
            const alternativeobj = { alternative, id: Math.floor(Math.random() * num) }
            const judgementobj = { judgement, id: Math.floor(Math.random() * num) }
            const counterIdeaobj = { counterIdea, id: Math.floor(Math.random() * num) }
            const res = await app.database().ref('flowers').push({
                topicobj,
                ideaobj,
                judgementobj,
                alternativeobj,
                counterIdeaobj
            })
            res && navigation.navigate('feeds')
        } catch (error) {
            Alert.alert("Network Error!", { text: "OK" })
            console.log(error)
        }
    }


    return (
        <View style={{
            position: 'relative',
            height: height * 0.86,
        }}>
            <Dialog.Container visible={show.show} onBackdropPress={() => setshow({})} >
                <Dialog.Title children='ssssss'>{show.name || 'a'}</Dialog.Title>
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


            <View style={styles.main_circle}>
                <TouchableOpacity style={{
                    ...styles.main,
                    backgroundColor: 'gray',
                    marginTop: height * 0.17,
                    height: height * 0.22,
                    width: width * 0.35,
                }} onPress={() => setshow({
                    show: true,
                    name: 'topic'
                })}>
                    <Text>{topic}</Text>
                </TouchableOpacity>

                {arr.includes('alternative') && <TouchableOpacity style={{
                    ...styles.main, backgroundColor: 'blue',
                    left: height * 0.01,
                    top: height * 0.2
                }} onPress={() => setshow({
                    show: true,
                    name: 'alternative'
                })}>
                    <Text>{alternative}</Text>
                </TouchableOpacity>}
            </View>

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
                            paddingRight: 15,
                            paddingTop: 5,
                            borderRadius: 5,
                        }}
                        key={i}><Text>{v}</Text>
                    </TouchableOpacity>)}
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
    main_circle: {
        backgroundColor: 'lightgray',
        borderRadius: width,
        marginTop: height * 0.1,
        width: width * 0.95,
        margin: 5,
        height: height * 0.57
    },
    bottom: {
        bottom: 0,
        flexDirection: 'row',
        height: height * 0.07,
        position: 'absolute',
        width: width
    },
    main: {
        borderRadius: width,
        height: height * 0.16,
        width: width * 0.27,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'absolute'
    }
})
export default FlowerScreen;


// {arr.includes('idea') && <TouchableOpacity style={{
//     ...styles.main,
//     backgroundColor: 'red',
//     top: height * 0.4,
// }} onPress={() => setshow({ show: true, name: 'idea' })}>
//     <Text>{idea}</Text>
// </TouchableOpacity>}
// {arr.includes('counter') && <TouchableOpacity style={{
//     ...styles.main,
//     backgroundColor: 'lightblue',
//     marginTop: height * 0.001
// }} onPress={() => setshow({ show: true, name: 'counter' })}>
//     <Text>{counterIdea ? counterIdea : 'press to add idea'}</Text>
// </TouchableOpacity>}
// {arr.includes('judgement') && <TouchableOpacity
//     style={{
//         ...styles.main, backgroundColor: 'orange',
//         right: height * 0.01,
//         top: height * 0.2
//     }} onPress={() => setshow({ show: true, name: 'judgement' })}>
//     <Text>{judgement}</Text>
// </TouchableOpacity>}