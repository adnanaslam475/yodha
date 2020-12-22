import React from 'react'
import {
    View, Text, StyleSheet, Dimensions, TouchableOpacity
} from 'react-native';
import IconUser from 'react-native-vector-icons/FontAwesome';

const ChatItem = ({ name, navigation }) => {
    return (<TouchableOpacity style={styles.main}
        onPress={() => { navigation.navigate('userchat', { name }) }}>
        <IconUser name='user-circle'
            size={40} color='lightgray'
            style={{ alignSelf: 'center' }}
            onPress={() => { console.log('chal') }} />
        <View style={styles.name}>
            <Text >{name}</Text>
        </View>
    </TouchableOpacity>
    );
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    main: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: 'white',
        width: width - 30,
        marginTop: 10,
        height: 55,
        flexDirection: 'row',
        borderRadius: 25,
        width: width - 50,
        alignSelf: 'center',
    },
    name: {
        width: width - 95,
        borderBottomWidth: 1,
        borderBottomColor: '#c2c2a3',
        marginLeft: 10,
        paddingLeft: 10,
        justifyContent: 'center'
    }
})

export default ChatItem