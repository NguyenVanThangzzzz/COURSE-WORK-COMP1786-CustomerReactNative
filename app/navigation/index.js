// navigation/index.js
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import HomeScreen from "../screens/HomeScreen";
import ClassListScreen from "../screens/ClassListScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Courses" }} />
                <Stack.Screen name="ClassList" component={ClassListScreen} options={{ title: "Classes" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}