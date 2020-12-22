import React, { useState } from 'react'
import {
    View, Text, StyleSheet, Platform,
    Dimensions, Image, Button, TouchableOpacity
} from 'react-native';
import Dob_icon from '../../assets/dob_icon.svg'

import Delivery_icon from '../../assets/deliverytime.svg'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment';
import CustomText from '../TExt';


const birthday = ({ navigation }) => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [time, setTime] = useState(new Date().getTime());
    const [timemode, setTimeMode] = useState('time')
    const [showTime, setShowTime] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };
    ///////////////////////////
    const onChangeTime = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTime(Platform.OS === 'ios');
        setTime(currentTime);
    }

    const showModeTime = (currentMode) => {
        setShowTime(true);
        setTimeMode(currentMode);
    };
    const showTimepicker = () => {
        showModeTime('time');
    };
    return (
        <View style={styles.main}>
            <View>
                <Dob_icon width={35} height={35} alignSelf='center' marginBottom={10} />
                <CustomText fontSize={25} fontFamily='SinhalaMN-Bold' text='when is your birthday' />
                <TouchableOpacity style={styles.show} onPress={showDatepicker}>
                    <CustomText fontFamily='SinhalaMN-Bold' fontSize={25} date={moment(date).format('YYYY/MM/DD')} />
                </TouchableOpacity>
                <Delivery_icon alignSelf='center' marginTop={20} width={35} height={35} />
                <CustomText fontFamily='SinhalaMN-Bold' fontSize={25} text='when is your birthday' />
                <TouchableOpacity style={{ ...styles.show, width: 100 }} onPress={showTimepicker}>
                    <CustomText fontFamily='SinhalaMN-Bold' fontSize={25} time={moment(time).format('HH:mm')} />
                </TouchableOpacity>
                <CustomText fontFamily='SinhalaMN-Bold' fontStyle='italic' marginTop={10} text='*please ensure that time is incorrect' />
                <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate('birthdetails') }}  >
                    <CustomText fontSize={20} text='Next' padding={8} color={'white'} />
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                    />
                )}
                {showTime && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={time}
                        mode={timemode}
                        is24Hour={true}
                        display="default"
                        onChange={onChangeTime}
                    />
                )}
            </View>
        </View>
    )
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    main: {
        height: height,
        padding: 40,
        paddingTop: 120,
        alignItems: 'center',
        width: width - 10,
        alignSelf: 'center',
        margin: 10,
        backgroundColor: 'white'
    },
    Icon: {
        alignSelf: 'center',
        height: 30,
        width: 30,
        marginTop: 20,
        backgroundColor: '#bdbdbd',
        borderRadius: 50
    },
    show: {
        borderRadius: 5,
        width: 200,
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        borderColor: '#C8D1FE',
        alignSelf: 'center'
    },
    img: {
        alignSelf: 'center',
        width: 45,
        height: 40,
        marginBottom: 10,
    },
    btn: {
        backgroundColor: '#2984f2',
        width: 90,
        alignSelf: 'center',
        marginTop: 20,
        borderRadius: 10
    }
})

export default birthday