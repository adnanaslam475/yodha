import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

const ChallengeCreateScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity style={styles.btn}
                onPress={() => navigation.navigate('challenges')}>
                <Text style={styles.txt}>Create New</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btn}
                onPress={() => navigation.navigate('open-challenges')}>
                <Text style={styles.txt}>See Challenges</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btn}
                onPress={() => navigation.navigate('history')}>
                <Text style={styles.txt}>My Challenges</Text></TouchableOpacity>
        </View>
    )
}
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    main: {

    },
    txt: {
        color: 'white',

    },
    btn: {
        width: width * 0.5,
        height: height * 0.07,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'purple',

    },
})
export default ChallengeCreateScreen
