import React, { useEffect, useRef, useState } from 'react'
import {
    View, Text, StyleSheet, BackHandler, FlatList,
    Dimensions, Image, ScrollView, TouchableOpacity, ToastAndroid
} from 'react-native';
import * as dummydata from './dummydata'
import Carousel from 'react-native-snap-carousel';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FloatingVideo from 'rn-floating-video-widget'


const { height, width } = Dimensions.get('window');
const url = 'https://c.files.bbci.co.uk/13729/production/_112375697_1331db7a-17c0-4401-8cac-6a2309ff49b6.jpg';

const _renderItem = ({ item, index }) => {
    return (
        <TouchableOpacity style={{
            ...styles.slide, backgroundColor: index === 0 && 'red' ||
                index === 1 && 'yellow' || index === 2 && 'blue' ||
                index === 3 && 'orange' || index === 4 && 'brown',
            position: 'relative'
        }}>
            <Text style={{ fontSize: 20, color: 'white' }}>{item.text}</Text>
            <Text style={{
                color: 'white',
                fontSize: 20,
                display: 'flex', position: 'absolute',
                bottom: 0, right: 10, flexDirection: 'column-reverse'
            }}>{item.title}</Text>
        </TouchableOpacity>
    )
}


const DashBoard = ({ navigation }) => {
    const carouselref = useRef(null);
    const [select, setSelect] = useState('');
    const [floating, setFloating] = useState(false)
    const [granted, setgranted] = useState(false);

    const data = {
        video: {
            url: select
        },
        seek: 10,
        index: 0
    };


    const enterPipMode = () => {
        FloatingVideo.requestOverlayPermission()
            .then(() => {
                setFloating(true);
                setgranted(true);
                FloatingVideo.open(data);
            })
            .catch(e => {
                ToastAndroid.show(
                    "Please grant draw over other apps permission" + JSON.stringify(e),
                    800
                );
            });
    }

    useEffect(() => {
        return () => {
            console.log('unmount')
            FloatingVideo.removeAllListeners();
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
        }
    }, [])

    const handleBackButtonClick = () => {
        BackHandler.exitApp();
        return true;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.main} contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Upcoming Activities</Text>
                {dummydata.cards.map((v, i) => i < 2 && (<TouchableOpacity style={styles.cards}
                    onPress={() => navigation.navigate('')} key={i}>
                    <Image source={{ uri: v.img }} style={styles.img} />
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text>{v.type}</Text>
                        <Text>{v.text}</Text>
                    </View>
                    <Text style={{
                        position: 'absolute',
                        right: 0, bottom: 0
                    }}>{v.time}</Text>
                </TouchableOpacity>))}
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 20
                }}>Team Stats</Text>
                <View style={{
                    height: height * 0.16
                }}>
                    <Carousel
                        ref={carouselref}
                        data={dummydata.carouselItems}
                        renderItem={_renderItem}
                        sliderWidth={width * 0.9}
                        layout='default'
                        layoutCardOffset={4}
                        itemWidth={width * 0.45}
                        onSnapToItem={i => setSelect(i)}
                    />
                </View>
                <View style={{ display: 'flex', borderWidth: 1 }} >
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Team Gallery</Text>
                    <MaterialIcon name="arrow-right-alt" size={30} color='blue' />
                </View>
                <View style={{
                    width: width - 20,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                    {dummydata.allvideos.map((v, i) => <TouchableOpacity key={i}
                        style={{
                            width: width
                        }} onPress={() => {
                            setSelect(v.url);
                            enterPipMode()
                        }}>
                        < Image source={{ uri: v.img }}
                            style={{
                                width: width * 0.35,
                                height: 100,
                                borderRadius: 10,
                            }} />
                    </TouchableOpacity>)}
                </View>
            </ScrollView >
        </View>
    )
}

// play-arrow
const styles = StyleSheet.create({
    main: {
        flex: 1,
        height: height,
        paddingLeft: 15,
        paddingRight: 10,
        width: width,
        alignContent: 'center',
        backgroundColor: '#ccffff',
    },
    cards: {
        display: 'flex',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        margin: 3,
        alignItems: 'center',
        position: 'relative', flexDirection: 'row'
    },
    img: {
        width: width * 0.15,
        height: height * 0.1,
        borderRadius: 10,
        margin: 5,
    },
    touch: {
        borderWidth: 1,
        flexBasis: 50,
        display: 'flex',
        borderWidth: 2,
        borderColor: 'blue'
    },
    slide: {
        backgroundColor: 'orange',
        borderRadius: 15,
        width: width * 0.4,
        height: height * 0.14,
        padding: 7,
    },
})
export default DashBoard;