// layouts/SidebarLayout.js
import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Sidebar from '../screens/Sidebar';

const SidebarLayout = ({ children }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const sidebarPosition = useRef(new Animated.Value(-250)).current;
    const mainContentPosition = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const animateSidebar = (show) => {
        const toValue = show ? 0 : -250;
        const contentToValue = show ? 250 : 0;
        const opacityValue = show ? 0.5 : 0;

        return Animated.parallel([
            Animated.timing(sidebarPosition, {
                toValue,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(mainContentPosition, {
                toValue: contentToValue,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: opacityValue,
                duration: 300,
                useNativeDriver: true,
            }),
        ]);
    };

    const toggleSidebar = useCallback(() => {
        const animation = animateSidebar(!isSidebarVisible);
        animation.start(() => {
            setIsSidebarVisible(!isSidebarVisible);
        });
    }, [isSidebarVisible]);

    const closeSidebar = useCallback(() => {
        if (isSidebarVisible) {
            const animation = animateSidebar(false);
            animation.start(() => {
                setIsSidebarVisible(false);
            });
        }
    }, [isSidebarVisible]);

    return (
        <View style={styles.container}>
            {isSidebarVisible && (
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={closeSidebar}
                >
                    <Animated.View
                        style={[
                            styles.overlayBackground,
                            { opacity: overlayOpacity }
                        ]}
                    />
                </TouchableOpacity>
            )}

            <Animated.View
                style={[
                    styles.sidebarContainer,
                    {
                        transform: [{ translateX: sidebarPosition }],
                    }
                ]}
            >
                <Sidebar onCloseSidebar={closeSidebar} />
            </Animated.View>

            <Animated.View
                style={[
                    styles.mainContent,
                    {
                        transform: [{ translateX: mainContentPosition }],
                    }
                ]}
            >
                {typeof children === 'function'
                    ? children({
                        toggleSidebar,
                        closeSidebar,
                        isSidebarVisible
                    })
                    : children}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    overlayBackground: {
        backgroundColor: '#000',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    sidebarContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 250,
        backgroundColor: '#fff',
        zIndex: 2,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    mainContent: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default SidebarLayout;