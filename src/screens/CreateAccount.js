import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedLottieView from 'lottie-react-native';

const windowHeight = Dimensions.get('window').height;

export default function CreateAccount({ navigation }) {
    const [formData, setFormData] = useState({
        businessName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const animationRef = React.useRef(null);

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.play();
        }
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        if (!formData.businessName || !formData.phone || !formData.email ||
            !formData.password || !formData.confirmPassword) {
            Alert.alert('Required Fields', 'Please fill in all fields');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match');
            return false;
        }

        if (!formData.email.includes('@')) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleCreateAccount = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            navigation.navigate('Dashboard');
        } catch (error) {
            Alert.alert('Account Creation Failed', 'Please try again');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.contentContainer}>
                        {/* Animation Section */}
                        <View style={styles.animationContainer}>
                            <AnimatedLottieView
                                ref={animationRef}
                                source={{
                                    uri: 'https://lottie.host/a1947e14-6ab0-49cd-8831-93e0783238f6/lXMrmf0lfZ.json'
                                }}
                                style={styles.animation}
                                autoPlay
                                loop
                            />
                        </View>

                        {/* Welcome Text */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.welcomeText}>Join Our Community</Text>
                            <Text style={styles.subText}>
                                Take charge of your Business's Financial Future
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Business Name"
                                    value={formData.businessName}
                                    onChangeText={(text) => handleInputChange('businessName', text)}
                                    placeholderTextColor="#666"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChangeText={(text) => handleInputChange('phone', text)}
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#666"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChangeText={(text) => handleInputChange('email', text)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    placeholderTextColor="#666"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChangeText={(text) => handleInputChange('password', text)}
                                    secureTextEntry={!showPassword.password}
                                    placeholderTextColor="#666"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(prev => ({
                                        ...prev,
                                        password: !prev.password
                                    }))}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword.password ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                                    secureTextEntry={!showPassword.confirmPassword}
                                    placeholderTextColor="#666"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(prev => ({
                                        ...prev,
                                        confirmPassword: !prev.confirmPassword
                                    }))}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={showPassword.confirmPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={[styles.createButton, isLoading && styles.createButtonDisabled]}
                                onPress={handleCreateAccount}
                                disabled={isLoading}
                            >
                                <Text style={styles.createButtonText}>
                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        minHeight: windowHeight,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    animationContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 30,
    },
    animation: {
        width: 200,
        height: 200,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 15,
        backgroundColor: '#f8f8f8',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    passwordInput: {
        paddingRight: 40,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
    },
    createButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    createButtonDisabled: {
        backgroundColor: '#99c9ff',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingBottom: 80,
    },
    loginText: {
        color: '#666',
        fontSize: 14,
        marginRight: 5,
    },
    loginLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
});