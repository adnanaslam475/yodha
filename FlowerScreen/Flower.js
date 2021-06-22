import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { app } from '../firebaseconfig'
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';




const Flower = ({ navigation, route }) => {
    const [res, setres] = useState({});

    useEffect(() => {
        app.database().ref(`flowers/${route.params.flowerId}`).get()
            .then(res => {
                setres(res.toJSON())
                console.log(res.toJSON())
            }).catch(e => {
                console.log(e);
            })
    }, [])


    const Zoom = ({ counterIdea, topic, judgement, alternative,press }) => {
        return <ReactNativeZoomableView
            maxZoom={1.9}
            minZoom={1}
            zoomStep={0.9}
            initialZoom={1}
            bindToBorders={true}
            style={{
                ...styles.main,
                backgroundColor: 'lightblue',
                marginTop: height / 10
            }} >
            <TouchableOpacity onPress={press}>
                <Text>{counterIdea || topic || judgement || alternative}</Text>
            </TouchableOpacity>
        </ReactNativeZoomableView>
    }

    return (
        <View style={{
            paddingTop: 20, width: width,
            height: height
        }}>
            <TouchableOpacity style={{
                ...styles.main,
                marginTop: height / 3
            }}>
                <Text>{res.topic}</Text>
            </TouchableOpacity>
            <ReactNativeZoomableView
                maxZoom={1.9}
                minZoom={1}
                zoomStep={0.9}
                initialZoom={1}
                bindToBorders={true}
                style={{
                    ...styles.main,
                    backgroundColor: 'lightblue',
                    marginTop: height / 10
                }} >
                <TouchableOpacity>
                    <Text>{res.counterIdea}</Text>
                </TouchableOpacity>
            </ReactNativeZoomableView>
            <ReactNativeZoomableView
                maxZoom={1.9}
                minZoom={1}
                zoomStep={0.9}
                initialZoom={1}
                bindToBorders={true}
                style={{
                    ...styles.main, backgroundColor: 'orange',
                    right: height * 0.02,
                    top: height * 0.28
                }}>
                <TouchableOpacity>
                    <Text>{res.judgement}</Text>
                </TouchableOpacity>
            </ReactNativeZoomableView>
            <ReactNativeZoomableView
                maxZoom={1.9}
                minZoom={1}
                zoomStep={0.9}
                initialZoom={1}
                bindToBorders={true}
                style={{
                    ...styles.main, backgroundColor: 'blue',
                    // left: height * 0.02,
                    // top: height * 0.28
                }}>
                <TouchableOpacity>
                    <Text>{res.alternative}</Text>
                </TouchableOpacity>
            </ReactNativeZoomableView>
            <ReactNativeZoomableView
                maxZoom={1.9}
                minZoom={1}
                zoomStep={0.9}
                initialZoom={1}
                bindToBorders={true}
                style={{
                    ...styles.main, backgroundColor: 'purple',
                    // left: height * 0.02,
                    // top: height * 0.28
                }}>
                <TouchableOpacity>
                    <Text>{res.alternative}</Text>
                </TouchableOpacity>
            </ReactNativeZoomableView>
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
export default Flower
