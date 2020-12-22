
import React, { useState, useReducer, useEffect } from 'react'
import { Text, View, TouchableOpacity, Button, TextInput, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Auth = (props) => {
    console.log(' login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const login = async (email, password) => {
        try {
            const res = await AsyncStorage.getItem('userData')
        }
        catch (error) {
            throw error
        }
    }

    const signup = async (email, password) => {
        console.log('signup', email, password)
        try {
            const res = await AsyncStorage.setItem('userData',
                JSON.stringify({
                    email: email,
                    password: password
                }))
            console.log(res)
        }
        catch (error) {
            throw error
        }
    }

    // useEffect(() => {
    //     console.log(isSignUp)
    //     if (isSignUp) {
    //         login
    //     }
    //     signup
    // }, [isSignUp])

    return (<View style={styles.cont}>
        <TextInput onChangeText={text => setEmail(text)}
            style={styles.input} value={email}
            placeholder='email' />
        <TextInput placeholder='password' value={password}
            style={styles.input}
            onChangeText={text => setPassword(text)}
        />
        <Button title={`${isSignUp ? 'login' : 'signup'}`} onPress={() => {
            isSignUp ? login(email, password) : signup(email, password)
        }} />
        <Button title={`switch to ${isSignUp ? 'signup' : 'login'}`} color='orange'
            onPress={() => { setIsSignUp(prevState => !prevState) }} />
    </View>
    )
}

const styles = StyleSheet.create({
    cont: {
        padding: 20
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
})

export default Auth