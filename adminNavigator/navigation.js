import React from 'react';
import { View, TouchableOpacity, Text, Image, useWindowDimensions, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList, DrawerItem, } from '@react-navigation/drawer';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import AdminSignIn from '../screen/AdminSignIn'
import AdminSignUp from '../screen/AdminSignUp';

import ChatListScreen from '../screen/ChatScreen/ChatListScreen';
import UserChatScreen from '../screen/ChatScreen/UserChatscreen';

import CustomText from '../screen/TExt'
import PlaceOfBirth from '../screen/UserScreen/PlaceOfBirth';
import BirthDay from '../screen/UserScreen/Birthday'
import BirthDetails from '../screen/UserScreen/birthDaetils';

import RelationShip from '../assets/relationship.svg'
import Business from '../assets/business.svg'
import GovtJob from '../assets/govt_job.svg'
import Education from '../assets/education.svg'
import Health from '../assets/health.svg'
import Wealth from '../assets/wealth.svg';
import Work from '../assets/work.svg';
import Info from '../assets/info-24px.svg';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='signup' component={AdminSignUp} options={{ headerShown: false }} />
            <Stack.Screen name='signin' component={AdminSignIn} options={{ headerShown: false }} />
            <Stack.Screen name='POB' component={PlaceOfBirth} options={{ headerShown: false, }} />
            <Stack.Screen name='birthday' component={BirthDay} options={{ headerShown: false, }} />
            <Stack.Screen name='birthdetails' component={BirthDetails} options={{
                headerTitleAlign: 'center', headerTitle: 'birth details', headerStyle: {
                    backgroundColor: '#4F6EFF',
                    shadowColor: 'white',
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    height: 60,
                },
                headerTintColor: 'white',
                headerTitleStyle: {
                    color: 'white'
                },
                headerRight: () => (<TouchableOpacity style={{ marginRight: 15 }}>
                    <MaterialIcon name='check' size={25} color='white' />
                </TouchableOpacity>)
            }} />
            <Stack.Screen name='chatlist' component={ChatListScreen}
                options={({ route, navigation }) => ({
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#2984f2',
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        height: 60
                    },
                    title: 'chat list',
                    headerTitleStyle: {
                        color: 'white'
                    },
                    headerLeft: () => (<TouchableOpacity>
                        <FontAwesomeIcon
                            name='align-justify'
                            size={20}
                            style={{ marginLeft: 15 }}
                            color='white'
                            onPress={() => { navigation.openDrawer() }} />
                    </TouchableOpacity>),
                    headerRight: () => (<TouchableOpacity style={{ marginRight: 10 }}>
                        <FontAwesomeIcon name='user-circle' size={30} color='white' />
                    </TouchableOpacity>)
                })} />


            <Stack.Screen name='userchat' component={UserChatScreen}
                options={({ route, navigation }) => ({
                    headerTitleAlign: 'center',
                    headerTitle: route.params.name,
                    headerStyle: {
                        backgroundColor: '#2984f2',
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        height: 60
                    },
                    headerTitleStyle: {
                        color: 'white'
                    },
                    headerLeft: () => (<TouchableOpacity>
                        <FontAwesomeIcon
                            name='align-justify'
                            size={20}
                            style={{ marginLeft: 15, }}
                            color='white'
                            onPress={() => { navigation.openDrawer() }} />
                    </TouchableOpacity>),
                    headerRight: () => (<TouchableOpacity style={{ marginRight: 10 }}>
                        <FontAwesomeIcon name='user-circle' size={30} color='white'
                            onPress={() => { console.log('rightheader') }} />
                    </TouchableOpacity>)
                })} />
        </Stack.Navigator>
    );
}

const CustomDrawerContent = props => {
    return (
        <View style={{ width: props.width - 100 }} {...props}>
            <DrawerItem  {...props}
                label=''
                style={{ position: 'absolute', top: 0, }}
                icon={() => (<View style={{
                    alignSelf: 'center',
                    flexDirection: 'column', justifyContent: 'space-between'
                }}>
                    <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: props.width - 220 }}>
                        <MaterialIcon color='gray' onPress={() => props.navigation.closeDrawer()} size={30} name='close' />
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>MENU</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignContent: 'space-between', marginTop: 20 }}>
                        <Image style={{ width: 55, height: 55, marginRight: 10 }} source={require('../assets/menuprofile.png')} />
                        <Text style={{ fontSize: 20 }}>Admin{'\n'}<Text style={{ fontSize: 12 }}>Smitth</Text></Text>
                    </View>
                </View>)}
            />
            <View style={{ marginTop: 120 }} >
                <DrawerItemList {...props} itemStyle={{ backgroundColor: 'white', width: props.width - 120 }} />
            </View>

        </View>
    )
}



