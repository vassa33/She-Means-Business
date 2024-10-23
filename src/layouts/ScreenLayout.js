// layouts/ScreenLayout.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import SidebarLayout from './SidebarLayout';
import HeaderLayout from './HeaderLayout';
import { useAppContext } from '../context/AppContext';

const ScreenLayout = ({ children, headerProps }) => {
    const { profileData } = useAppContext();

    return (
        <SidebarLayout>
            {({ toggleSidebar }) => (
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
            )}
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