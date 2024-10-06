import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function UserScreen({ navigation }) {
    const handleLogout = () => {
        signOut(auth).then(() => {
            // Đăng xuất thành công
            navigation.replace('Login');
        }).catch((error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi đăng xuất:', error);
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông tin người dùng</Text>
            <Text style={styles.email}>{auth.currentUser?.email}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Đăng xuất</Text>
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