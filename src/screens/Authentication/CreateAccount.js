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
    Dimensions,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedLottieView from 'lottie-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useUI } from '../../contexts/UIContext';

const PHONE_REGEX = /^\+?[\d\s-]{10,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const CreateAccount = ({ navigation }) => {
    const { createUser } = useAuth();
    const { addBusinessProfile } = useData();
    const { setGlobalLoading } = useUI();

    const [formData, setFormData] = useState({
        businessName: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState({});
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
            [field]: value,
        }));
        // Clear error when user starts typing
        setFormErrors(prev => ({
            ...prev,
            [field]: '',
        }));
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'businessName':
                return value.trim().length >= 2 ? '' : 'Business name is too short';
            case 'phone':
                return PHONE_REGEX.test(value) ? '' : 'Invalid phone number';
            case 'email':
                return EMAIL_REGEX.test(value) ? '' : 'Invalid email address';
            case 'password':
                return PASSWORD_REGEX.test(value)
                    ? ''
                    : 'Password must be at least 8 characters with letters and numbers';
            case 'confirmPassword':
                return value === formData.password ? '' : 'Passwords do not match';
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setFormErrors(newErrors);
        return isValid;
    };

    const handleCreateAccount = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please correct the errors in the form');
            return;
        }

        setIsLoading(true);
        setGlobalLoading(true);

        try {
            await createUser({
                email: formData.email.trim(),
                password: formData.password,
                businessName: formData.businessName.trim(),
                phone: formData.phone.trim(),
            });

            // Navigate to Login after successful account creation
            Alert.alert('Success', 'Account created successfully! Please log in.');
            navigation.navigate('Login');

            // The AuthContext's onAuthStateChanged listener will handle navigation
        } catch (error) {
            console.error('Account creation error:', error);
            Alert.alert(
                'Account Creation Failed',
                error.message
            );
        } finally {
            setIsLoading(false);
            setGlobalLoading(false);
        }
    };

    const renderInput = (field, placeholder, icon, props = {}) => (
        <View style={createAccountStyles.inputWrapper}>
            <View style={[
                createAccountStyles.inputContainer,
                formErrors[field] && createAccountStyles.inputContainerError
            ]}>
                <Ionicons
                    name={icon}
                    size={20}
                    color={formErrors[field] ? '#ff4444' : '#666'}
                    style={createAccountStyles.inputIcon}
                />
                <TextInput
                    style={[
                        createAccountStyles.input,
                        field.includes('password') && createAccountStyles.passwordInput,
                    ]}
                    placeholder={placeholder}
                    value={formData[field]}
                    onChangeText={(text) => handleInputChange(field, text)}
                    placeholderTextColor="#666"
                    {...props}
                />
                {field.includes('password') && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(prev => ({
                            ...prev,
                            [field]: !prev[field]
                        }))}
                        style={createAccountStyles.eyeIcon}
                    >
                        <Ionicons
                            name={showPassword[field] ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {formErrors[field] && (
                <Text style={createAccountStyles.errorText}>{formErrors[field]}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={createAccountStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={createAccountStyles.container}
            >
                <ScrollView
                    contentContainerStyle={createAccountStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={createAccountStyles.contentContainer}>
                        <View style={createAccountStyles.animationContainer}>
                            <AnimatedLottieView
                                ref={animationRef}
                                source={{
                                    uri: 'https://lottie.host/a1947e14-6ab0-49cd-8831-93e0783238f6/lXMrmf0lfZ.json',
                                }}
                                style={createAccountStyles.animation}
                                autoPlay
                                loop
                            />
                        </View>

                        <View style={createAccountStyles.headerContainer}>
                            <Text style={createAccountStyles.welcomeText}>Join Our Community</Text>
                            <Text style={createAccountStyles.subText}>
                                Take charge of your Business's Financial Future
                            </Text>
                        </View>

                        <View style={createAccountStyles.formContainer}>
                            {renderInput('businessName', 'Business Name', 'business-outline')}
                            {renderInput('phone', 'Phone Number', 'call-outline', {
                                keyboardType: 'phone-pad',
                            })}
                            {renderInput('email', 'Email Address', 'mail-outline', {
                                keyboardType: 'email-address',
                                autoCapitalize: 'none',
                            })}
                            {renderInput('password', 'Password', 'lock-closed-outline', {
                                secureTextEntry: !showPassword.password,
                            })}
                            {renderInput('confirmPassword', 'Confirm Password', 'lock-closed-outline', {
                                secureTextEntry: !showPassword.confirmPassword,
                            })}

                            <TouchableOpacity
                                style={[
                                    createAccountStyles.createButton,
                                    isLoading && createAccountStyles.createButtonDisabled,
                                ]}
                                onPress={handleCreateAccount}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={createAccountStyles.createButtonText}>Create Account</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={createAccountStyles.loginContainer}>
                            <Text style={createAccountStyles.loginText}>Already have an account?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={createAccountStyles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const windowHeight = Dimensions.get('window').height;

const createAccountStyles = StyleSheet.create({
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
    inputWrapper: {
        marginBottom: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 15,
        backgroundColor: '#f8f8f8',
        minHeight: 50,
    },
    inputContainerError: {
        //borderColor: '#ff4444',
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 12,
    },
    passwordInput: {
        paddingRight: 40,
    },
    eyeIcon: {
        padding: 10,
        position: 'absolute',
        right: 5,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 15,
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

export default CreateAccount;