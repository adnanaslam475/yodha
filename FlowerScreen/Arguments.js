import React, { useEffect, useState } from 'react'
import {
    View, TouchableHighlight, TouchableOpacity,
    StyleSheet, Text,
    ActivityIndicator, ScrollView, Dimensions, Alert
} from 'react-native'
import Dialog from "react-native-dialog";
import { app } from '../firebaseconfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Anticons from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings'


const Arguments = ({ navigation, route }) => {
    const [loading, setloading] = useState(true);
    const argumentref = app.database().ref('arguments')
    const [open, setopen] = useState(false)
    const [text, setText] = useState('');
    const [likesarr, setlikesarr] = useState([]);



    const [argumentskeys, setArgumentsKeys] = useState(null);
    const [argumentsarr, setarguments] = useState([]);
    const [fullText, setFullText] = useState('');
    const [user_email, set_user_email] = useState('')
    const [like, setlike] = useState('');

    useEffect(() => {
        route.params.open == true && setopen(true)
    }, [route.params])

    useEffect(() => {
        AsyncStorage.getItem('auth').then(email => set_user_email(email)).catch(e => {
            Alert.alert(
                "Error!",
                'Login Session expired',
                [
                    { text: "OK" }
                ]
            )
        })
        argumentref.orderByChild('circleid')
            .equalTo(`${route.params.id}`).get().then(res => {
                const arr = [];
                setArgumentsKeys(Object.keys(res.toJSON()))
                res.forEach(el => {
                    arr.push(el.toJSON())
                })
                arr.forEach((v, i) => {
                    arr[i].argumentId = Object.keys(res.toJSON()).filter((el, idx) => idx === i)[0]
                })


                arr.forEach((arg_id, i) => {
                    app.database().ref(`likes/${arg_id.argumentId}`).get()
                        .then(response => {
                            let arrs = []
                            response.forEach(elemnt => {
                                // console.log(elemnt)

                                arr[i].likes = arrs.concat(elemnt)
                            })
                            console.log('63==>', arr)
                        }).catch(err => {
                            console.log('err 54', err)
                        })
                })
                setarguments(arr);
                setloading(false)
            }).catch(e => {
                setloading(false)
                console.log('errr33==>', e)
            })
    }, [])




    const send = async () => {
        setloading(true)
        try {
            const res = argumentref.push({
                circleid: route.params.id.toString(),
                text
            })
            setloading(true)

            setopen(false)
        } catch (error) {
            Alert.alert(
                "Network Error!",
                'Try Again',
                [
                    { text: "OK" }
                ]
            )
            setopen(false)
        }
    }

    const likeHandler = async (argumentId, type) => {
        try {
            const res = await app.database().ref(`likes/${argumentId}`)
                .push({
                    type,
                    user_email
                })
            setlike(like + 1)
        } catch (error) {
        }
    }



    return (
        <View style={{ paddingTop: 10 }}>
            <Dialog.Container onBackdropPress={() => setopen(false)} visible={open}>
                <Dialog.Title children=''>Add Argument</Dialog.Title>
                <Dialog.Description style={{ borderColor: 'black' }} >
                    <Dialog.Input style={{
                        width: width * 0.5,
                    }} onChangeText={t => setText(t)} />
                </Dialog.Description>
                <Dialog.Button label='ADD' onPress={send} />
            </Dialog.Container>
            {loading ? <ActivityIndicator color='red' size='large'
                style={{ marginTop: height / 2.5 }} /> : <View >{argumentsarr.length == 0 ?
                    <Text style={styles.txt}>No arguments yet To show</Text> :
                    argumentsarr.map((v, i) => {
                        return <TouchableOpacity key={i} style={styles.touch}
                            onPress={() => ''}>
                            {/* navigation.navigate('comments', { argumentId: v.argumentId }) */}
                            <Text>{v?.text == fullText ? fullText : v?.text?.substring(0, 144)}<Text style={{ color: 'blue' }}
                                onPress={() => fullText === '' ? setFullText(v.text) : setFullText('')} >
                                {fullText === v?.text ? ' show less' : ' show more'}</Text>
                            </Text>
                            <View style={styles.like}>
                                <Ionicons size={30} onPress={() => likeHandler(v.argumentId, 1)}
                                    name='thumbs-up-outline' color='blue' />
                                <TouchableOpacity>
                                    <Text style={{ color: 'blue' }}>{''} likes</Text>
                                </TouchableOpacity>
                                <Ionicons size={30} name='thumbs-down-outline' onPress={() => likeHandler(v.argumentId, 0)} color='blue' />
                                <TouchableOpacity>
                                    {/* thumbs-up-sharp */}
                                    <Text style={{ color: 'blue' }}>{''} Unlikes</Text>
                                </TouchableOpacity>
                            </View>
                            <Rating style={{}} imageSize={height * 0.05} />
                        </TouchableOpacity>
                    })}
            </View>}
        </View>
    )
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    like: {
        display: 'flex', flexDirection: 'row',
        alignSelf: 'flex-start', alignItems: 'center',
        zIndex: 5
    },
    touch: {

        backgroundColor: 'lightgray',
        width: width * 0.9,
        borderRadius: 10,
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        padding: height * 0.02
    },
    txt: {
        alignSelf: 'center', display: 'flex',
        marginTop: height / 2.5
    }

})
export default Arguments;