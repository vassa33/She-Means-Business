import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [currentScreen, setCurrentScreen] = useState('Dashboard');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [globalLoading, setGlobalLoading] = useState(false);

    const value = {
        currentScreen,
        setCurrentScreen,
        isSidebarVisible,
        setIsSidebarVisible,
        theme,
        setTheme,
        notifications,
        setNotifications,
        globalLoading,
        setGlobalLoading,
        isLoading,
        setIsLoading
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
