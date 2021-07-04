import React, { useEffect, useState, useRef, createRef } from 'react'
import {
    Text, View, Image, TouchableOpacity, TextInput,
    ScrollView, StyleSheet, Dimensions, Modal, BackHandler, Alert
} from 'react-native';
import Dialog from "react-native-dialog";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import firebase from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';
import KeyboardStickyView from 'rn-keyboard-sticky-view';
import { ActivityIndicator } from 'react-native';
import moment from 'moment';
import Video from 'react-native-video';
import { app } from '../firebaseconfig';

const dummy = 'https://www.audi.com/content/dam/ci/Fundamentals/Basics/Colours/04_Grautoene_Elemente/Audi_Brandplattform_Colours_Element-15.png'



const ArgumentComments = ({ route, navigation }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [imageuri, setImageUri] = useState('');
    const scrollref = createRef(null);
    const [open, setopen] = useState(false)
    const [upload, setupload] = useState(false);
    const [loadImage, setLoadImage] = useState(true)
    const [fullimage, setfullimage] = useState('');
    const [videoshow, setvideoshow] = useState(false)
    const [videourl, setVideoUrl] = useState('')
    const [fullscreenvideo, setfullscreenvideo] = useState({})
    const [percent, setpercent] = useState('')
    const [loading, setloading] = useState(true)
    const [fullimageModal, setfullimageModal] = useState(false);
    const fullscreenvideostyle = {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0, left: 0,
        zIndex: 10
    }

    useEffect(() => {
        const arr = [];
        app.database().ref('diffusioncomments').orderByChild("argumentId")
            .equalTo(route.params.argumentId).get().then(res => {
                res.forEach(el => {
                    arr.push(el.toJSON())
                })
                setComments(arr);
                setloading(false)
            }).catch(err => {
                Alert.alert('Error!!!', [{ text: "OK" }]);
                console.log('err', err)
                setloading(false)
            })
    }, [])


    const imageHandler = (type) => {
        const options = {
            mediaType: type,
            includeBase64: true,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, res => {

            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else {
                setupload(true);
                const source = {
                    uri: res.assets[0].uri, type: res.assets[0].type,
                    name: res.assets[0].fileName
                }
                if (type === 'image') {
                    setopen(false)
                    const data = new FormData()
                    data.append('file', source)
                    data.append("upload_preset", "olxApp")
                    data.append("cloud_name", "mernapp")
                    fetch('https://api.cloudinary.com/v1_1/mernapp/image/upload', {
                        method: "post",
                        body: data
                    }).then(res => res.json()).then(data => {
                        setupload(false);
                        setImageUri(data.url)
                    }).catch(err => {
                        setupload(false)
                        console.log('err', err)
                        Alert.alert('Error!!!', [{ text: "OK" }]);
                    })
                }
                else {
                    setupload(true)
                    RNFetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/mernapp/video/upload', {
                        'Content-Type': 'multipart/form-data'
                    }, [{
                        name: 'file', filename: res.assets[0].fileName,
                        type: res.assets[0].type, data: RNFetchBlob.wrap(res.assets[0].uri)
                    },
                    { name: 'upload_preset', data: 'olxApp' }
                    ]).uploadProgress({ interval: 250 }, (written, total) => {
                        setopen(false)
                        var per = (written / total) * 100
                        setpercent(percent + per)
                    }).then((response) => {
                        const { url } = JSON.parse(response.data)
                        setVideoUrl(url)
                        setupload(false);
                        setvideoshow(true)
                    }).catch(err => {
                        Alert.alert('Error!!!', [{ text: "OK" }]);
                        setupload(false)
                    })
                }
            }
        });
    }


    const postcomment = async () => {
        try {
            if (text !== '' || imageuri !== '' || videourl !== '') {

                await app.database().ref('diffusioncomments').push({
                    text, imageuri,
                    videourl,
                    argumentId: route.params.argumentId,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                }).then(res => {
                    setText('');
                    setImageUri('');
                    setvideoshow(false)
                    res.on('value', snap => {
                        // scrollref.current.scrollToEnd({ animated: true })
                        setComments([...comments, snap.toJSON()])
                    })
                })
                    .catch(e => {
                        console.log(e);
                    })
            }
        } catch (error) {
            console.log(error);
        }
    }

    console.log(fullscreenvideo)

    return (
        <>
            <ScrollView ref={scrollref}
                style={styles.main}>
                {loading ? <ActivityIndicator size='large' color='purple' style={{
                    ...styles.activity,
                    marginTop: height * 0.3
                }} /> : null}
                <Dialog.Container onBackdropPress={() => {
                    setopen(false);
                    setfullscreenvideo(null)
                }} contentStyle={{ width: width, height: height*0.75 }}
                    visible={open || fullscreenvideo?.show}>
                    {fullscreenvideo?.show ? <Video
                        source={{
                            uri: fullscreenvideo?.url ?
                                fullscreenvideo?.url : 'file/content.jpg'
                        }}
                        controls={true}
                        paused={false}
                        resizeMode="cover"
                        fullscreen
                        fullscreenOrientation='all'
                        resizeMode="cover"
                        style={{ ...fullscreenvideostyle }}
                    /> :
                        <Dialog.Description style={{ borderColor: 'black' }} >
                            <Dialog.Button style={{
                                width: width * 0.5,
                            }} onPress={() => imageHandler('image')} label='choose Image' />
                            <Dialog.Button style={{
                                width: width * 0.5,
                                marginTop: 10,
                            }} onPress={() => imageHandler('video')} label='choose Video' />
                        </Dialog.Description>}
                </Dialog.Container>
                {comments ? comments.map((v, i) => {
                    console.log(v.videourl)
                    return (<View style={{
                        margin: 4,
                        marginTop: 5,
                        flexDirection: 'row'
                    }} key={i}>
                        {fullimageModal && <Modal transparent
                            onRequestClose={() => {
                                setfullimage('');
                                setfullimageModal(false)
                            }}
                            statusBarTranslucent style={{ backgroundColor: 'black' }}  >
                            <Image source={{
                                uri: fullimage ||
                                    'https://www.solidbackgrounds.com/images/1920x1080/1920x1080-black-solid-color-background.jpg'
                            }}
                                style={{ width: width, height: height }} />
                        </Modal>}
                        <Text>{fullimage}</Text>
                        <Image style={styles.avatar} source={{
                            uri: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201907/imgonline-com-ua-FrameBlurred-_14.jpeg'
                        }} />
                        <View style={{ flexDirection: 'column' }} >
                            {v.text ? <View style={{
                                backgroundColor: 'lightgray',
                                borderRadius: 15,
                                padding: 7,
                                flexDirection: 'column'
                            }} ><Text style={{ fontWeight: 'bold', marginBottom: 10 }}>{v.userId}</Text>
                                <Text>{v.text}</Text>
                                <Text style={{ fontSize: height * 0.018 }}>{moment(v.createdAt).fromNow()}</Text>
                            </View> : null}
                            {v.imageuri ? <TouchableOpacity
                                onPress={() => {
                                    setfullimage(v.imageuri)
                                    setfullimageModal(true);
                                }}>
                                <Image
                                    onLoadEnd={() => setLoadImage(false)}
                                    style={styles.commentpic}
                                    source={{ uri: loadImage ? dummy : v.imageuri }} />
                            </TouchableOpacity> : null}
                            {v.videourl ?
                                <Video onTouchStart={() => {
                                    setfullscreenvideo({ url: v.videourl, show: true });
                                }}
                                    source={{
                                        uri: v.videourl ?
                                            v.videourl : 'file/content.jpg'
                                    }}
                                    paused={true}
                                    // resizeMode="cover"
                                    style={{ ...styles.backgroundVideo }}
                                // style={fullscreenvideo ? { ...fullscreenvideostyle } :
                                //     { ...styles.backgroundVideo }}
                                />
                                : null}
                        </View>
                    </View>)
                }) : <ActivityIndicator size='large' color='purple' style={styles.activity} />}
            </ScrollView>

            {videoshow ? <Video source={{
                uri: videourl ?
                    videourl : 'file/content.jpg'
            }} onLoad={() => ''}
                style={styles.backgroundVideo} /> : null}
            <KeyboardStickyView style={styles.keyboardView}>
                <TouchableOpacity>
                    {upload ? <ActivityIndicator color='purple' size='small' /> : <View>
                        {imageuri ? <View style={styles.imageuricomp}>
                            <Icon name='close' size={25} onPress={() => setImageUri(null)} color='gray' style={{
                                alignSelf: 'flex-end', position: 'absolute',
                                zIndex: 3, marginTop: 0,
                            }} />
                            <Image source={{ uri: imageuri }}
                                style={styles.imageuri} /></View> :
                            <Icon name='camera' onPress={() => setopen(true)} color='purple'
                                size={width * 0.1} />}
                    </View>}
                </TouchableOpacity>
                <TextInput
                    value={text}
                    onChangeText={t => setText(t)}
                    placeholder="Write something..."
                    style={styles.input}
                />
                <TouchableOpacity style={{ marginLeft: 5 }}
                    onPress={postcomment} >
                    <Icon name='send' color='purple' size={35} />
                </TouchableOpacity>
            </KeyboardStickyView>
        </>
    )
}
const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
    main: {
        marginLeft: 5, marginBottom: 20,
        backgroundColor: 'white'
    },
    keyboardView: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    activity:
    {
        display: 'flex', alignSelf: 'center',
        justifyContent: 'center'
    },
    imageuricomp: {
        width: width * 0.12,
        height: height * 0.07, margin: 0,
    },
    imageuri: {
        width: width * 0.13,
        height: height * 0.09,
        borderRadius: 50
    },
    cmnt_video_vw: {
        borderWidth: 1, borderRadius: 5,
        borderColor: 'lightgray', marginTop: 5,
    },
    backgroundVideo: {
        width: width * 0.31,
        height: height * 0.2,
        alignSelf: 'center',
        opacity: 0.5,
        margin: 5,
        borderRadius: 5,
    },
    avatar: {
        borderRadius: 25,
        height: height * 0.06,
        marginRight: 5,
        width: width * 0.1,
    },
    commentpic: {
        borderRadius: 10,
        width: width / 3,
        height: height / 4,
        marginTop: 2
    },
    scrollView: {
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,

        height: height / 15,
        borderColor: 'purple',
        borderRadius: 20, width: width / 1.3
    },
})

export default ArgumentComments;