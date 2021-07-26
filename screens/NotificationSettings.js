import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity, View,
    Platform, Text, ScrollView,
} from 'react-native';
import CheckBox from 'react-native-check-box'
import * as affirmations from './dummyAffirmations'
import PushNotification from 'react-native-push-notification';
import { styles } from '../styles';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { db } from './Sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import No_icon from '../assets/Images/travel.jpg';


PushNotification.configure({
    onNotification: function (notification) {
        console.log(notification)
    },
    requestPermissions: Platform.OS === 'ios',
});

async function ScheduleNotification(newtime, arr, check) {
    let ispaused = false
    async function f() {
        await arr.forEach(async (v, idx) => {
            await db.transaction(tx => {
                tx.executeSql(`SELECT * FROM ${v}`, [], (tx, results) => {
                    var affirmationarr = [];
                    for (let i = 0; i <= results.rows.length; i++) {
                        affirmationarr.push({
                            id: results.rows.item(i).ID,
                            qoute: results.rows.item(i).qoute,
                            filexist: results.rows.item(i).file ? true : false,
                            file: results.rows.item(i).file
                        })
                        ispaused = true;
                        randomaffirmationsarr.push(...affirmationarr);
                        console.log('rnd->', randomaffirmationsarr.length)
                        var randomaffirmationsarr = [];
                        if ((arr.length - 1) == idx) {
                            console.log('return', (arr.length - 1) == idx)
                            return randomaffirmationsarr;
                        }
                    }
                })
            })
        })
    }
    f();

    let minutes = newtime.split(':');
    const newminutes = parseInt(minutes[0]) * 60 + parseInt(minutes[1]);
    const newdate = new Date().getMinutes()
    const minus = newminutes - newdate
    console.log(newminutes, newdate, minus)
    PushNotification.localNotificationSchedule({
        message: "scheduled notifications",
        date: new Date(Date.now() + minus * 60 * 1000),
        allowWhileIdle: true,
        largeIconUrl: No_icon,
        title: 'Today`s Affirmation',
        ignoreInForeground: true,
        message: 'You are luckiest',
        vibrate: true,
        vibration: 10,
        playSound: true,
        repeatType: check === true ? 'day' : 'week',
        soundName: 'default',
        channelId: '580345375930',
        repeatTime: 1,
    })

    // BackgroundTimer.runBackgroundTimer(async function () {
    //     PushNotification.localNotificationSchedule({
    //         message: "scheduled notifications",
    //         // date: new Date(Date.now() + newminutes * 60 * 1000),
    //         allowWhileIdle: true,
    //         title: 'schedule Notification Title',
    //         ignoreInForeground: true,
    //         message: 'scheduled',
    //         vibrate: true,
    //         vibration: 10,
    //         playSound: true,
    //         repeatType: 'day',
    //         soundName: 'default',
    //         channelId: '580345375930',
    //         repeatTime: 1,
    //     })
    // },
    //     3000);
    // check == false && BackgroundTimer.stopBackgroundTimer();
}

const TestPush = () => {
    PushNotification.localNotification({
        message: "scheduled notifications",
        allowWhileIdle: true,
        title: 'schedule Notification Title',
        ignoreInForeground: true,
        message: 'scheduled',
        vibrate: true,
        vibration: 10,
        playSound: true,
        soundName: 'default',
        channelId: '580345375930',
        repeatTime: 1,
    })
}


const NotificationSettings = ({ navigation }) => {
    const [time, settime] = useState(new Date())
    const [show, setshow] = useState(false)
    const [check, setcheck] = useState(false)
    const [arr, setArr] = useState([])
    const newtime = moment(time).format('HH:mm');
    console.log('notificationscreen')

    useEffect(() => {
        const f = async () => {
            // await AsyncStorage.removeItem('settings');
            const res = await AsyncStorage.getItem('settings');
            const respo = JSON.parse(res)
            if (res) {
                setcheck(respo.check),
                    settime(respo.time),
                    setArr(respo.arr)
            }
        };
        f()
        ScheduleNotification(newtime !== 'Invalid date' && newtime, arr, check)
    }, [])

    useEffect(() => {
        ScheduleNotification(newtime !== 'Invalid date' && newtime, arr, check)
    }, [time])

    const onChange = (e, selectedTime) => {
        setshow(Platform.OS === 'ios');
        settime(moment(selectedTime))
        setcheck(true)
    };


    const save = async () => {
        const jsonValue = JSON.stringify({ time, check, arr })
        await AsyncStorage.setItem('settings', jsonValue)
        navigation.navigate('main', {
            save: 'settings saved successfully'
        })
    }


    return (
        <ScrollView>
            {show && (
                <RNDateTimePicker
                    onChange={onChange}
                    themeVariant='dark'
                    mode="time"

                    is24Hour={true}
                    date={new Date(time)}
                    value={new Date(time)}
                />
            )}
            <View style={styles.check}>
                <Text>Daily Reminder</Text>
                <CheckBox onClick={() => setcheck(!check)}
                    isChecked={check}
                    checkBoxColor='pink'
                /><Text>{check == true && newtime}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
                {affirmations.arr.map((v, i) => <View key={i} style={styles.check}>
                    <CheckBox onClick={() => {
                        arr?.includes(v.a) ? setArr(arr.filter((val, i) => val !== v.a)) :
                            setArr([...arr, v.a])
                    }}
                        isChecked={arr?.includes(v.a) ? true : false}
                        checkBoxColor='pink'
                    />
                    <Text>{v.a}</Text>
                </View>)}
            </View>
            <TouchableOpacity
                style={{
                    ...styles.savebtn,
                    backgroundColor: 'pink'
                }}
                onPress={() => setshow(true)} >
                <Text style={styles.text}>Set Time of Reminder</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    ...styles.savebtn,
                    backgroundColor: 'pink'
                }}
                onPress={TestPush}
            >
                <Text style={styles.text}>Test Notification</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
                ...styles.savebtn,
                backgroundColor: 'pink'
            }} onPress={save}>
                <Text style={styles.text}>Save</Text></TouchableOpacity>
        </ScrollView>
    )
}
export default NotificationSettings;

    // let affirmationarr = [];
    // async function fun() {
    //     arr.forEach(async v => {
    //         await db.transaction(async tx => {
    //             let newarr = []
    //             await tx.executeSql(`SELECT * FROM ${v}`, [], (tx, results) => {
    //                 for (let i = 0; i < results.rows.length; i++) {
    //                     newarr.push({
    //                         qoute: results.rows.item(i).qoute,
    //                     })
    //                 }
    //                 affirmationarr = newarr
    //             })
    //         })
    //     })
    // }
    // fun();