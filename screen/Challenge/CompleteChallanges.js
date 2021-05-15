import React, { useState, useEffect, useRef, } from 'react'
import {
    Text, View, Image, TouchableOpacity,
    ScrollView, StyleSheet, Dimensions, Alert,
    ActivityIndicator, BackHandler
} from 'react-native';
import { useSelector } from 'react-redux';
import Video from 'react-native-video';
import { Rating } from 'react-native-ratings';
import { app } from '../../firebaseConfig';
import moment from 'moment';
import firebase from 'firebase';

const CompleteChallanges = ({ route }) => {
    const deviceId = useSelector(d => d.user.device_id);
    const [challengeData, setChallengeData] = useState(null);
    const [ratingone, setRatingone] = useState(null);
    const [ratingtwo, setRatingtwo] = useState(null);
    const [loading, setloading] = useState(false)
    const firstref = useRef(null);
    const ratingref = app.database().ref('challenge_ratings');
    const challengeref = app.database().ref('challenges');
    const [show, setShow] = useState(false);
    const [disabled, setDisabled] = useState(false)
    const secondref = useRef(null);
    const [arr, setArr] = useState([]);
    const [ERR, setERR] = useState('');
    const [creatorCurrentRating, setcreatorCurrentRating] = useState('')
    const [acceptorCurrentRating, setAcceptorCurrentRating] = useState('')
    const [hideAll, setHideAll] = useState(false);
    const [winId, setWinnerId] = useState('');
    const [acceptorRatingCount, setAcceptorRatingsCount] = useState(0)
    const [creatorRatingsCount, setCreatorRatingsCount] = useState(0);


    useEffect(() => {
        challengeref.child(`${route.params.challenge_id}`).get().then(res => {
            setChallengeData(res.toJSON());
            ratingref.child(`${route.params.challenge_id}`).get().then(response => {
                const arr = Object.values(response.toJSON());
                arr.forEach(e => {
                    e.raterId.includes(deviceId) && setDisabled(true);
                    return;
                });
            }).catch(e => {
                console.log('rating nai kia abi')
            })
        }).catch(e => {
            console.log('chl err');
        })
    }, [])


    const reviews = (id, rating) => {
        setERR('')
        const filter = arr.filter((v, i) => v.ratedId === id)
        const remaining = arr.filter((v, i) => v.ratedId !== id)
        if (filter[0]?.ratedId === id) {
            filter[0].rating = rating
            setArr(remaining.concat(filter));
        }
        else {
            const obj = { ratedId: id, rating: rating }
            setArr([...arr, obj])
        }
    }

    useEffect(() => {
        var fun = () => {
            // 1618702310314
            var date1 = moment(challengeData?.createdAt).format("yyyy-MM-DD");
            var date2 = moment().format("yyyy-MM-DD");
            date1 = date1.split("-");
            date2 = date2.split("-");
            const oneDay = 24 * 60 * 60 * 1000;
            date1 = new Date(date1[0], date1[1], date1[2]);
            date2 = new Date(date2[0], date2[1], date2[2]);
            const diffDays = Math.round(Math.abs((date1 - date2) / oneDay)) - 1;
            if (challengeData !== null) {
                app.database().ref('challenge_ratings/' + route.params.challenge_id).get()
                    .then(r => {
                        const arr = Object.values(r.toJSON());
                        arr.forEach(el => delete el.raterId && delete el.createdAt);
                        const newarr = [];
                        // setUsersRating(newarr);
                        arr.forEach(el => newarr.push(...Object.values(el)));
                        const acceptorArr = newarr.filter((v, i) => v.ratedId == challengeData.acceptedBy)
                        const creatorArr = newarr.filter((v, i) => v.ratedId == challengeData.creatorId)

                        function acceptorRating() {
                            let sum = 0;
                            for (let i in acceptorArr) {
                                sum += acceptorArr[i].rating;
                            }
                            return sum;
                        }
                        function creatorRating() {
                            let sum = 0;
                            for (let i in creatorArr) {
                                sum += creatorArr[i].rating;
                            }
                            return sum;
                        }
                        setAcceptorRatingsCount(acceptorArr.length)
                        setCreatorRatingsCount(creatorArr.length)
                        setcreatorCurrentRating(creatorRating());
                        setAcceptorCurrentRating(acceptorRating());

                        if (diffDays >= 10) {
                            let winnerId = '';
                            if (acceptorRating > creatorRating) {
                                winnerId = challengeData.acceptedBy
                            }
                            if (acceptorRating < creatorRating) {
                                winnerId = challengeData.creatorId
                            }
                            challengeref.child(`${route.params.challenge_id}`).update({ winnerId })
                                .then(res => {
                                    setWinnerId(winnerId)
                                    setHideAll(true);
                                }).catch(e => {
                                    console.log('e in 94')
                                })
                        }
                    }).catch(e => {
                        console.log('ksi ne rate nai kra 100')
                    })
            }
        };
        fun()
    }, [challengeData])

    const ratingsubmit = () => {
        if (challengeData.acceptedBy == deviceId ||
            challengeData.creatorId == deviceId) {
            Alert.alert('SORRY!!!',
                "Only public can rate your videos", [{ text: "OK" }]
            );
        } else {
            if (arr.length === 0) {
                setERR('please rate first');
            } else {
                ratingref.child(`${route.params.challenge_id}`).push({
                    ...arr,
                    raterId: deviceId,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                })
                    .then(res => {
                        setArr(null);
                        setDisabled(true);

                    }).catch(e => {
                        Alert.alert('SORRY!!!',
                            "Network Error", [{ text: "OK" }]);
                        console.log('eeee');
                    })
            }
        }
    }
    console.log(acceptorRatingCount, creatorRatingsCount)
    return (
        <View>
            <View style={{ height: height * 0.5 }}>
                {loading && <ActivityIndicator color='purple' size='large'
                    style={styles.loader} />}
                {challengeData?.acceptedBy && !show && <View>
                    <Video source={{ uri: challengeData?.acceptorVideo }}
                        style={styles.video}
                        onLoadStart={() => setloading(true)}
                        onLoad={() => setloading(false)}
                    />
                    <Rating
                        ratingCount={5}
                        name={challengeData.acceptedBy}
                        ref={firstref}
                        style={{ marginTop: height * 0.03 }}
                        minValue={ratingone}
                        startingValue={0}
                        onStartRating={t => setRatingone(t)}
                        onFinishRating={() => {
                            reviews(challengeData.acceptedBy, firstref.current.props.minValue);
                        }}
                    />
                </View>}
                {challengeData?.creatorId && show && <View>
                    <Video source={{ uri: challengeData?.creatorVideo }}
                        style={styles.video}
                        onLoadStart={() => setloading(true)}
                        onLoad={() => setloading(false)}
                    />
                    <Rating
                        ratingCount={5}
                        ref={secondref}
                        style={{ marginTop: height * 0.03 }}
                        minValue={ratingtwo}
                        startingValue={0}
                        onStartRating={t => setRatingtwo(t)}
                        onFinishRating={() => {
                            reviews(challengeData.creatorId, secondref.current.props.minValue);
                        }}
                    />
                </View>}
            </View>
            <View style={styles.txtvw}>
                <Text style={styles.text}>{challengeData?.acceptedBy}</Text>
                <Text style={styles.text}>{challengeData?.creatorId}</Text>
            </View>
            <Text style={{ alignSelf: 'center' }}>CURRENT RATINGS:</Text>
            <View style={styles.txtvw}>
                <Text style={styles.text}>{acceptorCurrentRating}</Text>
                <Text style={styles.text}>{creatorCurrentRating}</Text>
            </View>
            <View style={styles.txtvw}>
                <Text >{acceptorRatingCount} user rated</Text>
                <Text  >{creatorRatingsCount} user rated</Text>
            </View>

            <><View style={styles.btnvw}>
                <TouchableOpacity style={{ ...styles.btn, opacity: show === false ? 0.5 : 1 }}
                    disabled={show === false}
                    onPress={() => setShow(!show)}>
                    <Text style={{ color: 'white' }}> Acceptor video {ratingone}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btn}
                    style={{ ...styles.btn, opacity: show === true ? 0.5 : 1 }}
                    disabled={show === true}
                    onPress={() => setShow(!show)}>
                    <Text style={{ color: 'white' }}> Creator video {ratingtwo}</Text></TouchableOpacity>
            </View>
                {ERR ? <Text style={{ textAlign: 'center', alignSelf: 'center', color: 'red' }}>{ERR}</Text> : null}
                {challengeData?.winnerId || hideAll === true ?
                    <Text style={{ fontWeight: 'bold', alignSelf: 'center', marginTop: 5, fontSize: height * 0.03 }}>
                        {winId || challengeData?.winnerId}{' '}
               won this challenge</Text> : <TouchableOpacity style={{
                        ...styles.btn, alignSelf: 'center',
                        margin: 15, backgroundColor: 'green',
                        opacity: disabled ? 0.5 : 1
                    }} onPress={ratingsubmit} disabled={disabled}>
                        <Text style={{ color: 'white' }}>Submit</Text>
                    </TouchableOpacity>}</>
        </View>
    )
}
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    text: {
        fontWeight: 'bold',
        fontSize: width * 0.05
    },
    txtvw: {
        display: 'flex', flexDirection: 'row',
        justifyContent: 'space-around'
    },
    video: {
        marginTop: 10,
        width: width,
        alignSelf: 'center',
        height: height * 0.36,
    },
    loader: {
        position: 'absolute', zIndex: 10,
        marginTop: height * 0.18,
        alignSelf: 'center'
    },
    btnvw: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    btn: {
        width: width * 0.45,
        height: height * 0.07,
        justifyContent: 'center',
        color: 'white',
        alignItems: 'center',
        fontWeight: 'bold',
        borderRadius: 10,
        backgroundColor: 'purple',
    },
})
export default CompleteChallanges;