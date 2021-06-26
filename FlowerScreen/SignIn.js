import React, { useState, useEffect } from 'react'
import {
    View, Text, TouchableOpacity, StyleSheet,
    Button, TextInput, Dimensions, ActivityIndicator,
} from 'react-native';
import { app } from '../firebaseconfig';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminSignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsloading] = useState(false)


    useEffect(() => {
        if (AsyncStorage.getItem('auth') === null) {

        }
        else {
            // navigation.navigate('flower')
        }
    }, [])

    const send = async () => {
        setIsloading(true)
        try {
            const auth = await app.auth().signInWithEmailAndPassword(email, pass)
            await AsyncStorage.setItem('auth', auth.user.email);
            setIsloading(false);

            // navigation.navigate('createflower');
            navigation.reset({
                index: 0,
                routes: [{ name: 'createflower' }],
            });
        }
        catch (error) {
            console.log('err==>', error)
            setError(error.toString().split(':')[1]);
            setIsloading(false)
        }
    }


    return (
        <View style={styles.main}>
            <TouchableOpacity style={{ marginTop: 15, }} onPress={() => navigation.navigate('signup')} >
                <Icon name='arrow-back' size={30} color='black' />
            </TouchableOpacity>
            <Text style={{
                fontSize: 25,
                fontWeight: 'bold', display: 'flex', alignSelf: 'center', margin: 60,
            }}>  USER{'\n'}<Text style={{ fontSize: 15, textAlign: 'center' }}>    SIGN IN
                </Text>
            </Text>
            <Text style={{ margin: 5 }}>email address</Text>
            <TextInput placeholder='your name or email id'
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
            <Text style={{ alignSelf: 'flex-end', margin: 10 }}>
                dont have an account?
                <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('signin')} > Sign Up</Text>
            </Text>
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
        width: width,
        alignContent: 'center',
        backgroundColor: 'white'
    },
    input: {
        backgroundColor: 'white',
        width: width - 40,
        borderRadius: 5,
        borderWidth: 1,
        marginLeft: 6,
        height: 45,
        borderColor: '#bdbdbd'
    },
    button: {
        backgroundColor: '#2984f2',
        borderRadius: 5,
        marginTop: 20,
        width: width - 40,
        alignSelf: 'center'
    }
})
export default AdminSignIn