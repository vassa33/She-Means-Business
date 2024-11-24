import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';

const Sidebar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {
        profileData,
        currentScreen,
        setCurrentScreen,
        setIsSidebarVisible
    } = useAppContext();

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', () => {
            setIsSidebarVisible(false);
        });

        return unsubscribe;
    }, [navigation, setIsSidebarVisible]);

    const menuItems = [
        { name: 'Dashboard', icon: 'home' },
        { name: 'Action Center', icon: 'flash' },
        { name: 'Transaction Log', icon: 'list' },
        { name: 'Cash Flow', icon: 'trending-up' },
        { name: 'Budget Tracker', icon: 'wallet' },
        { name: 'Savings Tracker', icon: 'save' },
        { name: 'Reports', icon: 'bar-chart' },
        { name: 'Profile', icon: 'person' },
        { name: 'About', icon: 'information-circle' },
    ];

    const handleNavigation = (screenName) => {
        const routeName = screenName.replace(/\s+/g, '');
        setCurrentScreen(screenName);

        if (route.name !== routeName) {
            navigation.navigate(routeName);
        }

        setIsSidebarVisible(false);
    };

    const handleLogout = () => {
        navigation.navigate('Login')
        setIsSidebarVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.mainContent}>
                <View style={styles.profileSection}>
                    {profileData.profilePic ? (
                        <Image
                            source={{ uri: profileData.profilePic }}
                            style={styles.profilePic}
                        />
                    ) : (
                        <View style={styles.profilePicPlaceholder}>
                            <Ionicons name="person" size={40} color="#666" />
                        </View>
                    )}
                    <Text style={styles.name}>{profileData.business}</Text>
                    <Text style={styles.business}>{profileData.name}</Text>
                </View>

                <View style={styles.menuItems}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            style={[
                                styles.menuItem,
                                currentScreen === item.name && styles.activeMenuItem
                            ]}
                            onPress={() => handleNavigation(item.name)}
                        >
                            <Ionicons
                                name={item.icon}
                                size={24}
                                color={currentScreen === item.name ? '#007AFF' : '#666'}
                            />
                            <Text
                                style={[
                                    styles.menuItemText,
                                    currentScreen === item.name && styles.activeMenuItemText
                                ]}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Ionicons name="log-out" size={24} color="#FF3B30" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContent: {
        flex: 1,
    },
    profileSection: {
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    profilePicPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    business: {
        fontSize: 14,
        color: '#666',
    },
    menuItems: {
        padding: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
    },
    activeMenuItem: {
        backgroundColor: '#007AFF15',
    },
    menuItemText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#666',
    },
    activeMenuItemText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 25,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 'auto',
    },
    logoutText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '600',
    },
});

export default Sidebar;