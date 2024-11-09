import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAppContext } from '../context/AppContext';
import ScreenLayout from '../layouts/ScreenLayout';
import { SafeAreaView } from 'react-native-safe-area-context';

const Dashboard = () => {
    const { profileData, setCurrentScreen } = useAppContext();
    const screenWidth = Dimensions.get("window").width;
    const [goalProgress, setGoalProgress] = useState(65); // Example progress

    useEffect(() => {
        setCurrentScreen('Dashboard');
    }, []);

    // Key metrics that provide unique insights not found in other screens
    const businessInsights = [
        {
            title: 'Next Goal',
            content: `${goalProgress}% towards ${profileData.currentGoal || 'Monthly Revenue Target'}`,
            icon: 'trophy-outline',
            type: 'progress'
        },
        {
            title: 'Quick Actions',
            content: ['Record Sale', 'Add Expense', 'Set Reminder'],
            icon: 'flash-outline',
            type: 'actions'
        },
        {
            title: 'Business Health',
            content: 'Strong Growth',
            subtitle: 'Based on last 30 days',
            icon: 'pulse-outline',
            type: 'health'
        }
    ];

    // Upcoming activities and deadlines
    const upcomingItems = [
        {
            title: 'Tax Payment Due',
            date: '2024-11-15',
            type: 'deadline'
        },
        {
            title: 'Supplier Payment',
            date: '2024-11-12',
            amount: 'Ksh 50,000',
            type: 'payment'
        }
    ];

    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <SafeAreaView style={styles.safeArea}>
                <ScreenLayout headerProps={{ title: "Dashboard" }}>
                    <ScrollView style={styles.content}>
                        {/* Personalized Welcome */}
                        <View style={styles.welcomeSection}>
                            <Text style={styles.welcomeText}>
                                {getGreeting()}, {profileData.ownerName}
                            </Text>
                            <Text style={styles.businessName}>{profileData.business}</Text>
                        </View>

                        {/* Priority Alerts */}
                        <View style={styles.alertsSection}>
                            {upcomingItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.alertItem,
                                    item.type === 'deadline' ? styles.alertUrgent : styles.alertNormal
                                    ]}
                                >
                                    <Ionicons
                                        name={item.type === 'deadline' ? 'alarm-outline' : 'calendar-outline'}
                                        size={24}
                                        color={item.type === 'deadline' ? '#ff6b6b' : '#007AFF'}
                                    />
                                    <View style={styles.alertContent}>
                                        <Text style={styles.alertTitle}>{item.title}</Text>
                                        <Text style={styles.alertDate}>Due: {formatDate(item.date)}</Text>
                                        {item.amount && (
                                            <Text style={styles.alertAmount}>{item.amount}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Business Insights */}
                        <View style={styles.insightsContainer}>
                            {businessInsights.map((insight, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.insightCard}
                                >
                                    <View style={styles.insightHeader}>
                                        <View style={[styles.iconContainer,
                                        { backgroundColor: getInsightColor(insight.type) }]}>
                                            <Ionicons name={insight.icon} size={24} color="#fff" />
                                        </View>
                                        <Text style={styles.insightTitle}>{insight.title}</Text>
                                    </View>

                                    {insight.type === 'progress' && (
                                        <View style={styles.progressBar}>
                                            <View style={[styles.progressFill, { width: `${goalProgress}%` }]} />
                                        </View>
                                    )}

                                    {insight.type === 'actions' && (
                                        <View style={styles.actionButtons}>
                                            {Array.isArray(insight.content) && insight.content.map((action, i) => (
                                                <TouchableOpacity key={i} style={styles.actionButton}>
                                                    <Text style={styles.actionText}>{action}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    {insight.type === 'health' && (
                                        <View style={styles.healthIndicator}>
                                            <Text style={styles.healthText}>{insight.content}</Text>
                                            <Text style={styles.healthSubtext}>{insight.subtitle}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </ScreenLayout>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    welcomeSection: {
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    welcomeText: {
        fontSize: 16,
        color: '#666',
    },
    businessName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    alertsSection: {
        padding: 15,
    },
    alertItem: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    alertUrgent: {
        backgroundColor: '#fff5f5',
    },
    alertNormal: {
        backgroundColor: '#f8f9fa',
    },
    alertContent: {
        marginLeft: 15,
        flex: 1,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    alertDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    alertAmount: {
        fontSize: 14,
        color: '#007AFF',
        marginTop: 4,
    },
    insightsContainer: {
        padding: 15,
    },
    insightCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#007AFF15',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    actionText: {
        color: '#007AFF',
        fontSize: 14,
    },
    healthIndicator: {
        alignItems: 'center',
    },
    healthText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    healthSubtext: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});

// Helper functions
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
};

const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const getInsightColor = (type) => {
    const colors = {
        progress: '#4CAF50',
        actions: '#007AFF',
        health: '#FF9800'
    };
    return colors[type] || '#007AFF';
};

export default Dashboard;