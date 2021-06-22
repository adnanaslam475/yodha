import React, { useEffect, useRef, useState } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlowerScreen from '../FlowerScreen/CreateFlowerScreen';
import SignIn from '../FlowerScreen/SignIn';
import SignUp from '../FlowerScreen/SignUp';
import Feeds from '../FlowerScreen/Feeds';
import Flower from '../FlowerScreen/Flower';

const DashboardScreenStackNavigator = createStackNavigator();
const DashboardScreenStack = () => {

    return (
        <DashboardScreenStackNavigator.Navigator >
            {/* <DashboardScreenStackNavigator.Screen
                name="signup"
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
                    headerTitleAlign: 'center', headerBackTitleStyle: {
                        fontStyle: 'italic',
                    },
                    headerTitleStyle: {
                        color: 'white',
                        letterSpacing: 3,
                        fontWeight: 'bold'
                    }
                }}
                component={FlowerScreen}
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