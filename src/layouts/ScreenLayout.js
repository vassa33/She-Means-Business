// layouts/ScreenLayout.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import SidebarLayout from './SidebarLayout';
import HeaderLayout from './HeaderLayout';
import { useAppContext } from '../contexts/AppContext';

const ScreenLayout = ({ children, headerProps }) => {
    const { profileData } = useAppContext();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    return (
        <SidebarLayout>
            {({ toggleSidebar, closeSidebar, isSidebarVisible }) => {
                // Close sidebar when screen loses focus
                useEffect(() => {
                    if (!isFocused && isSidebarVisible) {
                        closeSidebar();
                    }
                }, [isFocused, isSidebarVisible, closeSidebar]);

                return (
                    <View style={styles.container}>
                        <HeaderLayout
                            title={headerProps?.title}
                            profilePic={profileData?.profilePic}
                            toggleSidebar={toggleSidebar}
                            tooltipContent={headerProps?.tooltipContent}
                            showTooltip={headerProps?.showTooltip}
                            setShowTooltip={headerProps?.setShowTooltip}
                        />
                        <View style={styles.content}>
                            {children}
                        </View>
                    </View>
                );
            }}
        </SidebarLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
});

export default ScreenLayout;