
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput,
    Dimensions, SafeAreaView, FlatList, ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatItem from './ChatItem';
import { data } from './dummydata';

const ChatListscreen = ({ navigation }) => {
    const [username, setUserNAme] = useState('')
    return (<View style={styles.main}>
        <View style={styles.searchSection}>
            <Icon style={styles.searchIcon} name="search" size={30} color='gray' />
            <TextInput
                style={styles.input}
                placeholder='Search by Nickname...'
                onChangeText={e => setUserNAme(e)}
                value={username}
                maxLength={30}
                keyboardType='default'
            />
        </View>
        <SafeAreaView style={{ backgroundColor: 'white' }}>
            <FlatList data={data} keyExtractor={d => d.id}
                renderItem={itemdata => (<ChatItem
                    name={itemdata.item.name}
                    navigation={navigation}
                />)} />
        </SafeAreaView>
    </View>
    );
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    main: {
        backgroundColor: 'white',
    },
    searchSection: {
        marginTop: 10,
        height: 60,
        flexDirection: 'row',
        borderRadius: 25,
        width: width - 50,
        alignSelf: 'center',
        textAlign: 'center',
        elevation: 3.5,
    },
    searchIcon: {
        padding: 15,
    },
    input: {
        width: width - 80,
        height: 50,
        marginTop: 5,
        marginLeft: width - 370,
        borderRadius: 25,
        fontStyle: 'italic',
    },
})

export default ChatListscreen