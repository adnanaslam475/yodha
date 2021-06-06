import React, { useRef, useState } from 'react'
import {
    View, Text, StyleSheet, TextInput,
    Dimensions, Image
} from 'react-native';
import * as dummydata from './dummydata'
import Carousel from 'react-native-snap-carousel';
const { height, width } = Dimensions.get('window');
const url = 'https://c.files.bbci.co.uk/13729/production/_112375697_1331db7a-17c0-4401-8cac-6a2309ff49b6.jpg';

const _renderItem = ({ item, index }) => {

    return (
        <View style={styles.slide}>
            <Text style={{ fontSize: 30 }}>{item.title}</Text>
            <Image style={{ width: 100, height: 100 }}
                source={{ uri: url }} />
        </View>
    )
}


const DashBoard = ({ navigation }) => {
    const [select, setSelect] = useState(0)
    const carouselref = useRef(null);
    return (
        <View style={styles.main}>
            <View style={{
                borderWidth: 2, height: height / 7,
                display: 'flex', flexDirection: 'column-reverse',
                backgroundColor: 'transparent'
            }}>
                <Carousel
                    ref={carouselref}
                    data={dummydata.carouselItems}
                    renderItem={_renderItem}
                    sliderWidth={width * 0.7}
                    sliderHeight={height * 0.3}
                    itemWidth={width * 0.2}
                    onSnapToItem={i=>setSelect(i)}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({

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

    slide: {
        backgroundColor: 'blue',
        borderRadius: 5,
        height: height * 0.2,
        padding: 50,
        marginLeft: 25,
        marginRight: 25
    },

})
export default DashBoard;