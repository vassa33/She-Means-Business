import React, { useState, useRef } from 'react';
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
    ActivityIndicator,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedLottieView from 'lottie-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';

const Login = ({ navigation }) => {
    const { login } = useAuth();
    const { setGlobalLoading } = useUI();
    const animationRef = useRef(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const errors = {};
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) {
            Alert.alert('Validation Error', 'Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        setGlobalLoading(true);

        try {
            await login(formData.email.trim(), formData.password);
            // The AuthContext's onAuthStateChanged listener will handle navigation
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Login Failed', error.message || 'An error occurred during login. Please try again.');

        } finally {
            setIsLoading(false);
            setGlobalLoading(false);
        }
    };

    const renderInput = (field, placeholder, icon, props = {}) => (
        <View style={styles.inputContainer}>
            <Ionicons
                name={icon}
                size={20}
                color={formErrors[field] ? '#ff4444' : '#666'}
                style={styles.inputIcon}
            />
            <TextInput
                style={[
                    styles.input,
                    formErrors[field] && styles.inputError,
                    field === 'password' && styles.passwordInput,
                ]}
                placeholder={placeholder}
                value={formData[field]}
                onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, [field]: text }));
                    setFormErrors(prev => ({ ...prev, [field]: '' }));
                }}
                placeholderTextColor="#666"
                {...props}
            />
            {field === 'password' && (
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                >
                    <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#666"
                    />
                </TouchableOpacity>
            )}
            {formErrors[field] && (
                <Text style={styles.errorText}>{formErrors[field]}</Text>
            )}
        </View>
    );

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
                        <View style={styles.animationContainer}>
                            <AnimatedLottieView
                                ref={animationRef}
                                source={{
                                    uri: 'https://lottie.host/a1947e14-6ab0-49cd-8831-93e0783238f6/lXMrmf0lfZ.json',
                                }}
                                style={styles.animation}
                                autoPlay
                                loop
                            />
                        </View>

                        <View style={styles.headerContainer}>
                            <Text style={styles.welcomeText}>Welcome Back!</Text>
                            <Text style={styles.subText}>
                                Your Business Financial Manager
                            </Text>
                        </View>

                        <View style={styles.formContainer}>
                            {renderInput('email', 'Email Address', 'mail-outline', {
                                keyboardType: 'email-address',
                                autoCapitalize: 'none',
                                autoComplete: 'email',
                            })}
                            {renderInput('password', 'Password', 'lock-closed-outline', {
                                secureTextEntry: !showPassword,
                            })}

                            <TouchableOpacity
                                style={[
                                    styles.loginButton,
                                    isLoading && styles.loginButtonDisabled,
                                ]}
                                onPress={handleLogin}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.loginButtonText}>Login</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.forgotPasswordButton}
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                <Text style={styles.forgotPasswordText}>
                                    Forgot Password?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account?</Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('CreateAccount')}
                            >
                                <Text style={styles.signupLink}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const windowHeight = Dimensions.get('window').height;

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
        marginTop: 50,
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
    inputError: {
        borderColor: '#ff4444',
    },
    passwordInput: {
        paddingRight: 40,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonDisabled: {
        backgroundColor: '#99c9ff',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPasswordButton: {
        alignItems: 'center',
        marginTop: 15,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        paddingBottom: 180,
    },
    signupText: {
        color: '#666',
        fontSize: 14,
        marginRight: 5,
    },
    signupLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Login;