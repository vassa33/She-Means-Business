import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useUI } from './UIContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [state, setState] = useState({
        transactions: [],
        budgets: [],
        savingsGoals: [],
        tasks: [],
        isLoading: true,
        error: null
    });

    const { user } = useAuth();
    const { setIsLoading } = useUI();

    // Helper function to create collection references
    const getCollectionRef = useCallback((collectionName) => {
        return collection(db, collectionName);
    }, []);

    // Setup real-time listeners for collections
    useEffect(() => {
        if (!user) {
            setState(prev => ({
                ...prev,
                transactions: [],
                budgets: [],
                savingsGoals: [],
                tasks: [],
                isLoading: false
            }));
            return;
        }

        setIsLoading(true);

        // Create queries for each collection
        const queries = {
            transactions: query(
                getCollectionRef('transactions'),
                where('userId', '==', user.uid)
            ),
            budgets: query(
                getCollectionRef('budgets'),
                where('userId', '==', user.uid)
            ),
            savingsGoals: query(
                getCollectionRef('savingsGoals'),
                where('userId', '==', user.uid)
            ),
            tasks: query(
                getCollectionRef('tasks'),
                where('userId', '==', user.uid)
            )
        };

        // Setup listeners for each collection
        const unsubscribers = Object.entries(queries).map(([key, query]) =>
            onSnapshot(
                query,
                (snapshot) => {
                    try {
                        const data = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        setState(prev => ({
                            ...prev,
                            [key]: data,
                            isLoading: false
                        }));
                    } catch (error) {
                        console.error(`Error processing ${key} snapshot:`, error);
                    }
                },
                (error) => {
                    console.error(`Error in ${key} listener:`, error);
                    setState(prev => ({
                        ...prev,
                        error: error.message,
                        isLoading: false
                    }));
                }
            ));

        // Cleanup listeners on unmount or user change
        return () => unsubscribers.forEach(unsubscribe => unsubscribe());
    }, [user, getCollectionRef]);

    const handleError = useCallback((error, operation) => {
        console.error(`Error during ${operation}:`, error);
        setState(prev => ({ ...prev, error: error.message }));
        throw error;
    }, []);

    // CRUD operations
    const dataOperations = useMemo(() => ({
        addBusinessProfile: async (profileData) => {
            try {
                // Create a business profile document
                await setDoc(doc(db, 'businessProfiles', profileData.userId), {
                    businessName: profileData.businessName,
                    phone: profileData.phone,
                    email: profileData.email,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    settings: {
                        currency: 'KSH',
                        notifications: true,
                    },
                    subscription: {
                        type: 'free',
                        startDate: serverTimestamp(),
                    }
                });

                // Create initial collections for the business
                const collections = ['categories', 'vendors', 'customers'];

                for (const collectionName of collections) {
                    const defaultDocRef = doc(db, `${collectionName}/${profileData.userId}/defaults/initial`);
                    await setDoc(defaultDocRef, {
                        createdAt: serverTimestamp(),
                        userId: profileData.userId
                    });
                }

            } catch (error) {
                console.error('Error adding business profile:', error);
                throw new Error('Failed to initialize business profile');
            }
        },

        // Transactions
        addTransaction: async (transactionData) => {
            try {
                const collectionRef = getCollectionRef('transactions');
                await addDoc(collectionRef, {
                    ...transactionData,
                    userId: user.uid,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                handleError(error, 'adding transaction');
            }
        },

        updateTransaction: async (transactionId, transactionData) => {
            try {
                const docRef = doc(db, 'transactions', transactionId);
                await updateDoc(docRef, {
                    ...transactionData,
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                handleError(error, 'updating transaction');
            }
        },

        deleteTransaction: async (transactionId) => {
            try {
                const docRef = doc(db, 'transactions', transactionId);
                await deleteDoc(docRef);
            } catch (error) {
                handleError(error, 'deleting transaction');
            }
        },

        // Budgets
        addBudget: async (budgetData) => {
            try {
                const collectionRef = getCollectionRef('budgets');
                await addDoc(collectionRef, {
                    ...budgetData,
                    userId: user.uid,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                handleError(error, 'adding budget');
            }
        },

        updateBudget: async (budgetId, budgetData) => {
            try {
                const docRef = doc(db, 'budgets', budgetId);
                await updateDoc(docRef, {
                    ...budgetData,
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                handleError(error, 'updating budget');
            }
        },

        deleteBudget: async (budgetId) => {
            try {
                const docRef = doc(db, 'budgets', budgetId);
                await deleteDoc(docRef);
            } catch (error) {
                handleError(error, 'deleting budget');
            }
        },

        // Similar methods for savingsGoals and reminders...
        addSavingsGoal: async (savingsData) => {
            try {
                const collectionRef = getCollectionRef('savingsGoals');
                await addDoc(collectionRef, {
                    ...savingsData,
                    userId: user.uid,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                handleError(error, 'adding savings goal');
            }
        },

        // Task operations
        addTask: async (taskData) => {
            try {
                const collectionRef = collection(db, 'tasks', user.uid, 'list');
                await addDoc(collectionRef, {
                    ...taskData,
                    userId: user.uid,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    completed: false
                });
            } catch (error) {
                handleError(error, 'adding task');
            }
        },

        updateTask: async (taskId, taskData) => {
            try {
                const docRef = doc(db, 'tasks', user.uid, 'list', taskId);
                await updateDoc(docRef, {
                    ...taskData,
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                handleError(error, 'updating task');
            }
        },

        deleteTask: async (taskId) => {
            try {
                const docRef = doc(db, 'tasks', user.uid, 'list', taskId);
                await deleteDoc(docRef);
            } catch (error) {
                handleError(error, 'deleting task');
            }
        },

        toggleTaskCompletion: async (taskId, completed) => {
            try {
                const docRef = doc(db, 'tasks', user.uid, 'list', taskId);
                await updateDoc(docRef, {
                    completed: !completed,
                    updatedAt: serverTimestamp()
                });
            } catch (error) {
                handleError(error, 'toggling task completion');
            }
        },

        // Helper functions for task filtering
        getTasksByPriority: (priority) => {
            return state.tasks.filter(task =>
                task.priority === priority && !task.completed
            );
        },

        getCompletedTasks: () => {
            return state.tasks.filter(task => task.completed);
        },

    }), [user, getCollectionRef, handleError, state.tasks]);

    // Memoize context value
    const contextValue = useMemo(() => ({
        ...state,
        ...dataOperations
    }), [state, dataOperations]);

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
};

// Custom hook with error handling
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};