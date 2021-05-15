import React, { useEffect, useState } from 'react'
import {
    Text, View, Image, TouchableOpacity,
    ScrollView, Dimensions, StyleSheet, Modal
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { app } from '../../firebaseConfig';
import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
const NewsFeed = ({ navigation }) => {
    const deviceId = useSelector(d => d.user.device_id);
    const [feeds, setFeeds] = useState(null);
    const [feedsId, setFeedsId] = useState(null);
    const [paused, setPaused] = useState(false);
    const [like, setLike] = useState([]);
    const [loading, setLoading] = useState(true)
    const [videobuffering, setvideobuffering] = useState(false);
    const [fullimageModal, setfullimageModal] = useState(false);

    useEffect(() => {
        const arr = []
        app.database().ref('posts').get().then(res => {
            setLoading(false)
            setFeedsId(Object.keys(res.toJSON()))
            res.forEach(e => {
                arr.push(e.toJSON())
            })
            setFeeds(arr)
        }).catch(e => {
            setLoading(false)
            console.log(e)
        })
    }, []);



    return (
        <ScrollView>
            {loading ? <ActivityIndicator color='purple' size='large'
                style={styles.loader}
            /> : feeds?.map((v, i) => {
                const id = feedsId?.filter((val, index) => index === i)
                return (<View key={id[0]} style={styles.card} >
                    <View style={{
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        alignItems: 'center',
                    }} >
                        <Image source={{ uri: v.imageuri || 'dd' }} style={{
                            borderRadius: 25,
                            height: height / 13,
                            margin: 7,
                            width: width / 8,
                        }} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{deviceId}</Text>
                            <Text style={{ textAlign: 'center', }}>
                                {moment(v.createdAt).fromNow()}
                            </Text></View></View>
                    {v.details ? <Text style={{ margin: 10 }} >{v.details}</Text> : null}
                    {v.videoUrl || v.imageuri ? <TouchableOpacity delayPressIn={v.imageuri ? 10 : 100}
                        onPress={() => {
                            if (v.imageuri) {
                                setfullimageModal(true)
                            }
                        }} >{v.imageuri ? <Image style={styles.video}
                            source={{ uri: v.imageuri || 'adnan' }} /> : <>
                            {videobuffering && <ActivityIndicator style={{
                                margin: 100,
                                alignSelf: 'center', position: 'absolute'
                            }}
                                color='gray' size='large' />}<Video paused={true}
                                    playWhenInactive={false}
                                    onTouchCancel={() => setPaused}
                                    playInBackground={false}
                                    disableFocus={true}
                                    onLoadStart={() => setvideobuffering(true)}
                                    onBuffer={() => setvideobuffering(!videobuffering)}
                                    style={styles.video} resizeMode='cover' source={{
                                        uri: v.videoUrl || 'hkh'
                                    }} /></>}
                    </TouchableOpacity> : null}
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            if (like.includes(id[0])) {
                                // const array = [...like];
                                // array.splice(id[0], 1);
                                setLike(like.filter((v, ids) => v !== id[0]))
                            } else { setLike([...like, id[0]]) }
                        }} style={styles.touch}>
                            <Icon color={like.includes(id[0]) ?
                                'purple' : 'lightgray'} size={30} name='thumb-up' /></TouchableOpacity>
                        <TouchableOpacity style={styles.touch}
                            onPress={() => { navigation.navigate('comments', { feedId: id[0] }) }} >
                            <Text style={styles.text}>comments</Text></TouchableOpacity>
                    </View>
                </View>
                )
            })}
        </ScrollView >
    )
}


const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    loader: {
        marginTop: height / 2,
        zIndex: 10, 
        alignSelf: 'center'
    },
    text: {
        fontWeight: 'bold',
        color: 'gray',
        fontSize: 20
    },
    touch: {
        width: width / 2,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    card: {
        elevation: 1,
        flexDirection: 'column',
        paddingTop: 3,
        marginTop: 15,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5
    },
    video: {
        width: width * 0.96,
        alignSelf: 'center',
        height: height * 0.36,
        // borderRadius: 5,
    }
})
export default NewsFeed;