import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, } from '@react-navigation/stack';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import NewsFeed from '../screen/NewsFeed';
import CreatePost from '../screen/CreatePost';
import Comments from '../screen/Comments';
import YoutubeLinksScreen from '../screen/YoutubeLinksScreen';
import MatchHighLights from '../screen/MatchHighLights';
import ChallengeCreateScreen from '../screen/Challenge/ChallengeCreateScreen';
import Challenges from '../screen/Challenge/challenges';
import OpenChallenges from '../screen/Challenge/OpenChallenges';
import AcceptedChallenges from '../screen/Challenge/AcceptedChallenges';
import CompleteChallanges from '../screen/Challenge/CompleteChallanges';
import MyChallengeHistory from '../screen/Challenge/MyChallengeHistory';

const Stack = createStackNavigator();
const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='post' component={CreatePost} options={({ route, navigation }) => ({
                headerShown: false,
                headerTitleAlign: 'center',
            })} />
            <Stack.Screen name='challenge_create' component={ChallengeCreateScreen}
                options={({ route, navigation }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center',
                })} />
            <Stack.Screen name='completed' component={CompleteChallanges}
                options={({ route, navigation }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center',
                })} />
            <Stack.Screen name='challenges' component={Challenges} options={({ route, navigation }) => ({
                headerShown: false,
                headerTitleAlign: 'center',
            })} />
            <Stack.Screen name='history' component={MyChallengeHistory} options={({ route, navigation }) => ({
                headerShown: false,
                headerTitleAlign: 'center',
            })} />
            <Stack.Screen name='accepted' component={AcceptedChallenges} options={({ route, navigation }) => ({
                headerShown: false,
                headerTitleAlign: 'center',
            })} />
            <Stack.Screen name='open-challenges' component={OpenChallenges} options={({ route, navigation }) => ({
                headerShown: false,
                headerTitleAlign: 'center',
            })} />

            <Stack.Screen name='newsfeed' component={NewsFeed} options={({ route, navigation }) => ({
                headerShown: false,
                headerTitleAlign: 'center',
            })} />
            <Stack.Screen name='youtubelinks' component={YoutubeLinksScreen}
                options={({ route, navigation }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center',
                })} />
            <Stack.Screen name='youtubevideo' component={MatchHighLights}
                options={({ route, navigation }) => ({
                    headerShown: false,
                    headerTitleAlign: 'center',
                })} />
            <Stack.Screen name='comments' component={Comments} options={({ route, navigation }) => ({
                headerTintColor: 'purple',
                headerLeft: () => <FontAwesomeIcon style={{ marginLeft: 15 }}
                    size={25} color='purple' name='long-arrow-left'
                    onPress={() => navigation.navigate('newsfeed')} />,
                headerTitleAlign: 'center',
            })} />
        </Stack.Navigator>
    );
}
const App = () => {
    return (
        <NavigationContainer>
            <StackNavigator />
        </NavigationContainer>
    )
}
export default App;


// const DrawerNavigator = () => {
//     const { width, height } = useWindowDimensions();
//     return (
//         <Drawer.Navigator
//             drawerStyle={{
//                 width: width - 100,
//                 paddingTop: 10,
//                 borderTopRightRadius: 20,
//                 borderBottomRightRadius: 20,
//             }}
//             drawerContent={props => (<CustomDrawerContent width={width} height={height} {...props} />)}>
//             <Drawer.Screen name='signin'
//                 options={({ route, navigation }) => ({
//                     drawerLabel: 'Customer list',
//                     drawerIcon: () => <FontAwesomeIcon color='gray'
//                         onPress={() => { navigation.navigate('chatlist') }} size={25} name='users' />
//                 })}
//                 component={StackNavigator} />
//             <Drawer.Screen name='signup' options={({ navigation }) => ({
//                 drawerLabel: 'notifications',
//                 drawerIcon: () => <MaterialIcon color='gray'
//                     onPress={() => { navigation.navigate('chatlist') }} size={27} name='notifications' />
//             })} component={AdminSignIn} />
//             <Drawer.Screen name='chatlists' options={({ route, navigation }) => ({
//                 drawerLabel: 'Chat',
//                 drawerIcon: () => <MaterialIcon color='gray'
//                     onPress={() => { navigation.navigate('chatlist') }} size={25} name='chat' />
//             })} component={AdminSignIn} />
//             <Drawer.Screen name='logout' options={({ route, navigation }) => ({
//                 drawerLabel: 'logout',
//                 drawerIcon: () => <MaterialIcon color='gray'
//                     onPress={() => { navigation.navigate('signup') }} size={25} name='logout' />
//             })} component={AdminSignUp} />
//         </Drawer.Navigator>)
// }