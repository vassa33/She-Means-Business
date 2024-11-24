// firestoreSetup.js
import { db } from './firebase.config';
import {
    doc,
    setDoc,
    addDoc,
    serverTimestamp,
    writeBatch,
    collection
} from '@firebase/firestore';

export const setupDefaultCategories = async (userId) => {
    const defaultCategories = [
        {
            id: 'expense-inventory',
            name: 'Inventory',
            type: 'expense',
            icon: 'archive',
            color: '#4CAF50'
        },
        {
            id: 'expense-utilities',
            name: 'Utilities',
            type: 'expense',
            icon: 'flash',
            color: '#FF9800'
        },
        {
            id: 'expense-rent',
            name: 'Rent',
            type: 'expense',
            icon: 'home',
            color: '#F44336'
        },
        {
            id: 'expense-salaries',
            name: 'Salaries',
            type: 'expense',
            icon: 'people',
            color: '#2196F3'
        },
        {
            id: 'expense-marketing',
            name: 'Marketing',
            type: 'expense',
            icon: 'megaphone',
            color: '#9C27B0'
        },
        {
            id: 'expense-not-budgeted',
            name: 'Not Budgeted',
            type: 'expense',
            icon: 'help-circle',
            color: '#607D8B'
        },
        {
            id: 'income-sales',
            name: 'Sales',
            type: 'income',
            icon: 'cart',
            color: '#00BCD4'
        }
    ];

    const batch = writeBatch(db);

    for (const category of defaultCategories) {
        const docRef = doc(db, 'categories', userId, 'list', category.id);
        batch.set(docRef, {
            ...category,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: userId
        });
    }

    await batch.commit();
};

// Updated to match the transaction structure in your UI
export const setupTransactionsCollection = async (userId) => {
    try {
        const transactionsCollectionRef = collection(db, 'transactions', userId, 'list');

        // Sample initial transactions matching your UI data
        const initialTransactions = [
            {
                date: '2023-10-14',
                description: 'Sale of products',
                amount: 5000,
                type: 'income',
                category: 'Sales',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                userId: userId
            },
            {
                date: '2023-10-13',
                description: 'Purchase of materials',
                amount: -2000,
                type: 'expense',
                category: 'Inventory',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                userId: userId
            }
        ];

        const batch = writeBatch(db);

        for (const transaction of initialTransactions) {
            const newDocRef = doc(transactionsCollectionRef);
            batch.set(newDocRef, transaction);
        }

        await batch.commit();

    } catch (error) {
        console.error('Error initializing transactions:', error);
        throw error;
    }
};

// Helper functions for CRUD operations
export const addTransaction = async (userId, transactionData) => {
    try {
        const transactionsRef = collection(db, 'transactions', userId, 'list');
        await addDoc(transactionsRef, {
            ...transactionData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: userId
        });
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw error;
    }
};

export const updateTransaction = async (userId, transactionId, transactionData) => {
    try {
        const transactionRef = doc(db, 'transactions', userId, 'list', transactionId);
        await setDoc(transactionRef, {
            ...transactionData,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw error;
    }
};

export const deleteTransaction = async (userId, transactionId) => {
    try {
        const transactionRef = doc(db, 'transactions', userId, 'list', transactionId);
        await deleteDoc(transactionRef);
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};

export const setupBudgetCategories = async (userId) => {
    const defaultBudgets = [
        {
            id: 'budget-utilities',
            name: 'Monthly Utilities',
            amount: 0,
            categoryId: 'expense-utilities',
            period: 'monthly',
            color: '#FF9800'
        },
        {
            id: 'budget-rent',
            name: 'Monthly Rent',
            amount: 0,
            categoryId: 'expense-rent',
            period: 'monthly',
            color: '#F44336'
        },
        {
            id: 'budget-supplies',
            name: 'Monthly Supplies',
            amount: 0,
            categoryId: 'expense-supplies',
            period: 'monthly',
            color: '#9C27B0'
        }
    ];

    const batch = writeBatch(db);

    for (const budget of defaultBudgets) {
        const docRef = doc(db, 'budgets', userId, 'list', budget.id);
        batch.set(docRef, {
            ...budget,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: userId
        });
    }

    await batch.commit();
};

export const setupSavingsGoals = async (userId) => {
    const defaultGoals = [
        {
            id: 'savings-emergency',
            name: 'Emergency Fund',
            targetAmount: 0,
            saved: 0,
            deadline: null,
            color: '#4CAF50'
        }
    ];

    const batch = writeBatch(db);

    for (const goal of defaultGoals) {
        const docRef = doc(db, 'savings', userId, 'goals', goal.id);
        batch.set(docRef, {
            ...goal,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            userId: userId
        });
    }

    await batch.commit();
};

export const setupActionCenterTasks = async (userId) => {
    const defaultTasks = [
        {
            id: 'task-financial-review',
            title: 'Review Q4 Budget',
            priority: 'high',
            deadline: new Date('2024-11-20').toISOString(),
            category: 'finance',
            notes: 'Focus on marketing spend allocation',
            completed: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        },
        {
            id: 'task-supplier-payment',
            title: 'Supplier Payment - Fresh Goods',
            priority: 'high',
            deadline: new Date('2024-11-15').toISOString(),
            category: 'payment',
            amount: 'Ksh 50,000',
            completed: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    ];

    const batch = writeBatch(db);

    for (const task of defaultTasks) {
        const docRef = doc(db, 'tasks', userId, 'list', task.id);
        batch.set(docRef, {
            ...task,
            userId: userId
        });
    }

    await batch.commit();
};

export const initializeBusinessProfile = async (userData) => {
    if (!userData.uid) {
        throw new Error('User ID is required for initialization');
    }

    try {
        // Create business profile in the businessProfiles collection
        await setDoc(doc(db, 'businessProfiles', userData.uid), {
            businessName: userData.businessName,
            phone: userData.phone,
            email: userData.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            settings: {
                currency: 'KSH',
                notifications: true,
                theme: 'light',
                language: 'en'
            },
            subscription: {
                type: 'free',
                startDate: serverTimestamp()
            }
        });

        // Set up all required collections
        const setupTasks = [
            setupDefaultCategories(userData.uid),
            setupInitialTransactions(userData.uid),
            setupBudgetCategories(userData.uid),
            setupSavingsGoals(userData.uid),
            setupActionCenterTasks(userData.uid)
        ];

        // Use Promise.allSettled to handle potential failures in individual setups
        const results = await Promise.allSettled(setupTasks);

        // Check for any failures
        const failures = results.filter(result => result.status === 'rejected');
        if (failures.length > 0) {
            console.error('Some initialization tasks failed:', failures);
            // Continue anyway as the main profile was created
        }

        return true;
    } catch (error) {
        console.error('Error initializing Business profile:', error);
        throw new Error(`Failed to initialize Business profile: ${error.message}`);
    }
};