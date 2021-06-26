import React, { useState } from 'react'
import {
    View, Text, TouchableOpacity, StyleSheet, TextInput,
    Dimensions, SafeAreaView, ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { app } from '../firebaseconfig';
import AsyncStorage from "@react-native-async-storage/async-storage";


const AdminSignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsloading] = useState(false);
    const [pass, setPass] = useState('');


    const send = async () => {
        try {
            setIsloading(true)
            const auth = await app.auth().createUserWithEmailAndPassword(email, pass)
            await AsyncStorage.setItem('auth', auth.user.email);
            setIsloading(false);
            navigation.navigate('createflower');
        }
        catch (error) {
            console.log(error)
            setError(error.toString().split(':')[1]);
            setIsloading(false)
        }
    }

    return (
        <View style={styles.main}>
            <TouchableOpacity style={{ marginTop: 15, }} onPress={() => navigation.navigate('signin')} >
                <Icon name='arrow-back' size={30} color='black' />
            </TouchableOpacity>
            <Text style={{
                fontSize: 25, textAlign: 'center',
                fontWeight: 'bold', alignSelf: 'center',
                margin: 60, marginTop: 30,
            }}>Create An Account</Text>
            <Text style={{ margin: 5 }}>email address</Text>
            <TextInput placeholder='your email id'
                style={styles.input} keyboardType='email-address'
                onChangeText={t => setEmail(t)} value={email} />
            <Text style={{ margin: 5 }}>password</Text>
            <TextInput placeholder='Type our password' keyboardType='default'
                onChangeText={t => setPass(t)} value={pass}
                style={styles.input} />
            {error ? <Text style={{ color: 'red', marginTop: 5 }}>{error}</Text> : null}
            {isLoading ? <ActivityIndicator color='blue' style={{ marginTop: 5 }} size='large' /> :
                <TouchableOpacity style={styles.button} onPress={send} >
                    <Text style={{ alignSelf: 'center', color: 'white', margin: 10 }} > Sign in</Text>
                </TouchableOpacity>}
            <Text style={{ alignSelf: 'center', margin: 15 }}>
                have an account?
                <Text style={{ color: 'blue' }} onPress={() => {
                    navigation.navigate('signin')
                }} > Login</Text>
            </Text>
        </View>
    )
}


const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
    botomview: {
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center'
    },
    main: {
        display: 'flex',
        flex: 1,
        height: height,
        paddingLeft: 15,
        paddingRight: 10,
        width: width,
        alignContent: 'center',
        backgroundColor: 'white',
    },
    input: {
        backgroundColor: 'white',
        width: width - 40,
        borderRadius: 5,
        height: 45,
        borderColor: '#bdbdbd',
        borderWidth: 1,
    },
    button: {
        backgroundColor: '#2984f2',
        borderRadius: 5,
        width: width - 40,
        marginTop: 13,
    }
})
export default AdminSignUp