import React, { useState } from 'react'
import {
    View, StyleSheet, TextInput, Text,
    Dimensions, Image, TouchableOpacity,
} from 'react-native';
import NameIconSvg from '../../assets/namecardicon.svg';
import MaleIconSvg from '../../assets/male.svg';
import FemaleIconSvg from '../../assets/female.svg';
import Dob_icon from '../../assets/dob_icon.svg'
import CountryPicker from 'react-native-country-picker-modal'
import Birthbuilding from '../../assets/building_gray_1741291.svg';
import dropdown from '../../assets/arrow_drop_down-24px.png';
import CustomText from '../TExt';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker'
import WorldGray from '../../assets/world_gray_3455770.svg';

const BirthDetails = ({ navigation }) => {
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [time, setTime] = useState(new Date().getTime());
    const [timemode, setTimeMode] = useState('time')
    const [showTime, setShowTime] = useState(false);


    const [country, setCountry] = useState('')
    const [modal, setModal] = useState(false)

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
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display='default'
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
            <CustomText color='#A09E9E' text='To get personal prediction, fill your 
            birth details to the best of your knowledge' />
            <View style={{ ...styles.vw, justifyContent: 'center' }}>
                <NameIconSvg width={35} height={35} marginTop={15} marginRight={5} />
                <TextInput placeholder='JANIFER' style={styles.inp} />
            </View>
            <View style={{ marginTop: 30, flexDirection: 'row' }}>
                <MaleIconSvg width={80} height={30} />
                <FemaleIconSvg width={80} height={30} marginLeft={60} />
            </View>
            <View style={styles.vw, {
                flexDirection: 'row',
                height: 50,
                width: 320,
                marginTop: 23
            }}>
                <Dob_icon width={35} height={35} marginRight={10} />
                <TouchableOpacity onPress={showDatepicker}  >
                    <CustomText color='#A09E9E' date={moment(date).format('DD MMM YYYY')}
                        borderbottomwidth={1} borderBottomColor={'#E4E5E5'} img={dropdown} />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 71 }} onPress={showTimepicker}>
                    <CustomText color='#A09E9E' borderbottomwidth={1} borderBottomColor={'#E4E5E5'}
                        time={moment(time).format('HH:mm A')} img={dropdown} />
                </TouchableOpacity>
            </View>
            <View style={styles.vw, { height: 50, flexDirection: 'row', justifyContent: 'center' }}>
                <WorldGray marginRight={4} width={35} height={35} marginTop={15} />
                <TouchableOpacity onPress={() => { setModal(true) }} style={styles.c}>
                    <View style={{ marginLeft: 5, flexDirection: 'row' }} >
                        <CountryPicker translation='eng' onSelect={e => { setCountry(e), setModal(false) }} />
                        <Image source={dropdown} />
                    </View>
                    {country.name ? <CustomText color='#A09E9E' text={country.name} align='flex-start' marginLeft={5} /> : null}
                </TouchableOpacity>
            </View>
            <View style={{ ...styles.vw, justifyContent: 'center' }}>
                <Birthbuilding width={35} height={35} marginTop={9} />
                <TextInput placeholder='JANIFER' style={{ ...styles.inp, marginLeft: 13 }} />
            </View>
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
            <CustomText color='#A09E9E' text='*please ensure that time is inaccurate'
                fontStyle='italic' marginTop={10} />
        </View>
    )
}

const { width, height } = Dimensions.get('screen');
const styles = StyleSheet.create({
    c: {
        borderBottomWidth: 1,
        borderBottomColor: '#E4E5E5',
        width: 260,
        marginLeft: 5,
    },
    vw: {
        flexDirection: 'row',
        marginTop: 10
    },
    main: {
        padding: 40,
        height: height,
        alignItems: 'center',
        width: width,
        backgroundColor: '#fcfcfc',
    },
    touch: {
        borderBottomColor: '#E4E5E5',
        borderBottomWidth: 1,
    },

    inp: {
        width: width - 100,
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E5E5',
        color: 'red'
    },
    show: {
        backgroundColor: '#2984f2',
        width: width - 200,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 10
    }
})
export default BirthDetails

// <Picker 
// selectedValue={select}
// style={{ height: 50, width: width - 100, color: 'gray' }}
// onValueChange={(item) => setSelect(item)}>
// <Picker.Item label="USA" value="USA" />
// <Picker.Item label='JavaScript' value="js" />
// </Picker>