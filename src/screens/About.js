import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Animated,
    TouchableOpacity,
    Platform,
    Dimensions,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../layouts/ScreenLayout';
import { useAppContext } from '../contexts/AppContext';

const FeatureCard = ({ icon, title, description, delay }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 800,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.featureCard,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY }],
                },
            ]}
        >
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={32} color="#007AFF" />
            </View>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
        </Animated.View>
    );
};

const About = () => {
    const { setCurrentScreen } = useAppContext();
    const [activeSection, setActiveSection] = useState('features');
    const windowHeight = Dimensions.get('window').height;

    useEffect(() => {
        setCurrentScreen('About');
    }, []);

    const features = [
        {
            icon: 'stats-chart-outline',
            title: 'Financial Dashboard',
            description: 'Real-time overview of your business finances with intuitive visualizations.',
        },
        {
            icon: 'receipt-outline',
            title: 'Transaction Tracking',
            description: 'Comprehensive log of all financial transactions with smart categorization.',
        },
        {
            icon: 'trending-up-outline',
            title: 'Cash Flow Analysis',
            description: 'Track and forecast your cash flow with advanced analytics.',
        },
        {
            icon: 'wallet-outline',
            title: 'Budget Management',
            description: 'Set and track budgets with customizable savings goals.',
        },
        {
            icon: 'bar-chart-outline',
            title: 'Financial Reports',
            description: 'Detailed profit & loss statements and business trend analysis.',
        },
        {
            icon: 'bulb-outline',
            title: 'Smart Insights',
            description: 'AI-powered recommendations for business growth and optimization.',
        }
    ];

    const testimonials = [
        {
            quote: "SMB App transformed how I manage my business finances.",
            author: "Sarah M.",
            business: "Retail Owner"
        },
        {
            quote: "The forecasting tools helped me plan for growth with confidence.",
            author: "Michael R.",
            business: "Tech Startup"
        },
        {
            quote: "Finally, financial management that makes sense!",
            author: "Jessica L.",
            business: "Service Provider"
        },
        {
            quote: "With SMB App, budgeting and tracking expenses has never been easier!",
            author: "Emily K.",
            business: "Freelance Designer"
        },
        {
            quote: "The insights and reports have given me a clear vision of my business's future.",
            author: "David O.",
            business: "Café Owner"
        }
    ];

    const screenHeaderProps = {
        title: "About SMB App"
    };

    const renderTabButton = (tabName, label, icon) => (
        <TouchableOpacity
            style={[
                styles.tabButton,
                activeSection === tabName && styles.activeTabButton,
            ]}
            onPress={() => setActiveSection(tabName)}
        >
            <Ionicons
                name={icon}
                size={24}
                color={activeSection === tabName ? '#007AFF' : '#666'}
            />
            <Text
                style={[
                    styles.tabButtonText,
                    activeSection === tabName && styles.activeTabButtonText,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderContent = () => (
        <>
            {activeSection === 'features' && (
                <View style={styles.sectionContainer}>
                    <Text style={styles.welcomeText}>
                        Welcome to <Text style={styles.highlightText}>SMB App</Text>
                    </Text>
                    <Text style={styles.subtitleText}>
                        Your Smart Financial Management Partner
                    </Text>

                    <View style={styles.featureGrid}>
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.title}
                                {...feature}
                                delay={index * 200}
                            />
                        ))}
                    </View>
                </View>
            )}

            {activeSection === 'mission' && (
                <View style={styles.sectionContainer}>
                    <Text style={styles.missionTitle}>Our Mission</Text>
                    <Text style={styles.missionText}>
                        At SMB, we're about empowering you—the bold, innovative, and unstoppable entrepreneurs! Whether you're just starting or already a pro, SMB is designed to give you the tool to take charge of your business's financial future. 📊🚀{'\n\n'}
                        Our mission is simple: Every small business deserves the right resources to succeed. That's why we've created a simple yet powerful financial management toolkit that helps you plan, budget, track, and make decisions that drive growth. 🎯✨{'\n\n'}
                        Let's turn those big dreams into thriving realities, one smart decision at a time!
                    </Text>

                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>10K+</Text>
                            <Text style={styles.statLabel}>Businesses Helped</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>$50M+</Text>
                            <Text style={styles.statLabel}>Managed Monthly</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>4.8⭐</Text>
                            <Text style={styles.statLabel}>User Rating</Text>
                        </View>
                    </View>

                    <View style={styles.testimonialSection}>
                        <Text style={styles.testimonialTitle}>What Our Users Say</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.testimonialContainer}
                        >
                            {testimonials.map((testimonial, index) => (
                                <View key={index} style={styles.testimonialCard}>
                                    <Ionicons name='person-outline' size={24} color="#007AFF" />
                                    <Text style={styles.testimonialQuote}>{testimonial.quote}</Text>
                                    <Text style={styles.testimonialAuthor}>{testimonial.author}</Text>
                                    <Text style={styles.testimonialBusiness}>{testimonial.business}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#fff"
                    translucent={true}
                />
                <ScreenLayout headerProps={screenHeaderProps}>
                    <View style={styles.mainContainer}>
                        <View style={styles.tabContainer}>
                            {renderTabButton('features', 'Features', 'grid-outline')}
                            {renderTabButton('mission', 'Our Mission', 'flag-outline')}
                        </View>

                        <View style={styles.contentContainer}>
                            <ScrollView
                                style={styles.scrollView}
                                contentContainerStyle={styles.scrollViewContent}
                                showsVerticalScrollIndicator={true}
                                bounces={true}
                            >
                                {renderContent()}
                            </ScrollView>
                        </View>
                    </View>
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
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        ...Platform.select({
            web: {
                height: 'calc(100vh - 120px)', // Adjust based on header height
                overflow: 'hidden',
            },
            default: {
                flex: 1,
            },
        }),
    },
    scrollView: {
        flex: 1,
        width: '100%',
        ...Platform.select({
            web: {
                overflowY: 'auto',
            },
        }),
    },
    scrollViewContent: {
        flexGrow: 1,
        ...Platform.select({
            web: {
                minHeight: '100%',
            },
        }),
    },
    tabContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        zIndex: 1,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 4,
        backgroundColor: '#fff',
    },
    activeTabButton: {
        backgroundColor: '#e6f3ff',
    },
    tabButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
    },
    activeTabButtonText: {
        color: '#007AFF',
        fontWeight: '500',
    },
    sectionContainer: {
        padding: 20,
        ...Platform.select({
            web: {
                maxWidth: 1200,
                alignSelf: 'center',
                width: '100%',
            },
        }),
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    highlightText: {
        color: '#007AFF',
    },
    subtitleText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    featureGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
        ...Platform.select({
            web: {
                gap: 20,
            },
        }),
    },
    featureCard: {
        width: Platform.select({
            web: 'calc(50% - 10px)',
            default: '48%',
        }),
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#e6f3ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    featureDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    missionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    missionText: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 32,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        flexWrap: 'wrap',
    },
    statCard: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        minWidth: 100,
        margin: 8,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    testimonialSection: {
        marginTop: 40,
        paddingTop: 32,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    testimonialTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    testimonialContainer: {
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
    testimonialCard: {
        width: 280,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    testimonialQuote: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginTop: 12,
        marginBottom: 16,
        fontStyle: 'italic',
    },
    testimonialAuthor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    testimonialBusiness: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});

export default About;