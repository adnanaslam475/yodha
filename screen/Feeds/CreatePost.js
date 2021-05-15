import React, { useState } from 'react';
import {
    Text, View, Dimensions, KeyboardAvoidingView, Alert, ActivityIndicator,
    TextInput, StatusBar, StyleSheet, Image, TouchableOpacity, ScrollView
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { app } from '../../firebaseConfig';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firebase from 'firebase';
import { useSelector } from 'react-redux'

const CreatePost = ({ navigation }) => {
    const deviceId = useSelector(d => d.user.device_id);
    const [upload, setupload] = useState(false)
    const [details, setDetails] = useState('');
    const [percent, setpercent] = useState(0);
    const [imageuri, setImageUri] = useState('');
    const [postdone, setpostdone] = useState();
    const [videoUrl, setVideoUrl] = useState('');
    const [add, setAdd] = useState(null);
    const [videoUploading, setvideoUploading] = useState(false);


    const videoHandler = () => {
        setAdd(null)
        const options = {
            mediaType: 'video',
            videoQuality: 'high',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }
        ImagePicker.launchImageLibrary(options, res => {
            if (res.didCancel) {
                console.log('User cancelled video picker');
            } else {
                setvideoUploading(true)
                RNFetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/mernapp/video/upload', {
                    'Content-Type': 'multipart/form-data'
                }, [
                    {
                        name: 'file', filename: res.fileName,
                        type: res.type, data: RNFetchBlob.wrap(res.uri)
                    },
                    { name: 'upload_preset', data: 'olxApp' }
                ]).uploadProgress({ interval: 250 }, (written, total) => {
                    var per = (written / total) * 100
                    setpercent(percent + per)
                }).then((response) => {
                    const { url } = JSON.parse(response.data)
                    setVideoUrl(url)
                }).catch(err => {
                    console.log(err);
                })
            }
        });
    }

    const imageHandler = () => {
        setAdd(null);
        const options = {
            mediaType: 'image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.launchImageLibrary(options, res => {
            if (res.didCancel) {
            } else if (res.error) {
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
                    )
                })
            }
        });
    }

    const post = async () => {
        try {
            if (imageuri || videoUrl || details) {
                const res = await app.database().ref('posts')
                    .push({
                        imageuri, videoUrl,
                        details,
                        deviceId,
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    })
                setpostdone(false);
                navigation.navigate('newsfeed');
            }
            else { setAdd('please add something...'); }
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <KeyboardAvoidingView style={styles.post}>
            <StatusBar translucent backgroundColor='transparent' />
            {videoUrl ? null : <View>{upload ? <ActivityIndicator color='purple' size='large' /> :
                <View style={{ alignSelf: 'flex-end' }}>
                    {imageuri ? <><Icon onPress={() => setImageUri(null)} style={{
                        zIndex: 1, position: 'absolute',
                        alignSelf: 'flex-end',
                        borderRadius: 5,
                    }} color='black' size={35} name='close' />
                        <Image style={{ width: width * 0.9, borderRadius: 1, height: height * 0.5 }}
                            onLoadEnd={() => setupload(false)}
                            source={{
                                uri: imageuri
                            }} /></> : <TouchableOpacity
                                onPress={imageHandler} style={styles.btn} >
                        <Text style={styles.text}>Add Photo</Text></TouchableOpacity>}
                </View>
            }</View>}

            {imageuri ? null : <View>{videoUrl ? <View><Icon onPress={() => {
                setVideoUrl(null);
            }} style={{
                position: 'absolute',
                alignSelf: 'flex-end', zIndex: 2
            }} color='black' size={35} name='close' />
                <Video source={{
                    uri: videoUrl ?
                        videoUrl : 'file/content.jpg'
                }} onLoad={() => setvideoUploading(false)}
                    style={styles.backgroundVideo} /></View> : null}
                {videoUrl ? null : (
                    <View>{videoUploading ? <ActivityIndicator color='purple' size='large' /> :
                        <TouchableOpacity
                            onPress={videoHandler} style={styles.btn} >
                            <Text style={styles.text}>Add video</Text></TouchableOpacity>}
                    </View>)}</View>}
            <TextInput value={details} numberOfLines={5} placeholder='enter post details...'
                multiline style={styles.input} keyboardType='default'
                onChangeText={t => { setDetails(t); setAdd(null) }} />
            {add && <Text style={{ color: 'red', }}>{add}</Text>}
            {
                postdone ? <ActivityIndicator color='blue' size='small' /> :
                    <View style={{
                        justifyContent: 'space-between', flexDirection: 'row', width: width / 1.4,
                        alignSelf: 'center', alignContent: 'center', alignItems: 'center'
                    }}>
                        <TouchableOpacity onPress={post} style={{ ...styles.btn, width: width / 3 }}>
                            <Text style={styles.text}>Create Post</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('newsfeed')}
                            style={{ ...styles.btn, width: width / 3, backgroundColor: 'lightgray' }}>
                            <Text style={styles.text}>Go to Feeds</Text></TouchableOpacity>

                    </View>
            }
            <TouchableOpacity onPress={() => navigation.navigate('youtubelinks')}
                style={{ ...styles.btn, width: width * 0.7, backgroundColor: 'purple' }}>
                <Text style={styles.text}>Go to highlights</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('challenge_create')}
                style={{ ...styles.btn, width: width * 0.7, backgroundColor: 'purple' }}>
                <Text style={styles.text}>Go to Challenges</Text></TouchableOpacity>
            {/* </ScrollView> */}
        </KeyboardAvoidingView >
    )
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    text: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: height * 0.03
    },
    curved: {
        backgroundColor: 'white', width: width * 0.09,
        height: width * 0.09, alignSelf: 'flex-end',
        alignItems: 'center', position: 'absolute',
        zIndex: 1, borderRadius: 50
    },
    backgroundVideo: {
        width: width,
        height: height * 0.3,
        alignSelf: 'center',
        opacity: 0.5,
    },
    post: {
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        width: width,
        marginTop: 5,
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center'
    },
    img: {
        alignSelf: 'center',
        width: width / 2,
        height: height / 3
    },
    btn: {
        width: width / 2,
        height: height / 12,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 5,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'purple'
    },
    input: {
        borderWidth: 0.5,
        borderRadius: 10,
        width: width / 2,
        height: height / 12,
        justifyContent: 'center', alignItems: 'center',
        marginTop: 5,
    }
})
export default CreatePost;
