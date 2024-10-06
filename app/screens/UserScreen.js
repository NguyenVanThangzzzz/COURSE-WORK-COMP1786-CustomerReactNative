import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function UserScreen({ navigation }) {
    const handleLogout = () => {
        signOut(auth).then(() => {
            navigation.replace('Login');
        }).catch((error) => {
            console.error('Logout error:', error);
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Information</Text>
            <Text style={styles.email}>{auth.currentUser?.email}</Text>
            <Text style={styles.userId}>User ID: {auth.currentUser?.uid}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    email: {
        fontSize: 18,
        marginBottom: 30,
    },
    userId: {
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});