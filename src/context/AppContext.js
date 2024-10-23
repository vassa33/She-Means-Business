// context/AppContext.js
import React, { createContext, useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        name: 'Vee Kimani',
        business: 'EK Crafts',
        phone: '+254 712 345 678',
        profilePic: null,
    });
    const [currentScreen, setCurrentScreen] = useState('Dashboard');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const value = {
        profileData,
        setProfileData,
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