const CustomUserDrawerContent = props => {
    return (
        <View style={{ width: props.width - 100 }} {...props}>
            <DrawerItem  {...props}
                label=''
                style={{ position: 'absolute', top: 0, }}
                icon={() => (<View style={{
                    alignSelf: 'center',
                    flexDirection: 'column', justifyContent: 'space-between'
                }}>
                    <View style={{
                        display: 'flex',
                        justifyContent: 'space-between', flexDirection: 'row', width: props.width - 130
                    }}>
                        <MaterialIcon color='gray' onPress={() => props.navigation.closeDrawer()} size={30} name='close' />
                        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>MENU</Text>
                        <Text style={{ textAlign: 'center', top: 0 }}>
                            <MaterialIcon size={25} color='gray' name='star' />{'\n'} Rate us
                            </Text>
                    </View>
                </View>)}
            />
            <View style={{ flexDirection: 'column', alignContent: 'flex-start', margin: 10, marginTop: 50 }}>
                <CustomText fontSize={15} align='flex-start' margin={3} text='About astrology' />
                <CustomText fontSize={15} align='flex-start' margin={3} text='How astrology works' />
                <CustomText fontSize={15} align='flex-start' margin={3} text='Suggestion for question' />
            </View>
            <View style={{ flexDirection: 'column', width: props.width - 170, }} >
                <RelationShip margin={3} marginLeft={12} />
                <GovtJob margin={3} marginLeft={12} />
                <Business margin={3} marginLeft={12} />
                <Education margin={3} marginLeft={12} />
                <Health margin={3} marginLeft={12} />
                <Wealth margin={3} marginLeft={12} />
                <Work margin={3} marginLeft={12} />
            </View>
            <View style={{ margin: 10 }}>
                <CustomText fontSize={15} align='flex-start' margin={3} text='Terms and conditions' />
                <CustomText fontSize={15} align='flex-start' margin={3} text='customer supprt' />
                <CustomText fontSize={15} align='flex-start' margin={3} text='share with friends' />
            </View>
            <View>
                <TouchableOpacity style={{
                    marginBottom: 2, backgroundColor: '#4e6dfe',
                    height: 35, justifyContent: 'center', width: props.width - 100
                }}>
                    <Text style={{ color: 'white', marginLeft: 10 }}> QuestionPrice:
               <Text>                               {'\u20B9'} 49</Text>
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    backgroundColor: '#223ba0', height: 35,
                    justifyContent: 'center', width: props.width - 100, 
                }}>
                    <Text style={{ color: 'white', marginLeft: 10 }}> full analysis:
                    <Text>                                  {'\u20B9'} 249</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const UserDrawerNavigator = () => {
    const { width, height } = useWindowDimensions();
    return (
        <Drawer.Navigator
            drawerStyle={{
                width: width - 100,
                paddingTop: 10,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
            }}
            drawerContent={props => (<CustomUserDrawerContent width={width} height={height} {...props} />)}>
            <Drawer.Screen name='signin'
                options={({ route, navigation }) => ({
                    drawerLabel: 'Customer list',
                    drawerIcon: () => <FontAwesomeIcon color='gray'
                        onPress={() => { navigation.navigate('chatlist') }} size={25} name='users' />
                })}
                component={StackNavigator} />
            <Drawer.Screen name='signup' options={({ navigation }) => ({
                drawerLabel: 'notifications',
                drawerIcon: () => <MaterialIcon color='gray'
                    onPress={() => { navigation.navigate('chatlist') }} size={27} name='notifications' />
            })} component={AdminSignIn} />
            <Drawer.Screen name='chatlist' options={({ route, navigation }) => ({
                drawerLabel: 'Chat',
                drawerIcon: () => <MaterialIcon color='gray'
                    onPress={() => { navigation.navigate('userchat') }} size={25} name='chat' />
            })} component={AdminSignIn} />

            <Drawer.Screen name='logout' options={({ route, navigation }) => ({
                drawerLabel: 'logout',
                drawerIcon: () => <MaterialIcon color='gray'
                    onPress={() => { navigation.navigate('signin') }} size={25} name='logout' />
            })} component={AdminSignUp} />
        </Drawer.Navigator>)
}

const DrawerNavigator = () => {
    const { width, height } = useWindowDimensions();
    return (
        <Drawer.Navigator
            drawerStyle={{
                width: width - 100,
                paddingTop: 10,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
            }}
            drawerContent={props => (<CustomDrawerContent width={width} height={height} {...props} />)}>
            <Drawer.Screen name='signin'
                options={({ route, navigation }) => ({
                    drawerLabel: 'Customer list',
                    drawerIcon: () => <FontAwesomeIcon color='gray'
                        onPress={() => { navigation.navigate('chatlist') }} size={25} name='users' />
                })}
                component={StackNavigator} />
            <Drawer.Screen name='signup' options={({ navigation }) => ({
                drawerLabel: 'notifications',
                drawerIcon: () => <MaterialIcon color='gray'
                    onPress={() => { navigation.navigate('chatlist') }} size={27} name='notifications' />
            })} component={AdminSignIn} />
            <Drawer.Screen name='chatlists' options={({ route, navigation }) => ({
                drawerLabel: 'Chat',
                drawerIcon: () => <MaterialIcon color='gray'
                    onPress={() => { navigation.navigate('chatlist') }} size={25} name='chat' />
            })} component={AdminSignIn} />
            <Drawer.Screen name='logout' options={({ route, navigation }) => ({
                drawerLabel: 'logout',
                drawerIcon: () => <MaterialIcon color='gray'
                    onPress={() => { navigation.navigate('signup') }} size={25} name='logout' />
            })} component={AdminSignUp} />
        </Drawer.Navigator>)
}

const App = () => {
    return (
        <NavigationContainer>
            <UserDrawerNavigator />
            {/* <DrawerNavigator /> */}
        </NavigationContainer>
    )
}
export default App;