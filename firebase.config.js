// firebase.config.js
import { initializeApp } from '@firebase/app';
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUHcFydBywrXsu2EMhUxClzNMZkIuNTS4",
    authDomain: "smb-financial-manager.firebaseapp.com",
    projectId: "smb-financial-manager",
    storageBucket: "smb-financial-manager.firebasestorage.app",
    messagingSenderId: "1001948503019",
    appId: "1:1001948503019:android:bea55c316f5847f43cd7ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };