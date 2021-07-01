import React, { useEffect, useState } from 'react'
import {
    View, TouchableHighlight, TouchableOpacity,
    StyleSheet, Text,
    ActivityIndicator, ScrollView, Dimensions, Alert
} from 'react-native'
import Dialog from "react-native-dialog";
import { app } from '../firebaseconfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings'


const Arguments = ({ navigation, route }) => {
    // var arrs = [];
    const [loading, setloading] = useState(true);
    const argumentref = app.database().ref('arguments')
    const [open, setopen] = useState(false)
    const [text, setText] = useState('');
    const [likesarr, set_likesarr] = useState([]);
    const [unlikesarr, set_unlikesarr] = useState([]);

    const [likeArrayIds, setlikeArrayIds] = useState(null)
    const [unlikeArrayIds, setUnlikeArrayIds] = useState(null)

    const [error, seterror] = useState('')
    const [argumentsarr, setarguments] = useState([]);
    const [fullText, setFullText] = useState('');
    const [user_email, set_user_email] = useState('')
    const [like, setlike] = useState('');
    const [likerun, setlikerun] = useState(true)

    useEffect(() => {
        route.params.open == true && setopen(true)
    }, [route.params])

    useEffect(() => {
        AsyncStorage.getItem('auth').then(email => set_user_email(email)).catch(e => {
            Alert.alert("Error!", [{ text: "OK" }])
        })
        argumentref.orderByChild('circleid')
            .equalTo(`${route.params.id}`).get().then(res => {
                const arr = [];
                const likesarr_Ids = []
                let likesarray = []
                const unlikesarr_Ids = []
                let unlikesarray = []
                res.forEach(el => {
                    arr.push(el.toJSON())
                    if (el.toJSON().likes !== undefined) {
                        const destructkey = []
                        const destructval = []
                        Object.keys(el.toJSON().likes).length == 1 ?
                            likesarr_Ids.push(Object.keys(el.toJSON().likes)[0]) :
                            Object.keys(el.toJSON().likes).forEach(ele => destructkey.push(ele))
                        likesarr_Ids.push(...destructkey)

                        Object.values(el.toJSON().likes).length == 1 ?
                            likesarray.push(Object.values(el.toJSON().likes)[0]) :
                            Object.values(el.toJSON().likes).forEach(ele => destructval.push(ele))
                        likesarray.push(...destructval)
                    }
                    if (el.toJSON().unlikes !== undefined) {
                        const destructkey = []
                        const destructval = [];
                        Object.keys(el.toJSON().unlikes).length == 1 ?
                            unlikesarr_Ids.push(Object.keys(el.toJSON().unlikes)[0]) :
                            Object.keys(el.toJSON().unlikes).forEach(ele => destructkey.push(ele))
                        unlikesarr_Ids.push(...destructkey);

                        Object.values(el.toJSON().unlikes).length == 1 ?
                            unlikesarray.push(Object.values(el.toJSON().unlikes)[0]) :
                            Object.values(el.toJSON().unlikes).forEach(ele => destructval.push(ele))
                        unlikesarray.push(...destructval)
                    }
                })
                //for pushing argument id in argument object
                arr.forEach((v, i) => {
                    arr[i].argumentId = Object.keys(res.toJSON()).filter((el, idx) => idx === i)[0]
                })
                setlikeArrayIds(likesarr_Ids);
                setUnlikeArrayIds(unlikesarr_Ids)
                set_likesarr(likesarray);
                set_unlikesarr(unlikesarray)
                setarguments(arr);
                setlikerun(!likerun)
                setloading(false)
            }).catch(e => {
                setloading(false);
                Alert.alert("Network Error!", 'Try Again', { text: "OK" })
                console.log('errr33==>', e)
            })
    }, [like])


    useEffect(() => {
        if (likeArrayIds || unlikeArrayIds) {
            likesarr.forEach((el, i) => {
                likesarr[i].likeId = likeArrayIds.filter((el, idx) => idx === i)[0]
            });
            unlikesarr.forEach((v, i) => {
                unlikesarr[i].unlikeId = unlikeArrayIds.filter((el, idx) => idx === i)[0]
            })
        }
    }, [likerun])

    const send = async () => {
        setloading(true)
        try {
            const res = argumentref.push({
                circleid: route.params.id.toString(),
                text,
                user_email
            })
            setloading(true);
            setopen(false)
        } catch (error) {
            Alert.alert("Network Error!", 'Try Again', { text: "OK" })
            setopen(false)
        }
    }

    const likeHandler = async (argumentId, type, likeId, unlikeId) => {
        console.log(argumentId, type, likeId, unlikeId)
        try {
            const ref = app.database().ref(`arguments/${argumentId}`)
            if (likeId === undefined && unlikeId === undefined) {
                await ref.child(`${type === 1 ? 'likes' : 'unlikes'}`).push({ argumentId, user_email })
            }
            else if (likeId && unlikeId === undefined) {
                await ref.child(`likes/${likeId}`).remove()
                if (type === 0) {
                    await ref.child('unlikes').push({ argumentId, user_email })
                }
            }
            else if (unlikeId && likeId === undefined) {
                await ref.child(`unlikes/${unlikeId}`).remove()
                if (type === 1) {
                    await ref.child('likes').push({ argumentId, user_email })
                }
            }
            setlike(!like);
        } catch (error) {
            setlike(!like)
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
                        const likefilt = likesarr.filter((val, idx) => val.argumentId === v.argumentId)
                        const unlikefilt = unlikesarr.filter((val, idx) => val.argumentId === v.argumentId);
                        const mylike = likefilt.find(vl => vl.user_email === user_email &&
                            vl.argumentId === v.argumentId)
                        const myunlike = unlikefilt.find(vl => vl.user_email === user_email &&
                            vl.argumentId === v.argumentId)
                        return <TouchableOpacity key={i} style={styles.touch}
                            onPress={() => navigation.navigate('comments', { argumentId: v.argumentId })}>
                            <Text>{v.text == fullText ? fullText : v.text.substring(0, 144)}
                                <Text style={{ color: 'blue' }}
                                    onPress={() => fullText === '' ? setFullText(v.text) : setFullText('')} >
                                    {fullText === v.text ? ' show less' : ' show more'}</Text>
                            </Text>
                            <View style={styles.like}>
                                <Ionicons size={30} onPress={() => likeHandler(v.argumentId, 1, mylike?.likeId, myunlike?.unlikeId)}
                                    name={mylike ? 'thumbs-up-sharp' : 'thumbs-up-outline'} color='blue' />
                                <TouchableOpacity>
                                    <Text style={{ color: 'blue' }}>{likefilt.length}</Text>
                                </TouchableOpacity>
                                <Ionicons size={30} name={myunlike ? 'thumbs-down-sharp' : 'thumbs-down-outline'}
                                    onPress={() => likeHandler(v.argumentId, 0, mylike?.likeId, myunlike?.unlikeId)} color='blue' />
                                <TouchableOpacity>
                                    <Text style={{ color: 'blue' }}>{unlikefilt.length}</Text>
                                </TouchableOpacity>
                                <Rating style={{
                                    position: 'absolute',
                                    right: 0
                                }} imageSize={height * 0.04} />
                            </View>
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
        zIndex: 5,
        position: 'relative',
        width: width * 0.8
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