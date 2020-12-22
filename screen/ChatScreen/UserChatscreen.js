import React, { Component } from 'react';
import { LogBox } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { color } from 'react-native-reanimated';
import Backend from './Fire';
// import Chatlistscreen from './ChatscreenList'
export default class Chat extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    messages: []
  }
 
  
//   {
//   "navigation": { "toggleDrawer": [Function anonymous  },
//   "route": { "key": "userchat-CX5W-vUDfLfwR-Czzby8M", "name": "userchat", "params": { "name": "robert" } }
// }

componentDidMount() {
  Backend.loadMessages((message) => {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, message),
      };
    });
  });
}


componentWillUnmount() {
  console.log('closed')
  Backend.closeChat()
}
render() {
  LogBox.ignoreAllLogs = true
  return (
    <GiftedChat
      renderUsernameOnMessage={true}
      
      messages={this.state.messages}
      onSend={(message) => {
        Backend.sendMessage(message);
      }}
      user={{
        _id: Backend.getUid(),
        name: this.props.route.params.name
      }}
    />
  );
}
}


// import React, { useEffect, useState } from 'react'
// import {
//     View, Text, Image, StyleSheet, TextInput, ScrollView, Dimensions,
//     SafeAreaView, useWindowDimensions, ImageBackground, TouchableOpacity
// } from 'react-native';
// // import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// // import MessageBubble from './messageBubble';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import Imageblue from '../../assets/backgroundchat.jpg';
// import Chatboxbottom from '../../assets/chatboxbottom.png';
// import { GiftedChat } from 'react-native-gifted-chat';
// import SendBtn from '../../assets/Send.png';


// const UserChatscreen = ({ navigation }) => {
//     const { height, width } = useWindowDimensions();
//     const [message, setMessage] = useState('')

//     return (
//         <SafeAreaView style={styles.inputview} >
//             <ImageBackground source={Imageblue} style={{ width: width, height: height, opacity: 1 }}>
//                 <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row' }}>
//                     <View style={{
//                         flexDirection: 'row', flex: 1, width: '100%', height: 65, borderTopLeftRadius: 20, borderTopRightRadius: 20,
//                     }} source={Chatboxbottom}  >
//                         <TextInput placeholder='type message..' keyboardType='default'
//                             style={styles.inp} onChangeText={e => setMessage(e)} />
//                         <MaterialIcon name='send' color='#2984f2' onPress={() => { console.log('ore') }}
//                             size={50} style={{
//                                 width: '21%', height: 55,
//                                 flexBasis: '15%', marginTop: 6
//                             }} />
//                         {/* <Image source={SendBtn} style={{ width: '21%', height: 55,
//                              flexBasis: '15%', marginTop: 6 }} /> */}
//                     </View>
//                 </View>
//             </ImageBackground>
//         </SafeAreaView>
//     );
// }

// const { width, height } = Dimensions.get('window')
// const styles = StyleSheet.create({
//     inp: {
//         marginTop: 5,
//         padding: 20,
//         elevation: 1.5,
//         height: 55,
//         borderRadius: 50,
//         width: '84%',
//         fontStyle: 'italic'
//     },
//     inputview: {
//         bottom: 91,
//         height: height,

//         // alignSelf:'center',
//         // alignContent:'center',
//         // justifyContent:'center',
//     }
// })

// export default UserChatscreen