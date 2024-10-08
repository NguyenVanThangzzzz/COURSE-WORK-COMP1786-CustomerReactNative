import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBMRqXqKFGLK4_5beQRLOyRMlwp6UTjabo",
    authDomain: "course-work-comp1786-f7483.firebaseapp.com",
    databaseURL: "https://course-work-comp1786-f7483-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "course-work-comp1786-f7483",
    storageBucket: "course-work-comp1786-f7483.appspot.com",
    messagingSenderId: "388437554045",
    appId: "1:388437554045:web:6c9a09afdc9e9d0c92d214"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { database, auth };