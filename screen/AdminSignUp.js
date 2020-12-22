import React, { useState } from 'react'
import {
    View, Text, TouchableOpacity, StyleSheet, TextInput,
    Dimensions, SafeAreaView, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminSignUp = ({ navigation }) => {
    const { width, height } = Dimensions.get('window')
    console.log(width, height)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    return (
        <View style={styles.main}>
            <TouchableOpacity style={{ marginTop: 15, }} onPress={() => { navigation.navigate('signin') }} >
                <Icon name='arrow-back' size={30} color='black' />
            </TouchableOpacity>
            <Text style={{
                fontSize: 25, textAlign: 'center',
                fontWeight: 'bold', alignSelf: 'center', margin: 60, marginTop: 30,
            }}>Create An Account</Text>
            <Text style={{ margin: 5 }}>email address</Text>
            <TextInput placeholder='your email id'
                style={styles.input} keyboardType='email-address'
                onChangeText={t => setName(t)} value={name} />
            <Text style={{ margin: 5 }}>your name</Text>
            <TextInput placeholder='Type your name' keyboardType='default'
                onChangeText={t => setEmail(t)} value={email}
                style={styles.input} />
            <Text style={{ margin: 5 }}>password</Text>
            <TextInput placeholder='Type our password' keyboardType='default'
                onChangeText={t => setPass(t)} value={pass}
                style={styles.input} />
            <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('POB') }} >
                <Text style={{ alignSelf: 'center', color: 'white', margin: 10 }} > Sign in</Text>
            </TouchableOpacity>
            <Text style={{ alignSelf: 'center', margin: 15 }}>
                have an account?
            <Text style={{ color: 'blue' }} onPress={() => { navigation.navigate('signin') }} > Login</Text>
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