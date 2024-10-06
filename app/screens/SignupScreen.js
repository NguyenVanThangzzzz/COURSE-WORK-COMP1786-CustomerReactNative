import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../firebaseConfig';
import { ref, set } from 'firebase/database';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleSignup = () => {
        if (!validateEmail(email)) {
            Alert.alert('Lỗi', 'Vui lòng nhập một địa chỉ email hợp lệ');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Đăng ký thành công
                const user = userCredential.user;

                // Lưu thông tin người dùng vào Realtime Database
                set(ref(database, 'users/' + user.uid), {
                    email: user.email,
                });

                Alert.alert(
                    'Đăng ký thành công',
                    'Tài khoản của bạn đã được tạo.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            })
            .catch((error) => {
                Alert.alert('Lỗi đăng ký', error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng ký</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
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
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
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
    linkText: {
        marginTop: 15,
        color: '#007AFF',
    },
});