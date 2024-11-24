// context/AppContext.js
import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        name: 'Koko Njoroge ✨',
        business: 'Koko Designs',
        phone: '+254 794 552 223',
        profilePic: null,
    });

    const [budgetData, setBudgetData] = useState({
        categories: [
            { id: '1', name: 'Deliveries', budget: 6500, spent: 3500 },
            { id: '2', name: 'Marketing', budget: 5000, spent: 2000 },
            { id: '3', name: 'Packaging', budget: 10000, spent: 1800 },
            { id: '4', name: 'Utilities', budget: 2800, spent: 1060 },
        ]
    });

    const [currentScreen, setCurrentScreen] = useState('Dashboard');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const value = {
        profileData,
        setProfileData,
        budgetData,
        setBudgetData,
        currentScreen,
        setCurrentScreen,
        isSidebarVisible,
        setIsSidebarVisible,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};