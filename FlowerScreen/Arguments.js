import { array } from 'prop-types';
import React, { useEffect, useState } from 'react'
import {
    View, TouchableHighlight, TouchableOpacity,
    StyleSheet, Text,
    ActivityIndicator, ScrollView, Dimensions, Alert
} from 'react-native'
import Dialog from "react-native-dialog";
import { app } from '../firebaseconfig'

const Arguments = ({ navigation, route }) => {
    const [loading, setloading] = useState(false)
    const [open, setopen] = useState(false)
    const [text, setText] = useState('');
    const [argumentsarr, setarguments] = useState([])

    useEffect(() => {
        route.params.open == true && setopen(true)
    }, [route.params])

    useEffect(() => {
        app.database().ref('arguments').orderByChild('id')
            .equalTo(`${route.params?.id}`)
            .get().then(res => {
                const arr = [];
                res.forEach(el => {
                    arr.push(el.toJSON())
                })
                setarguments(arr)
            }).catch(e => {
                // console.log(e)
            })
    }, [])


    const send = async () => {
        try {
            const res = app.database().ref('arguments').push({
                id: route.params.id,
                text
            })
            console.log(res.toJSON())
            setopen(false)
        } catch (error) {
            Alert.alert(
                "Network Error!",
                'Try Again',
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            )
            setopen(false)
        }
    }

    return (
        <View>
            <Dialog.Container visible={open}>
                <Dialog.Title children='ssssss'>Add Argument</Dialog.Title>
                <Dialog.Description style={{ borderColor: 'black' }} >
                    <Dialog.Input style={{
                        width: width * 0.5,
                    }} onChangeText={t => setText(t)} />
                </Dialog.Description>
                <Dialog.Button label='ADD' onPress={send} />
            </Dialog.Container>
            {loading ? <ActivityIndicator color='red' size='large'
                style={{ marginTop: height / 2.5 }} /> : <View >{argumentsarr.length == 0 ? <Text style={{
                    alignSelf: 'center', display: 'flex',
                    marginTop: height / 2.5
                }}>No arguments yet To show</Text> :
                    arguments.map((v, i) => {
                        return <TouchableOpacity key={i} onPress={() => navigation.navigate('')}>
                            <Text>{v.text.toFixed(144)}...<Text>{show === '' ? 'show more' : 'show less'}</Text>
                            </Text>
                        </TouchableOpacity>
                    })}
            </View>}
        </View>
    )
}

const { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({

})
export default Arguments;