import React from 'react'
import {
    Dimensions, View,
    Text, TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Main from '../screens/Dashboard'
import List from '../screens/AffirmationList';
import { styles } from '../styles'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import CreateAffirmation from '../screens/CreateAffirmation'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createDrawerNavigator, } from '@react-navigation/drawer';
import NotificationSettings from '../screens/NotificationSettings';
const { width, height } = Dimensions.get('window')

// Record affirmation that saves and you can choose to play that recording on loop?
// Can you do the loop feature ? By loop i mean it keeps on repeating the recording
// over and over again until user requests it to stop

// question: user can add recording on default app affirmation or only can create with new affirmation?
// The loop is not on any affirmation. On home page you will have 4 tabs, Affirmations,
//     Positive Quotes, Affirmation loop recorder and notifications.
// Once you go into the recorder you have option to record or play previous recordings on loop


const TabNavigator = createBottomTabNavigator();

// const AffirmationStackNav = createStackNavigator();
// const PQoutesStackNav = createStackNavigator();
// const LoopStackNav = createStackNavigator();
// const NotifificationsStackNav = createStackNavigator();
// const AffirmationScreenStack = () => {
//     return (
//         <AffirmationStackNav.Navigator >
//             <AffirmationStackNav.Screen
//                 name="main"
//                 options={({ route, }) => {
//                     return ({
//                         headerStyle: { backgroundColor: 'pink' },
//                         headerTitle: 'Affirmations',
//                         headerTitleAlign: 'center',
//                         headerBackTitleStyle: {
//                             fontStyle: 'italic',
//                             fontFamily: 'Roboto-Bold'
//                         },
//                         headerTitleStyle: styles.def_header_style
//                     })
//                 }}
//                 component={Main}
//             />
//         </AffirmationStackNav.Navigator>
//     );
// };

const drawer_arr = [{ name: "main", icon: 'home', text: 'Home' },
{ name: "notifications", icon: 'notifications', text: 'Notifications' }]
const AppDrawerNavigator = createDrawerNavigator();

const CustomUserDrawerContent = props => {
    return (
        <View style={styles.draw}>
            <View style={{ marginTop: height * 0.05 }}>
                {drawer_arr.map((v, i) => {
                    return (<TouchableOpacity key={i} onPress={() => {
                        props.navigation.navigate(v.name);
                        props.navigation.closeDrawer()
                    }} style={{
                        ...styles.draweritem,
                        marginTop: i === 4 ? height * 0.15 : 0
                    }}>
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
            drawerStyle={styles.drawerStyle}
            drawerContent={props => { return (<CustomUserDrawerContent {...props} />) }}>
            <AppDrawerNavigator.Screen
                name="home"
                // component={DashboardScreenStack}
                options={{
                    drawerIcon: (props) => (
                        <Ionicons name='home' size={15} color={props.color} />
                    )
                }}
            />
        </AppDrawerNavigator.Navigator>
    )
};



const arr = [{ name: "Home", icon: 'dumpster', stack: Main },
{ name: "notifications", icon: 'firstdraft', stack: NotificationSettings },
{ name: "Positive Qoutes", icon: 'archive', stack: List },
{ name: "Create", icon: 'paper-plane', stack: CreateAffirmation }];

const StackTabs = () => {
    return (
        <TabNavigator.Navigator tabBarOptions={{
            activeTintColor: 'pink',
            // inactiveTintColor: '/'
        }}>
            {arr.map((v, i) => <TabNavigator.Screen
                name={v.name}
                component={v.stack}
                options={{
                    tabBarBadgeStyle: { color: 'red' },

                    tabBarIcon: (props) => (
                        <FontAwesome5 name={v.icon} size={width * 0.06}
                            style={styles.tabicon} />
                    ),
                }}
            />
            )}
        </TabNavigator.Navigator>
    );
}
const TestNavigator = () => {
    return (
        <NavigationContainer>
            <StackTabs />
        </NavigationContainer>
    );
};

export default TestNavigator;