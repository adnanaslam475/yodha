import React, { } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateFlowerScreen from '../FlowerScreen/CreateFlowerScreen';
import SignIn from '../FlowerScreen/SignIn';
import SignUp from '../FlowerScreen/SignUp';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feeds from '../FlowerScreen/Feeds';
import Flower from '../FlowerScreen/Flower';
import Arguments from '../FlowerScreen/Arguments';



const DashboardScreenStackNavigator = createStackNavigator();
const DashboardScreenStack = () => {

    return (
        <DashboardScreenStackNavigator.Navigator >
            {/* <DashboardScreenStackNavigator.Screen
                name='signup'
                options={{ headerShown: false }}
                component={SignUp}
            />
            <DashboardScreenStackNavigator.Screen
                name="signin"
                options={{ headerShown: false }}
                component={SignIn}
            /> */}

            {/* <DashboardScreenStackNavigator.Screen
                name="createflower"
                options={{
                    headerStyle: { backgroundColor: 'pink' },
                    headerTitle: 'Diffusion',
                    headerTitleAlign: 'center',
                    headerBackTitleStyle: {
                        fontStyle: 'italic',
                    },
                    headerTitleStyle: {
                        color: 'white',
                        letterSpacing: 3,
                        fontWeight: 'bold'
                    }
                }}
                component={CreateFlowerScreen}
            /> */}

            <DashboardScreenStackNavigator.Screen
                name="feeds"
                options={{
                    headerStyle: { backgroundColor: 'pink' },
                    headerTitle: 'Feeds',
                    headerTitleAlign: 'center', headerBackTitleStyle: {
                        fontStyle: 'italic',
                    },
                    headerTitleStyle: {
                        color: 'white',
                        letterSpacing: 3,
                        fontWeight: 'bold'
                    }
                }}
                component={Feeds}
            />
            <DashboardScreenStackNavigator.Screen
                name="flower"
                options={({ route, navigation }) => {
                    return ({
                        headerStyle: { backgroundColor: 'pink' },
                        headerTitle: `${route.params.flowerId}`,
                        headerTitleAlign: 'center',
                        headerBackTitleStyle: {
                            fontStyle: 'italic',
                        },
                        headerTitleStyle: {
                            color: 'white',
                            letterSpacing: 3,
                            fontWeight: 'bold'
                        }
                    })
                }}
                component={Flower}
            />


            <DashboardScreenStackNavigator.Screen
                name="arguments"
                options={({ route, navigation }) => {
                    return ({
                        headerStyle: { backgroundColor: 'red' },
                        headerTitle: `Arguments`,
                        headerTitleAlign: 'center',
                        headerBackTitleStyle: {
                            fontStyle: 'italic',
                        },
                        headerTitleStyle: {
                            color: 'white',
                            letterSpacing: 3,
                            fontWeight: 'bold'
                        },
                        headerRight: () => <Ionicons
                            name="add"
                            color="white"
                            size={30}
                            selectionColor='blue'
                            style={{ marginRight: 5 }}
                            onPress={() => navigation.setParams({ open: true })}
                        />
                    })
                }}
                component={Arguments}
            />
        </DashboardScreenStackNavigator.Navigator>
    );
};

const TestNavigator = () => {
    return (
        <NavigationContainer>
            <DashboardScreenStack />
        </NavigationContainer>
    );
};

export default TestNavigator;