import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { app } from '../firebaseconfig';
import Dialog from "react-native-dialog";
// import ReactNativeZoomableView from 
// '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';




const Flower = ({ navigation, route }) => {
    const [res, setres] = useState({});
    const [loading, setloading] = useState(true);
    const [show, setshow] = useState({})

    useEffect(() => {
        app.database().ref(`flowers/${route.params.flowerId}`).get()
            .then(res => {
                setres(res.toJSON())
                setloading(false)
            }).catch(e => {
                Alert.alert(
                    "Network Error!",
                    'Try Again',
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                )
                setloading(false)
            })
    }, [])



    return (
        <View style={{
            paddingTop: 20, width: width, height: height
        }}>
            <Dialog.Container visible={show.show}>
                <Dialog.Title children='ssssss'>{show.name}</Dialog.Title>
                <Dialog.Description style={{ borderColor: 'black' }} >
                    <Dialog.Input style={{
                        width: width * 0.5,
                    }} onChangeText={t => ''} />
                </Dialog.Description>
                <Dialog.Button label='ok' onPress={() => setshow({})} />
            </Dialog.Container>
            {loading ? <ActivityIndicator color='red' size='large'
                style={{ marginTop: height / 3 }} /> : <View>
                <TouchableOpacity style={{
                    ...styles.main,
                    marginTop: height / 3
                }}>
                    <Text>{res.topicobj.topic}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    ...styles.main,
                    backgroundColor: 'lightblue',
                    marginTop: height / 10
                }} onPress={() => navigation.navigate('arguments', { id: res.counterIdeaobj.id })} >
                    <Text>{res.counterIdeaobj?.counterIdea}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    ...styles.main,
                    backgroundColor: 'red',
                    top: height / 1.9
                }} onPress={() => navigation.navigate('arguments', { id: res.ideaobj.id })} >
                    <Text>{res.ideaobj?.idea}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    ...styles.main,
                    backgroundColor: 'lightblue',
                    marginTop: height / 10,
                }} onPress={() => navigation.navigate('arguments', { id: res.judgementobj.id })} >
                    <Text>{res.judgementobj?.judgement}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    ...styles.main,
                    backgroundColor: 'orange',
                    right: height * 0.02,
                    bottom: height * 0.5
                }} onPress={() => navigation.navigate('arguments', { id: res.alternativeobj.id })} >
                    <Text>{res.alternativeobj?.alternative}</Text>
                </TouchableOpacity>
            </View>}
        </View>
    )
}


const { height, width } = Dimensions.get('window')
const styles = StyleSheet.create({
    main: {
        borderRadius: width * 0.3,
        height: height * 0.16,
        width: width * 0.27,
        backgroundColor: 'pink',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute'
    }
})

export default Flower;