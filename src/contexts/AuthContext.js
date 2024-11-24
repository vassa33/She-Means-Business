import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../../firebase.config';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from '@firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from '@firebase/firestore';
import { initializeBusinessProfile } from '../../firestoreSetup';
import { setupInitialTransactions } from '../../firestoreSetup';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

const navigate = (name, params) => {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [businessProfile, setBusinessProfile] = useState(null);
    const [accountCreated, setAccountCreated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                try {
                    // Fetch business profile for the logged-in user
                    const profileRef = doc(db, 'businessProfiles', currentUser.uid);
                    const profileDoc = await getDoc(profileRef);

                    if (profileDoc.exists()) {
                        setBusinessProfile(profileDoc.data());

                    } else {
                        console.warn('Business profile not found for user.');
                        setBusinessProfile(null);
                    }
                } catch (error) {
                    console.error('Error fetching business profile:', error);
                }
            } else {
                setBusinessProfile(null);
                navigate('Login');
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [accountCreated]); // Depend on the accountCreated flag

    const createUser = async ({ email, password, businessName, phone }) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const { user } = userCredential;

            // Initialize the business profile in Firestore
            await initializeBusinessProfile({
                uid: user.uid,
                email,
                businessName,
                phone,
            });

            // Initialize transactions for the user
            await setupInitialTransactions(user.uid);

            setAccountCreated(true); // Set the flag to true
            navigate('Login');
            return user;
        } catch (error) {
            console.error('User creation error:', error);
            const errorMap = {
                'auth/email-already-in-use': 'This email is already registered. Please try logging in instead.',
                'auth/invalid-email': 'The email address is invalid.',
                'auth/weak-password': 'Password should be at least 6 characters long.',
            };
            throw new Error(errorMap[error.code] || error.message);
        }
    };

    const login = async (email, password) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);

            // Verify business profile exists
            const profileRef = doc(db, 'businessProfiles', user.uid);
            const profileDoc = await getDoc(profileRef);
            if (!profileDoc.exists()) {
                throw new Error('Business profile not found. Please contact support.');
            }

            setAccountCreated(false); // Reset the flag
            navigate('Dashboard');
            return user;
        } catch (error) {
            console.error('Login error:', error);
            const errorMap = {
                'auth/user-not-found': 'No account found with this email.',
                'auth/wrong-password': 'Incorrect password.',
                'auth/invalid-email': 'Invalid email format.',
                'auth/user-disabled': 'This account has been disabled.',
                'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            };
            throw new Error(errorMap[error.code] || error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setBusinessProfile(null);
            navigate('Login');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const updateBusinessProfile = async (profileData) => {
        if (!user) throw new Error('No authenticated user');

        try {
            const profileRef = doc(db, 'businessProfiles', user.uid);
            await setDoc(profileRef, {
                ...profileData,
                updatedAt: serverTimestamp()
            }, { merge: true });

            setBusinessProfile(prev => ({
                ...prev,
                ...profileData
            }));
        } catch (error) {
            console.error('Error updating business profile:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        businessProfile,
        createUser,
        login,
        logout,
        updateBusinessProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
