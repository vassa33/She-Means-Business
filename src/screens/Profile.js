import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenLayout from '../layouts/ScreenLayout';
import { useAppContext } from '../context/AppContext';
import profileStyles from '../styles/ProfileStyles';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
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

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setProfileData(prev => ({
                ...prev,
                businessStartDate: selectedDate.toISOString().split('T')[0]
            }));
        }
    };

    const screenHeaderProps = {
        title: "Profile"
    };

    return (
        <SafeAreaView style={profileStyles.safeArea}>
            <>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#fff"
                    translucent={true}
                />
                <ScreenLayout headerProps={screenHeaderProps}>
                    <ScrollView style={profileStyles.content}>
                        {/* Profile Picture */}
                        <View style={profileStyles.profilePicContainer}>
                            <TouchableOpacity onPress={pickImage}>
                                {profileData.profilePic ? (
                                    <Image
                                        source={{ uri: profileData.profilePic }}
                                        style={profileStyles.profilePic}
                                    />
                                ) : (
                                    <View style={profileStyles.placeholderImage}>
                                        <Ionicons name="person" size={50} color="#666" />
                                    </View>
                                )}
                                <View style={profileStyles.changePhotoButton}>
                                    <Ionicons name="camera" size={20} color="#007AFF" />
                                    <Text style={profileStyles.changePhotoText}>Change Photo</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Profile Information */}
                        <View style={profileStyles.infoContainer}>
                            {[
                                { label: 'Name', key: 'name', icon: 'person-outline' },
                                { label: 'Business', key: 'business', icon: 'business-outline' },
                                { label: 'Phone', key: 'phone', icon: 'call-outline', keyboardType: 'phone-pad' },
                                {
                                    label: 'Business Start Date',
                                    key: 'businessStartDate',
                                    icon: 'calendar-outline',
                                    isDate: true
                                },
                            ].map((item) => (
                                <View key={item.key} style={profileStyles.infoItem}>
                                    <View style={profileStyles.labelContainer}>
                                        <Ionicons name={item.icon} size={20} color="#666" />
                                        <Text style={profileStyles.infoLabel}>{item.label}:</Text>
                                    </View>
                                    {isEditing ? (
                                        item.isDate ? (
                                            <TouchableOpacity
                                                style={profileStyles.dateInput}
                                                onPress={() => setShowDatePicker(true)}
                                            >
                                                <Text>{profileData[item.key] || 'Select date'}</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TextInput
                                                style={profileStyles.input}
                                                value={profileData[item.key]}
                                                onChangeText={(text) =>
                                                    setProfileData({ ...profileData, [item.key]: text })
                                                }
                                                keyboardType={item.keyboardType || 'default'}
                                            />
                                        )
                                    ) : (
                                        <Text style={profileStyles.infoText}>
                                            {profileData[item.key] || 'Not set'}
                                        </Text>
                                    )}
                                </View>
                            ))}

                            {/* Business Bio/Info Section */}
                            <View style={profileStyles.infoItem}>
                                <View style={profileStyles.labelContainer}>
                                    <Ionicons name="information-circle-outline" size={20} color="#666" />
                                    <Text style={profileStyles.infoLabel}>Business Info:</Text>
                                </View>
                                {isEditing ? (
                                    <TextInput
                                        style={[profileStyles.input, profileStyles.textArea]}
                                        value={profileData.businessBio}
                                        onChangeText={(text) =>
                                            setProfileData({ ...profileData, businessBio: text })
                                        }
                                        multiline
                                        numberOfLines={4}
                                        placeholder="Tell us about your business (e.g., services offered, mission statement, unique value proposition)"
                                        placeholderTextColor="#999"
                                    />
                                ) : (
                                    <Text style={profileStyles.infoText}>
                                        {profileData.businessBio || 'No business information provided'}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Edit Profile Button */}
                        <TouchableOpacity
                            style={[
                                profileStyles.editButton,
                                isEditing && profileStyles.saveButton
                            ]}
                            onPress={handleEdit}
                        >
                            <Ionicons
                                name={isEditing ? "checkmark-circle-outline" : "create-outline"}
                                size={20}
                                color="#fff"
                            />
                            <Text style={profileStyles.editButtonText}>
                                {isEditing ? 'Save Profile' : 'Edit Profile'}
                            </Text>
                        </TouchableOpacity>

                        {/* App Version */}
                        <Text style={profileStyles.versionText}>App Version: 1.0.0</Text>
                    </ScrollView>
                </ScreenLayout>

                {/* Date Picker Modal */}
                {showDatePicker && (
                    <DateTimePicker
                        value={profileData.businessStartDate ? new Date(profileData.businessStartDate) : new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </>
        </SafeAreaView>
    );
};

export default Profile;