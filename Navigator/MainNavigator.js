import React from 'react'
import {
    Dimensions, View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Main from '../screens/Dashboard';
import List from '../screens/AffirmationList';
import { styles } from '../styles'
import CreateAffirmation from '../screens/CreateAffirmation'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NotificationSettings from '../screens/NotificationSettings';
import RecordingList from '../screens/RecordingList';
const { width, height } = Dimensions.get('window')

// Record affirmation that saves and you can choose to play that recording on loop?
// Can you do the loop feature ? By loop i mean it keeps on repeating the recording
// over and over again until user requests it to stop

// question: user can add recording on default app affirmation or only can create with new affirmation?
// The loop is not on any affirmation. On home page you will have 4 tabs, Affirmations,
//     Positive Quotes, Affirmation loop recorder and notifications.
// Once you go into the recorder you have option to record new or play previous recordings on loop
// Affirmations are not recorded files, Affirmations are what i sent you 111 affirmations
//Quotes i sent from my Instagram page
//Record is separate
//Recordings will be saved with a name
// What you've sent in the screenshot are affirmation








const TabNavigator = createBottomTabNavigator();


const AffirmationStackNav = createStackNavigator();
const NotificationStack = createStackNavigator();
const RecordStack = createStackNavigator();
const QouteStack = createStackNavigator();

const AffirmationScreenStack = () => {
    return (
        <AffirmationStackNav.Navigator >
            <AffirmationStackNav.Screen
                name="main"
                options={({ }) => {
                    return ({
                        headerStyle: { backgroundColor: 'pink' },
                        headerTitle: 'Home',
                        headerTitleAlign: 'center',
                        headerBackTitleStyle: {
                            fontStyle: 'italic',
                            fontFamily: 'Roboto-Bold'
                        },
                        headerTitleStyle: styles.def_header_style
                    })
                }}
                component={Main}
            />
            <AffirmationStackNav.Screen
                name="qoutelist"
                options={({ route }) => {
                    return ({
                        headerStyle: { backgroundColor: 'pink' },
                        headerTitle: route.params.title,
                        headerTitleAlign: 'center',
                        headerBackTitleStyle: {
                            fontStyle: 'italic',
                            fontFamily: 'Roboto-Bold'
                        },
                        headerTitleStyle: styles.def_header_style
                    })
                }}
                component={List}
            />
        </AffirmationStackNav.Navigator>
    );
};

const Notify = () => {
    return (
        <NotificationStack.Navigator >
            <NotificationStack.Screen
                name="main"
                options={({ route, }) => {
                    return ({
                        headerStyle: { backgroundColor: 'pink' },
                        headerTitle: 'Notifications',
                        headerTitleAlign: 'center',
                        headerBackTitleStyle: {
                            fontStyle: 'italic',
                            fontFamily: 'Roboto-Bold'
                        },
                        headerTitleStyle: styles.def_header_style
                    })
                }}
                component={NotificationSettings}
            />
        </NotificationStack.Navigator>
    );
};


const Record = () => {
    return (
        <RecordStack.Navigator >
            <RecordStack.Screen
                name="main"
                options={({ navigation }) => {
                    return ({
                        headerStyle: { backgroundColor: 'pink' },
                        headerTitle: 'Affirmations',
                        headerTitleAlign: 'center',
                        headerBackTitleStyle: {
                            fontStyle: 'italic',
                            fontFamily: 'Roboto-Bold'
                        },
                        headerTitleStyle: styles.def_header_style,
                        headerRight: () => <FontAwesome5 name='plus'
                            onPress={() => navigation.navigate('affirm_create')}
                            style={{ marginRight: 10, }}
                            size={25} color='white' />
                    })
                }}
                component={RecordingList}
            />
            <RecordStack.Screen
                name="affirm_create"
                options={({ }) => {
                    return ({
                        headerStyle: { backgroundColor: 'pink' },
                        headerTitle: 'Create',
                        headerTitleAlign: 'center',
                        headerBackTitleStyle: {
                            fontStyle: 'italic',
                            fontFamily: 'Roboto-Bold'
                        },
                        headerTitleStyle: styles.def_header_style
                    })
                }}
                component={CreateAffirmation}
            />
        </RecordStack.Navigator>
    )
};


const Qoutes = () => {
    return (
        <QouteStack.Navigator >
            <QouteStack.Screen
                name="main"
                options={({ }) => {
                    return ({
                        headerStyle: { backgroundColor: 'pink' },
                        headerTitle: 'Qoutes',
                        headerTitleAlign: 'center',
                        headerBackTitleStyle: {
                            fontStyle: 'italic',
                            fontFamily: 'Roboto-Bold'
                        },
                        headerTitleStyle: styles.def_header_style
                    })
                }}
                component={List}
            />
        </QouteStack.Navigator>
    );
};



const arr = [{ name: "Home", icon: 'dumpster', stack: AffirmationScreenStack },
{ name: "notifications", icon: 'firstdraft', stack: Notify },
{ name: "Qoutes", icon: 'archive', stack: Qoutes },
{ name: "Affirmations", icon: 'paper-plane', stack: Record }];


const StackTabs = () => {
    return (
        <TabNavigator.Navigator tabBarOptions={{
            activeTintColor: 'pink',
        }}>
            {arr.map((v, i) => <TabNavigator.Screen
                name={v.name}
                key={i}
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