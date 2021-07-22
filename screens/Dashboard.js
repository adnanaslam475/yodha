import React, { Component } from 'react'
import {
    Text,
    ToastAndroid,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    Image,
    Dimensions,
    ScrollView
} from 'react-native';
import * as affirmations from './dummyAffirmations';
 
export default class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
    }

    fun() {
        ToastAndroid.show(this.props.route.params.save,
            ToastAndroid.SHORT, ToastAndroid.CENTER)
    }
    render() {
        this.props.route.params?.save && this.fun()
        return (<ScrollView style={{
            margin: 5,
        }}>
            {affirmations.arr.map((v, i) => {
                return (<TouchableOpacity style={{
                    position: 'relative'
                }}
                    onPress={() => this.props.navigation.navigate('list',
                        {
                            title: v.a,
                            backgroundColor: v.color
                        })}
                    key={i}>
                    <ImageBackground style={styles.backImg} source={v.b} />
                    <Text style={styles.text}>{v.a}</Text>
                </TouchableOpacity>)
            }
            )}
        </ScrollView >)
    }
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    backImg: {
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
        width: width * 0.94,
        height: width * 0.25,
    },
    text: {
        fontFamily: 'Roboto-Bold',
        position: 'absolute',
        top: height * 0.02,
        left: width * 0.04,
        fontSize: width * 0.07,
        color: 'white'
    }
})
//   PushNotification.localNotification({
//         autoCancel: true,
//         bigText:
//             'This is local notification demo in React Native app. Only shown, when expanded.',
//         subText: 'Local Notification Demo',
//         title: 'Local Notification Title',
//         message: 'Expand me to see more',
//         vibrate: true,
//         allowWhileIdle: true,
//         vibration: 10,
//         playSound: true,
//         soundName: 'default',
//         actions: '["Yes", "No"]',
//         channelId: '580345375930'
//     })