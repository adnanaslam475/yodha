import React, { useState } from 'react'
import {
    View, Text, TouchableOpacity, StyleSheet,
    Button, TextInput, Dimensions,
    SafeAreaView, Image
} from 'react-native';

const AdminSignIn = ({ navigation }) => {
    const [text, setText] = useState('')
    const [pass, setPass] = useState('')
    return (
        <View style={styles.main}>
            <Text style={{
                fontSize: 25,
                fontWeight: 'bold', display: 'flex', alignSelf: 'center', margin: 60,
            }}>  USER{'\n'}<Text style={{ fontSize: 15, textAlign: 'center' }}>    SIGN IN
            </Text>
            </Text>
            <Text style={{ margin: 5 }}>email address</Text>
            <TextInput placeholder='your name or email id'
                style={styles.input} keyboardType='email-address'
                onChangeText={t => setText(t)} value={text} />
            <Text style={{ margin: 5 }}>password</Text>
            <TextInput placeholder='Type our password' keyboardType='default'
                onChangeText={t => setPass(t)} value={pass}
                style={styles.input} />
            <TouchableOpacity>
                <Text style={{ alignSelf: 'flex-end', color: 'blue', margin: 10, marginLeft: 90, }}>forget password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('POB') }} >
                <Text style={{ alignSelf: 'center', color: 'white', margin: 10 }} > Sign in</Text>
            </TouchableOpacity>
            <Text style={{ alignSelf: 'flex-end', margin: 10 }}>
                dont have an account?
            <Text style={{ color: 'blue' }} onPress={() => { navigation.navigate('signup') }} > Sign Up</Text>
            </Text>
            <View style={styles.botomview}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: width - 40 }}>
                    <View style={{ flex: 1, height: 1, width: 500, backgroundColor: 'black' }} />
                    <View>
                        <Text style={{ width: 40, textAlign: 'center' }}>or</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, width: 500, backgroundColor: 'black' }} />
                </View>
                <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                    <TouchableOpacity>
                        <Image style={styles.logo} source={require('../assets/fb_logo.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.logo} source={require('../assets/images.jpg')} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
    logo: {
        width: 40,
        margin: 15,
        height: 40,
        borderRadius: 50,
    },
    botomview: {
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center'
    },
    main: {
        display: 'flex',
        flex: 1,
        height: height - 30,
        paddingLeft: 15,
        paddingRight: 10,
        position: 'absolute',
        width: width ,
        alignContent:'center',
        backgroundColor:'white'
    },
    input: {
        backgroundColor: 'white',
        width: width - 40,
        borderRadius: 5,
        borderWidth:1,
        marginLeft:6,
        height:45,
        borderColor:'#bdbdbd'
    },
    button: {
        backgroundColor: '#2984f2',
        borderRadius: 5,
        width: width - 40,
        alignSelf: 'center'
    }
})
export default AdminSignIn