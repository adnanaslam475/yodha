import React, { useEffect } from 'react';

import {
    TouchableOpacity, StyleSheet, FlatList,
    SafeAreaView, ScrollView, Text
} from 'react-native';
import YoutubePlayer from "react-native-youtube-iframe";
const YoutubeLinksScreen = ({ navigation }) => {
    const urls = ['04rEXNJhCSM', 'VWCmUQ4vSm0', 'oPVte6aMprI'];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <FlatList
                contentContainerStyle={{ margin: 5 }}
                data={urls}
                renderItem={({ item }) => (<TouchableOpacity
                    onPress={() => navigation.navigate('youtubevideo', { videoId: item })}>
                    <YoutubePlayer play={false} height={220} videoId={item} />
                </TouchableOpacity>
                )}
                keyExtractor={item => item}
            />

            {/* {urls.map((v, i) => {
                return (<TouchableOpacity key={i} style={styles.player}
                    // onPress={() => navigation.navigate('youtubevideo', { videoId: v })}
                >
                    <YoutubePlayer play={false} height={250} videoId={v} />
                </TouchableOpacity>)
            })} */}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    player: {

    }
})
export default YoutubeLinksScreen
