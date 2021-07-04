import React, { useEffect, useState } from 'react'
import {
    Text, View, StyleSheet, ActivityIndicator,
    Dimensions, TouchableOpacity, Alert, TextInput,
    Animated, Easing, TouchableWithoutFeedback,
    Image
} from 'react-native';

const Card = ({ }) => {

    const [zoom, setzoom] = useState(false);
    const value = new Animated.Value(0);
    const cardScale = value.interpolate({
        inputRange: [0, 0.5, 0.9],
        outputRange: [1, 1.1, 1.2],
    });


    console.log(zoom)
    return (
        <View style={{
            backgroundColor: 'red',
            height: height,
        }}>
            <TouchableWithoutFeedback onPress={() => {
                 Animated.timing(value, {
                    toValue: 5,
                    duration: 1000,
                    easing: Easing.in,
                    useNativeDriver: true
                }).start(e => {
                });
            }}>
                <Animated.View onResponderStart={() => {
                }}
                    style={{
                        ...styles.card,
                        transform: [{ scale: cardScale }],
                    }}>
                    <Text style={styles.name}>asssssssss</Text>
                </Animated.View>
            </TouchableWithoutFeedback>

        </View >
    )
}
const { width, height } = Dimensions.get('window')


const styles = StyleSheet.create({
    card: {
        marginTop: 100,
        width: width * 0.5,
        marginLeft: 20,
        height: height * 0.1,
        backgroundColor: 'blue'
    }
})
export default Card
