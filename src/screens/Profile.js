// screens/Profile.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    Platform,
    Alert,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ScreenLayout from '../layouts/ScreenLayout';
import { useAppContext } from '../context/AppContext';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { profileData, setProfileData, setCurrentScreen } = useAppContext();

    useEffect(() => {
        setCurrentScreen('Profile');
    }, []);

    const pickImage = async () => {
        try {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change your profile picture.');
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setProfileData(prev => ({
                    ...prev,
                    profilePic: result.assets[0].uri
                }));
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
            console.error(error);
        }
    };

    const handleEdit = () => {
        if (isEditing) {
            Alert.alert('Success', 'Profile updated successfully!');
            setProfileData({ ...profileData });
        }
        setIsEditing(!isEditing);
    };

    const screenHeaderProps = {
        title: "Profile"
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#fff"
                    translucent={true}
                />
                <ScreenLayout headerProps={screenHeaderProps}>
                    <ScrollView style={styles.content}>
                        {/* Profile Picture */}
                        <View style={styles.profilePicContainer}>
                            <TouchableOpacity onPress={pickImage}>
                                {profileData.profilePic ? (
                                    <Image
                                        source={{ uri: profileData.profilePic }}
                                        style={styles.profilePic}
                                    />
                                ) : (
                                    <View style={styles.placeholderImage}>
                                        <Ionicons name="person" size={50} color="#666" />
                                    </View>
                                )}
                                <View style={styles.changePhotoButton}>
                                    <Ionicons name="camera" size={20} color="#007AFF" />
                                    <Text style={styles.changePhotoText}>Change Photo</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Profile Information */}
                        <View style={styles.infoContainer}>
                            {[
                                { label: 'Name', key: 'name', icon: 'person-outline' },
                                { label: 'Business', key: 'business', icon: 'business-outline' },
                                { label: 'Phone', key: 'phone', icon: 'call-outline', keyboardType: 'phone-pad' },
                            ].map((item) => (
                                <View key={item.key} style={styles.infoItem}>
                                    <View style={styles.labelContainer}>
                                        <Ionicons name={item.icon} size={20} color="#666" />
                                        <Text style={styles.infoLabel}>{item.label}:</Text>
                                    </View>
                                    {isEditing ? (
                                        <TextInput
                                            style={styles.input}
                                            value={profileData[item.key]}
                                            onChangeText={(text) =>
                                                setProfileData({ ...profileData, [item.key]: text })
                                            }
                                            keyboardType={item.keyboardType || 'default'}
                                        />
                                    ) : (
                                        <Text style={styles.infoText}>{profileData[item.key]}</Text>
                                    )}
                                </View>
                            ))}
                        </View>

                        {/* Edit Profile Button */}
                        <TouchableOpacity
                            style={[
                                styles.editButton,
                                isEditing && styles.saveButton
                            ]}
                            onPress={handleEdit}
                        >
                            <Ionicons
                                name={isEditing ? "checkmark-circle-outline" : "create-outline"}
                                size={20}
                                color="#fff"
                            />
                            <Text style={styles.editButtonText}>
                                {isEditing ? 'Save Profile' : 'Edit Profile'}
                            </Text>
                        </TouchableOpacity>

                        {/* App Version */}
                        <Text style={styles.versionText}>App Version: 1.0.0</Text>
                    </ScrollView>
                </ScreenLayout>
            </>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
    },
    profilePicContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    changePhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderRadius: 20,
        gap: 5,
    },
    changePhotoText: {
        color: '#007AFF',
        fontSize: 14,
    },
    infoContainer: {
        padding: 20,
    },
    infoItem: {
        marginBottom: 20,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        gap: 5,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        gap: 10,
    },
    saveButton: {
        backgroundColor: '#34C759',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        color: '#888',
        marginBottom: 20,
    },
});

export default Profile;