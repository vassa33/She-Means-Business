// layouts/HeaderLayout.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Tooltip from 'react-native-walkthrough-tooltip';

const HeaderLayout = ({
    title,
    toggleSidebar,
    profilePic,
    tooltipContent,
    showTooltip,
    setShowTooltip
}) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={toggleSidebar}
                style={styles.menuButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons
                    name="menu"
                    size={30}
                    color="black"
                />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>{title}</Text>
                {tooltipContent && (
                    <Tooltip
                        isVisible={showTooltip}
                        content={<Text style={styles.tooltipContent}>{tooltipContent}</Text>}
                        placement="bottom"
                        onClose={() => setShowTooltip(false)}
                        backgroundStyle={styles.tooltipBackground}
                        contentStyle={styles.tooltip}
                    >
                        <TouchableOpacity
                            onPress={() => setShowTooltip(true)}
                            style={styles.infoButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={24}
                                color="#007AFF"
                            />
                        </TouchableOpacity>
                    </Tooltip>
                )}
            </View>

            <TouchableOpacity style={styles.profileButton}>
                {profilePic ? (
                    <Image
                        source={{ uri: profilePic }}
                        style={styles.headerProfilePic}
                    />
                ) : (
                    <Ionicons name="person-circle-outline" size={30} color="black" />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    menuButton: {
        padding: 5,
    },
    infoButton: {
        padding: 5,
        marginLeft: 8,
    },
    profileButton: {
        padding: 5,
    },
    headerProfilePic: {
        width: 30,
        height: 30,
        borderRadius: 12,
    },
    tooltipContent: {
        fontSize: 14,
        color: '#333',
        padding: 5,
    },
    tooltip: {
        maxWidth: 250,
    },
    tooltipBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
});

export default HeaderLayout;