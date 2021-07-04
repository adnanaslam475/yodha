import React, { useEffect, useState } from 'react'
import {
    View, TouchableOpacity,
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
    const [likeIconDisabled, setlikeIconDisabled] = useState(false)
    const argumentref = app.database().ref('arguments')
    const [open, setopen] = useState(false);
    const [ratingIds, setratingIds] = useState(null)
    const [text, setText] = useState('');
    const [likesarr, set_likesarr] = useState([]);
    const [unlikesarr, set_unlikesarr] = useState([]);
    const [rating, setrating] = useState(0)
    const [likeArrayIds, setlikeArrayIds] = useState(null)
    const [unlikeArrayIds, setUnlikeArrayIds] = useState(null)

    const [argumentsarr, setarguments] = useState([]);
    const [fullText, setFullText] = useState('');
    const [user_email, set_user_email] = useState('')
    const [like, setlike] = useState('');
    const [ratingpercent, setratingPercent] = useState(0)
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
                const allratingvalues = []
                let likesarray = []
                const unlikesarr_Ids = []
                let unlikesarray = []
                const ratingkeys = [];
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
                    if (el.toJSON().ratings !== undefined) {
                        ratingkeys.push(Object.keys(el.toJSON().ratings))
                        Object.values(el.toJSON().ratings).forEach(elemnt => {
                            allratingvalues.push(parseInt(elemnt.toJSON().rating))
                        })
                    }
                })
                //for pushing argument id in argument object
                arr.forEach((v, i) => {
                    arr[i].argumentId = Object.keys(res.toJSON()).filter((el, idx) => idx === i)[0]
                })
                setratingPercent(allratingvalues);
                setratingIds(ratingkeys)
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

    // console.log(rating, ratingIds, ratingpercent)

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
            await argumentref.push({
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

    const reviews = async (argumentId) => {
        // console.log(id, '==>', argumentId)
        try {
            await app.database().ref(`arguments/${id}`).child('ratings').push({
                user_email,
                argumentId,
                rating,
            })
        } catch (error) {
            Alert.alert(" Rating Error !!! please try again!", [{ text: "OK" }])
        }
    }
    const likeHandler = async (argumentId, type, likeId, unlikeId) => {
        setlikeIconDisabled(true)
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
            setlikeIconDisabled(false)
        } catch (error) {
            setlike(!like)
            setlikeIconDisabled(false)
        }
    }



    console.log(likeIconDisabled)


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
                            onPress={() => navigation.navigate('comments', { argumentId: v.argumentId })}
                        >
                            <Text style={{ textAlign: 'left', color: 'red' }}>{v.text == fullText ? fullText : v.text.substring(0, 144)}
                                <Text style={{ color: 'blue' }}
                                    onPress={() => fullText === '' ? setFullText(v.text) : setFullText('')} >
                                    {fullText === v.text ? ' show less' : ' show more'}</Text>
                            </Text>
                            <View style={styles.like}>
                                <TouchableOpacity onPress={() => likeHandler(v.argumentId, 1, mylike?.likeId, myunlike?.unlikeId)}
                                    disabled={likeIconDisabled} >
                                    <Ionicons size={30}
                                        name={mylike ? 'thumbs-up-sharp' : 'thumbs-up-outline'} color='blue' />
                                </TouchableOpacity>
                                <Text style={styles.likelength}>{likefilt.length}</Text>
                                <TouchableOpacity onPress={() => likeHandler(v.argumentId, 0, mylike?.likeId,
                                    myunlike?.unlikeId)}
                                    disabled={likeIconDisabled}>
                                    <Ionicons size={30} name={myunlike ? 'thumbs-down-sharp' : 'thumbs-down-outline'}
                                        color='blue' />
                                </TouchableOpacity>
                                <Text style={styles.likelength}>{unlikefilt.length}</Text>
                                <Rating style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 5,
                                }} imageSize={height * 0.04}
                                    ratingCount={5}
                                    ratingColor='#0051ff'
                                    ratingTextColor='#0051ff'
                                    ratingBackgroundColor='#0051ff'
                                    minValue={rating}
                                    startingValue={0}
                                    onStartRating={t => setrating(t)}
                                    onSwipeRating={() => console.log('onswipe')}
                                    onFinishRating={() => {
                                        reviews(v.argumentId);
                                        console.log('finsh', rating)
                                    }}
                                />
                                {/* <Text>{eval(ratingpercent.join(',')) / ratingpercent.length}</Text> */}
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
        width: width * 0.8,
        marginTop: 10
    },
    likelength: {
        color: 'blue',
        margin: 5,
    },
    touch: {
        backgroundColor: 'lightgray',
        width: width * 0.9,
        borderRadius: 10,
        display: 'flex',
        alignSelf: 'center',
        padding: height * 0.02
    },
    txt: {
        alignSelf: 'center', display: 'flex',
        marginTop: height / 2.5
    }

})
export default Arguments;