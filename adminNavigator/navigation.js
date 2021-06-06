import React from 'react';
import { Platform } from 'react-native';
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { createDrawerNavigator, } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DashBoard from '../screen/DashBoard';
import Profile from '../screen/Profile';
import Notifications from '../screen/Notifications';
import Settings from '../screen/Settings';
const url = 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80';

const TabNavigator = Platform.OS === 'android'
    ? createMaterialBottomTabNavigator()
    : createBottomTabNavigator();

//SCREENS
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dr_profile: {
        width: width * 0.25,
        height: height * 0.15,
        borderRadius: 100,
        borderColor: 'blue',
        borderWidth: 5,
    },
    drawerimg: {
        display: 'flex', flexDirection: 'column',
        width: width - 130,
        padding: 5,
        paddingTop: height * 0.05,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center', position: 'relative',
    },
    img: {
        width: width * 0.25,
        height: height * 0.15,
        borderRadius: 100,
        borderColor: 'blue',
        borderWidth: 5,
    }, draweritem: {
        marginBottom: 2,
        backgroundColor: 'blue',
        display: 'flex',
        flexDirection: 'row',
        height: height * 0.07,
        alignItems: 'center',
        width: width - 120,
        paddingLeft: 5,
    },
    icon: {
        position: 'absolute',
        top: 10, right: 0
    },
    drawerStyle: {
        backgroundColor: 'yellow',
        borderTopRightRadius: 20,
        borderBottomEndRadius: 20,
        borderWidth: 5,
        width: width / 1.5,
    }
});

const defaultStackNavOptions = {
    headerTitleAlign: 'center',
    headerTintColor: 'white',
    headerStyle: {
        backgroundColor: 'blue',
    },
};

const defaultScreenOptions = (navData) => {
    return {
        headerLeft: () => {
            return (
                <TouchableOpacity
                    style={{ marginLeft: 10, }}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}><MaterialIcon name='menu'
                        size={25} color='white' />
                </TouchableOpacity>
            );
        },
        headerRight: () => {
            return (
                <TouchableOpacity
                    style={{ marginRight: 10, }}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}><MaterialIcon name='search'
                        size={25} color='white' />
                </TouchableOpacity>
            );
        },
    };
};

const DashboardScreenStackNavigator = createStackNavigator();
const DashboardScreenStack = () => {
    return (
        <DashboardScreenStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
            <DashboardScreenStackNavigator.Screen
                name="dashboard"
                component={DashBoard}
                options={defaultScreenOptions}
            />
        </DashboardScreenStackNavigator.Navigator>
    );
};

const NotificationsScreenStackNavigator = createStackNavigator();
const NotificationsScreenStack = () => {
    return (
        <NotificationsScreenStackNavigator.Navigator screenOptions={defaultStackNavOptions}>
            <NotificationsScreenStackNavigator.Screen
                name="Notifications"
                component={Notifications}
                options={defaultScreenOptions}
            />
        </NotificationsScreenStackNavigator.Navigator>
    );
};

const SettingsScreenStackNavigator = createStackNavigator();
const SettingsScreenStack = () => {
    return (
        <SettingsScreenStackNavigator.Navigator
            screenOptions={defaultStackNavOptions}>
            <SettingsScreenStackNavigator.Screen
                name="Settings"
                component={Settings}
                options={defaultScreenOptions}
            />
        </SettingsScreenStackNavigator.Navigator>
    );
};

const ProfileScreenNavigator = createStackNavigator();
const ProfileScreenStack = () => {
    return (
        <ProfileScreenNavigator.Navigator screenOptions={defaultStackNavOptions}>
            <ProfileScreenNavigator.Screen
                name='Profile'
                component={Profile}
                options={defaultScreenOptions}
            />
        </ProfileScreenNavigator.Navigator>
    );
};



const arr = [{ name: "Home", icon: 'home', stack: DashboardScreenStack },
{ name: "Notifications", icon: 'notifications', stack: NotificationsScreenStack },
{ name: "Settings", icon: 'settings-sharp', stack: SettingsScreenStack },
{ name: "Profile", icon: 'person', stack: ProfileScreenStack },
]


const BottomTabs = () => {
    return (
        < TabNavigator.Navigator
            barStyle={{ backgroundColor: 'blue' }}
            activeColor="white">
            {arr.map((v, i) => <TabNavigator.Screen
                name={v.name}
                key={i}
                component={v.stack}
                options={{
                    tabBarIcon: (props) => (
                        <Ionicons name={v.icon} size={20} color={props.color} />
                    ),
                }}
            />
            )}
        </TabNavigator.Navigator>
    );
}

const drawer_arr = [{ name: "dashboard", icon: 'home', text: 'Home' },
{ name: "Notifications", icon: 'notifications', text: 'Notifications' },
{ name: "Settings", icon: 'settings', text: 'Settings' },
{ name: "Profile", icon: 'person', text: 'Person' },
]
const AppDrawerNavigator = createDrawerNavigator();

const CustomUserDrawerContent = props => {
    return (
        <View style={{
            width: width / 1.5,
            height: height,
            backgroundColor: 'red',
            borderTopRightRadius: 10,
            borderBottomEndRadius: 50,
            position: 'relative'
        }}>
            <View style={styles.drawerimg}>
                <MaterialIcon size={30} color='blue' style={styles.icon} name='settings' />
                <Image style={styles.dr_profile}
                    source={{ uri: url }} />
                <Text style={{ fontWeight: 'bold', }}>Alex abramahov</Text>
                <Text >player</Text>
            </View>
            <View style={{ marginTop: height * 0.05 }}>
                {drawer_arr.map((v, i) => {
                    return (<TouchableOpacity key={i} onPress={() => {
                        props.navigation.navigate(v.name);
                        props.navigation.closeDrawer()
                    }} style={styles.draweritem}>
                        <MaterialIcon color='white' size={30}
                            name={v.icon} /><Text style={{
                                color: 'white',
                                marginLeft: 10, fontWeight: 'bold'
                            }}>{v.text}</Text>
                    </TouchableOpacity>)
                })}
            </View>
        </View >
    )
}

const DrawerNavigator = prop => {
    return (
        <AppDrawerNavigator.Navigator drawerType="slide" 
            // openByDefault
            // sceneContainerStyle={{backgroundColor:'orange',width:width/1.4}}
            drawerStyle={styles.drawerStyle}
            drawerContent={props => { return (<CustomUserDrawerContent {...props} />) }}>
            <AppDrawerNavigator.Screen
                name="home"
                component={BottomTabs}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons name='home' size={15} color={props.color} />
                    ),
                }}
            />
        </AppDrawerNavigator.Navigator>
    );
};

const TestNavigator = () => {
    return (
        <NavigationContainer>
            <DrawerNavigator />
        </NavigationContainer>
    );
};
export default TestNavigator;

