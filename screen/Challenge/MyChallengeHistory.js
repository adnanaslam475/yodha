import React, { useEffect, useRef, useState } from 'react'
import {
    View, StyleSheet, Dimensions,
    Text, ActivityIndicator, BackHandler, Alert, ScrollView
} from 'react-native';
import { app } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import moment from 'moment';
const MyChallengeHistory = () => {
    const deviceId = useSelector(d => d.user.device_id);
    const [mychalllenges, setMyChallenges] = useState(null);
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        setLoading(true)
        app.database().ref('challenges').get().then(res => {
            const arr = []
            const data = Object.values(res.toJSON())
            data.filter((el, i) => (el.acceptedBy || el.creatorId) == deviceId && arr.push(el))
            console.log('my challenge history data=-=>', data)
            setMyChallenges(arr);
            setLoading(false)
        }).catch(e => {
            setLoading(false)
            console.log('errrr')
        })
    }, [])
    return (
        <ScrollView style={{ padding: 5, opacity: loading ? 0.5 : 1 }}>
            {loading ? <ActivityIndicator color='purple' size='large'
                style={styles.loader}
            /> : mychalllenges?.map((v, i) => <View key={i}
                style={styles.vw}>
                {/* <Text>{v.categoryType} {v.creatorId == deviceId ? 'created' : 'accepted'} by {`${v}`} {moment(v.createdAt).fromNow()}</Text>     */}
                <Text>{v.categoryType} {v.acceptedBy == deviceId ? 'accepted' : 'created'} by you {moment(v.createdAt).fromNow()}</Text>
            </View>)}
        </ScrollView>
    )
}
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    loader: {
        marginTop: height / 2,
        zIndex: 10, alignSelf: 'center'
    },
    vw: {
        height: height * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.9,
        elevation: 2,
        margin: 5,
        borderRadius: 5,
    }
})
export default MyChallengeHistory
