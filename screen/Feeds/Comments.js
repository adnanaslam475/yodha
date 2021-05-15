import React, { useEffect, useState, useRef } from 'react'
import {
    Text, View, Image, TouchableOpacity, TextInput,
    ScrollView, StyleSheet, Dimensions, Modal, BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';
import firebase from 'firebase';
import { app } from '../../firebaseConfig';
import KeyboardStickyView from 'rn-keyboard-sticky-view';
import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux'
import moment from 'moment';

const Comments = ({ route, navigation }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const dummy = 'https://www.audi.com/content/dam/ci/Fundamentals/Basics/Colours/04_Grautoene_Elemente/Audi_Brandplattform_Colours_Element-15.png'
    const [imageuri, setImageUri] = useState('');
    const scrollref = useRef(null);
    const [upload, setupload] = useState(false);
    const [loadImage, setLoadImage] = useState(true)
    const [fullimage, setfullimage] = useState('');
    const [fullimageModal, setfullimageModal] = useState(false);
    const deviceId = useSelector(d => d.user.device_id);

    const imageHandler = () => {
        const options = {
            mediaType: 'image',
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
                const source = { uri: res.uri, type: res.type, name: res.fileName }
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
                    Alert.alert(
                        'Error!!!',
                        "image Cannot be uploaded",
                        [
                            {
                                text: "Cancel", style: "cancel"
                            },
                            { text: "OK" }
                        ]
                    );
                })
            }
        });
    }
    useEffect(() => {
        const arr = [];
        app.database().ref('comments').orderByChild("feedId")
            .equalTo(route.params.feedId).once("value",
                function (snapshot) {
                    snapshot.forEach(e => {
                        arr.push(e.toJSON())
                    })
                    setComments(arr)
                });

    }, [])
    const postcomment = async () => {
        try {
            (text !== '' || imageuri !== '') && app.database().ref('comments').push({
                text, imageuri,
                feedId: route.params.feedId,
                userId: deviceId,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            }).then(res => {
                console.log('res')
                setText('');
                setImageUri('')
                res.on('value', snap => {
                    scrollref.current.scrollToEnd({ animated: true })
                    setComments([...comments, snap.toJSON()])
                })
            })
                .catch(e => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <ScrollView ref={scrollref} style={{ marginLeft: 5, marginBottom: 20, backgroundColor: 'white' }}>
                {comments ? comments.map((v, i) => (<View style={{
                    margin: 4,
                    marginTop: 5,
                    flexDirection: 'row'
                }} key={i}>
                    {fullimageModal && <Modal transparent onShow={() => setfullimage(v.imageuri)} onRequestClose={() => {
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
                            <Text>{v.text}</Text><Text style={{ fontSize: height * 0.018 }}>{moment(v.createdAt).fromNow()}</Text></View> : null}
                        {v.imageuri ? <TouchableOpacity
                            onPress={() => setfullimageModal(true)}>
                            <Image
                                onLoadEnd={() => setLoadImage(false)}
                                style={styles.commentpic}
                                source={{ uri: loadImage ? dummy : v.imageuri }} /></TouchableOpacity> : null}
                    </View>
                </View>)) : <ActivityIndicator size='large' color='purple' style={styles.activity} />}
            </ScrollView>
            <KeyboardStickyView style={styles.keyboardView}>
                <TouchableOpacity>
                    {upload ? <ActivityIndicator color='purple' size='small' /> : <View>
                        {imageuri ? <View style={styles.imageuricomp}>
                            <Icon name='close' size={25} onPress={() => setImageUri(null)} color='gray' style={{
                                alignSelf: 'flex-end', position: 'absolute',
                                zIndex: 3, marginTop: 0,
                            }} />
                            <Image source={{ uri: imageuri }} style={styles.imageuri} /></View> :
                            <Icon name='camera' onPress={imageHandler} color='purple' size={30} />}
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
    keyboardView: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    activity:
        { display: 'flex', alignSelf: 'center', justifyContent: 'center' },
    imageuricomp: {
        width: width * 0.12,
        height: height * 0.07, margin: 0,
    },
    imageuri: {
        width: width * 0.11,
        height: height * 0.07,
        borderRadius: 50
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

export default Comments
