import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import { app } from '../firebaseconfig';


const Feeds = ({ navigation }) => {
    const [arr, setArr] = useState([]);
    const [loading, setloading] = useState(true)
    const [flowerIds, setFlowerIds] = useState(null);


    useEffect(() => {
        const push = []
        let id = []
        app.database().ref('flowers').get().then(res => {
            id = Object.keys(res.toJSON())
            res.forEach(el => {
                push.push(el.toJSON())
            })
            setFlowerIds(id)
            setArr(push);
            setloading(false)
        }).catch(e => {
            console.log(e);
            setloading(false)
        })
    }, [])



    return (
        <ScrollView style={{}}>
            {loading ? <ActivityIndicator color='red' size='large'
                style={{ marginTop: height / 2.5 }} /> : <View>{arr.length == 0 ? <Text style={{
                    marginTop: height / 2.7,
                    display: 'flex', alignSelf: 'center'
                }}>No Feeds yet</Text> :
                    arr?.map((v, i) => {
                        const id = flowerIds.filter((v, idx) => idx === i)
                        return <TouchableOpacity key={id[0]}
                            style={{
                                padding: 10,
                                alignSelf: 'center', backgroundColor: 'lightgray',
                                width: width * 0.9, borderRadius: 10, margin: 5,
                            }} onPress={() => navigation.navigate('flower', {
                                flowerId: id[0],
                                completed: true,
                            })}>
                            <Text style={{
                                fontStyle: 'italic',
                                marginLeft: 10
                            }}>{v.topicobj.topic}</Text>
                        </TouchableOpacity>
                    })}</View>}
        </ScrollView>
    )
}
const { height, width } = Dimensions.get('window');
export default Feeds;
