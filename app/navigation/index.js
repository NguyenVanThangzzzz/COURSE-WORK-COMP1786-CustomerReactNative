// navigation/index.js
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from "react";
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from "../screens/HomeScreen";
import ClassListScreen from "../screens/ClassListScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import UserScreen from "../screens/UserScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'UserTab') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ title: 'Home', headerShown: false }}
            />
            <Tab.Screen
                name="UserTab"
                component={UserScreen}
                options={{ title: 'User', headerShown: false }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                <Stack.Screen name="ClassList" component={ClassListScreen} options={{ title: "Class List" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}