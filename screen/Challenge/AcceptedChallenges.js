import React, { useEffect, useRef, useState } from 'react'
import {
    View, StyleSheet, Dimensions, TouchableOpacity,
    Text, ActivityIndicator, BackHandler, Alert
} from 'react-native';
import { app } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import VideoRecorder from 'react-native-beautiful-video-recorder';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import * as ImagePicker from 'react-native-image-picker';
import moment from 'moment';


const AcceptedChallenges = ({ navigation, route }) => {
    const deviceId = useSelector(d => d.user.device_id);
    const cameraref = useRef(null);
    const [VideoUrl, setVideoUrl] = useState('');
    const [challengeData, setChallangeData] = useState({});
    const [videoUploading, setvideoUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const firebaseref = app.database().ref('challenges');
    const [expired, setExpired] = useState(false);
    const [screenLoading,setScreenLoading]=useState(false)

    useEffect(() => {
        firebaseref.child(`${route.params.challenge_id}`).get()
            .then(res => {
                setChallangeData(res.toJSON());
            }).catch(e => {
                console.log('firebase err', e)
            })
    }, [])

    useEffect(() => {
        if (!challengeData.acceptorVideo || !challengeData.creatorVideo) {
            deletechallenge(challengeData.createdAt);
        }
        setVideoUrl(challengeData.acceptedBy === deviceId ?
            challengeData.acceptorVideo :
            challengeData.creatorVideo)
    }, [challengeData]);

    var deletechallenge = createdAt => {
        var date1 = moment(createdAt).format("yyyy-MM-DD");
        var date2 = moment().format("yyyy-MM-DD");
        date1 = date1.split("-");
        date2 = date2.split("-");
        const oneDay = 24 * 60 * 60 * 1000;
        date1 = new Date(date1[0], date1[1], date1[2]);
        date2 = new Date(date2[0], date2[1], date2[2]);
        const diffDays = Math.round(Math.abs((date1 - date2) / oneDay)) - 1;
        if (diffDays >= 3) {
            firebaseref.child(`${route.params.challenge_id}`).remove().then(response => {
                setExpired(true);
            }).catch(e => {
                console.log('delte chanllenge err')
            })
        }
        setScreenLoading(false)
    };

    const videoHandler = async choose => {
        const options = {
            mediaType: 'video',
            videoQuality: 'high',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        }
        if (choose === 'gallery') {
            await ImagePicker.launchImageLibrary(options, res => {
                if (res.didCancel) {
                    console.log('User cancelled video picker');
                } else {
                    videoUpload(res);
                    setLoading(true)
                    setvideoUploading(true)
                }
            })
        }
        else {
            cameraref.current.open({ maxLength: 30 }, data => {
                videoUpload(data);
                setLoading(true);
                setvideoUploading(true)
            })
        }
    }
    var videoUpload = async uploadingfile => {
        RNFetchBlob.fetch('POST', 'https://api.cloudinary.com/v1_1/mernapp/video/upload', {
            'Content-Type': 'multipart/form-data'
        }, [
            {
                name: 'file',
                filename: uploadingfile.uri,
                type: uploadingfile.type,
                data: RNFetchBlob.wrap(uploadingfile.uri)
            },
            { name: 'upload_preset', data: 'olxApp' }
        ]).then((response) => {
            const { url } = JSON.parse(response.data)
            setVideoUrl(url)
            let videoobj = null
            if (challengeData.acceptedBy === deviceId) {
                videoobj = { acceptorVideo: url }
            }
            else {
                videoobj = { creatorVideo: url }
            }
            firebaseref.child(`${route.params.challenge_id}`)
                .update(videoobj).then(res => {
                    setVideoUrl(url);
                    Alert.alert('',
                        "video submit succesfully", [{ text: "OK" }]
                    );
                }).catch(e => {
                    setLoading(false)
                    console.log('firebase upload err')
                })
        }).catch(err => {
            setLoading(false);
            console.log('cloudinary upload err');
        })
    }
    const submitVideo = () => {
        let videoobj = null
        if (challengeData.acceptedBy === deviceId) {
            videoobj = { acceptorVideo: url }
        }
        else {
            videoobj = { creatorVideo: url }
        }
        firebaseref.child(`${route.params.challenge_id}`)
            .update(videoobj).then(res => {
                setVideoUrl(url);
                Alert.alert('',
                    "submit succesfully", [{ text: "OK" }]
                );
            }).catch(e => {
                setLoading(false)
                console.log('firebase upload err')
            })
    }
    useEffect(() => {
        VideoUrl && setLoading(true)
    }, [VideoUrl])
    return (
        <View style={{ height: height, }}>
            {!challengeData && <ActivityIndicator style={{
                position: 'absolute', zIndex: 10, flex: 1, display: 'flex',
                justifyContent: 'center', alignItems: 'center'
            }} color='black' />}
            <VideoRecorder ref={cameraref} />
            {expired ? null : <Text style={{
                fontSize: height * 0.03, textAlign: 'center',
            }}>{challengeData?.creatorId} vs {challengeData?.acceptedBy}</Text>}
            {loading ? <ActivityIndicator color='purple'
                style={styles.loader} size='large' /> : null}
            <Video source={{ uri: VideoUrl ? VideoUrl : 'dddddd' }}
                onLoad={() => { setLoading(false) }}
                style={styles.backgroundVideo} />
            {/* {challengeData.acceptorVideo || challengeData.creatorVideo ? <View style={styles.videoCont}>
                {loading ? <ActivityIndicator color='purple'
                    style={styles.loader} size='large' /> :
                    <View>
                        <Video resizeMode='cover'
                            repeat={repeat}
                            source={{
                                uri: VideoUrl ? VideoUrl : 'file/content.jpg'
                            }}
                            onLoadStart={() => setLoading(true)}
                            onLoad={() => setLoading(false)}
                            onEnd={() => setshowreplay(true)}
                            style={styles.backgroundVideo} />
                        {showreplay && <TouchableOpacity
                            style={styles.replay}
                            onPress={() => setRepeat(!repeat)}>
                            <Icon name='replay' color='black' size={40} />
                        </TouchableOpacity>}
                    </View>}
            </View> : <View style={styles.videoCont}></View>} */}

            {/* buttons */}
            {expired ? <View>
                <Text style={{ color: 'red',margin:10,textAlign:'center' }}>Challenge has been expired, please create new one</Text>
                <TouchableOpacity onPress={() => navigation.navigate('challenges')} style={{
                    ...styles.btn, backgroundColor: 'green',
                }} >
                    <Text style={{ color: 'white' }}>Create</Text></TouchableOpacity></View> :
                <View style={styles.btnvw}>
                    <TouchableOpacity style={{
                        ...styles.btn,
                    }}
                        onPress={() => videoHandler('camera')}>
                        <Text style={{ color: 'white' }}>Upload a video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...styles.btn,
                    }}
                        onPress={() => videoHandler('gallery')}>
                        <Text style={{ color: 'white' }}>Choose from gallery</Text>
                    </TouchableOpacity>
                </View>}
            {/* <TouchableOpacity style={{
                ...styles.btn, backgroundColor: 'green', marginTop: 10
            }} disabled={false}
                onPress={submit}>
                <Text style={{ color: 'white' }}>Submit</Text>
            </TouchableOpacity> */}
        </View >
    )
}
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    loader: {
        display: 'flex', position: 'absolute',
        justifyContent: 'center', zIndex: 10,
        alignSelf: 'center', top: height * 0.2
    },
    btnvw: {
        display: 'flex', flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-around'
    },
    videoCont: {
        backgroundColor: 'lightgray',
        width: width,
        height: height * 0.3,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    replay: {
        zIndex: 5,
        position: 'absolute',
        bottom: 0, right: 0
    },
    btn: {
        width: width * 0.4,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'purple',
    },
    backgroundVideo: {
        width: width,
        height: height * 0.32,
        alignSelf: 'center',
        zIndex: 5
    },
})

export default AcceptedChallenges;