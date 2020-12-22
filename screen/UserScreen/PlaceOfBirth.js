import React, { useState } from 'react'
import {
    View, StyleSheet, TextInput,
    Dimensions, Image, TouchableOpacity,
} from 'react-native';
import World from '../../assets/world_3455770.svg';
import Birthplace from '../../assets/birthplace_2218096.svg';
import Birthbuilding from '../../assets/building_1741291.svg';
import CustomText from '../TExt';
import Icon from 'react-native-vector-icons/MaterialIcons';


const PlaceOfBirth = ({ navigation }) => {
    return (
        <View style={styles.main}>
            <TouchableOpacity style={{ marginLeft: 15, position: 'absolute', top: 20, alignSelf: 'flex-start' }}>
                <Icon name='arrow-back' size={30} color='gray' onPress={() => { navigation.navigate('birthday') }} />
            </TouchableOpacity>
            <Birthplace width={35} height={35} marginTop={10} marginRight={5} />
            <CustomText fontFamily='SinhalaMN-Bold' marginTop={10} fontSize={25} text='what is your place of birth?' />
            <View style={styles.vw}>
                <World width={35} height={35} marginRight={5} />
                <TextInput placeholder='USA' style={styles.inp} />
            </View>
            <View style={styles.vw} >
                <Birthbuilding width={30} height={35} marginRight={5} />
                <TextInput placeholder='California' style={styles.inp} />
            </View>
            <TouchableOpacity style={styles.show} onPress={() => { navigation.navigate('birthday') }} >
                <CustomText text='lets get started' color='white' padding={10} />
            </TouchableOpacity>
        </View>
    )
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    vw: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#bdbdbd',
        marginTop: 10,
        height: 40

    },
    main: {
        height: height - 30,
        padding: 40,
        paddingTop: 150,
        alignItems: 'center',
        width: width,
    },
    inp: {
        width: width - 100,

    },

    show: {
        backgroundColor: '#2984f2',
        width: 180,
        alignSelf: 'center',
        marginTop: 15,
        borderRadius: 10
    }
})

export default PlaceOfBirth