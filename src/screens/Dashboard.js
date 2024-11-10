// ../screens/Dashboard.js
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import ScreenLayout from '../layouts/ScreenLayout';
import { SafeAreaView } from 'react-native-safe-area-context';
import dashboardStyles from '../styles/DashboardStyles';

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
            <SafeAreaView style={dashboardStyles.safeArea}>
                <ScreenLayout headerProps={{ title: "Dashboard" }}>
                    <ScrollView style={dashboardStyles.content}>
                        {/* Personalized Welcome */}
                        <View style={dashboardStyles.welcomeSection}>
                            <Text style={dashboardStyles.welcomeText}>
                                {getGreeting()}, {profileData.ownerName}
                            </Text>
                            <Text style={dashboardStyles.businessName}>{profileData.business}</Text>
                        </View>

                        {/* Priority Alerts */}
                        <View style={dashboardStyles.alertsSection}>
                            {upcomingItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[dashboardStyles.alertItem,
                                    item.type === 'deadline' ? dashboardStyles.alertUrgent : dashboardStyles.alertNormal
                                    ]}
                                >
                                    <Ionicons
                                        name={item.type === 'deadline' ? 'alarm-outline' : 'calendar-outline'}
                                        size={24}
                                        color={item.type === 'deadline' ? '#ff6b6b' : '#007AFF'}
                                    />
                                    <View style={dashboardStyles.alertContent}>
                                        <Text style={dashboardStyles.alertTitle}>{item.title}</Text>
                                        <Text style={dashboardStyles.alertDate}>Due: {formatDate(item.date)}</Text>
                                        {item.amount && (
                                            <Text style={dashboardStyles.alertAmount}>{item.amount}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Business Insights */}
                        <View style={dashboardStyles.insightsContainer}>
                            {businessInsights.map((insight, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={dashboardStyles.insightCard}
                                >
                                    <View style={dashboardStyles.insightHeader}>
                                        <View style={[dashboardStyles.iconContainer,
                                        { backgroundColor: getInsightColor(insight.type) }]}>
                                            <Ionicons name={insight.icon} size={24} color="#fff" />
                                        </View>
                                        <Text style={dashboardStyles.insightTitle}>{insight.title}</Text>
                                    </View>

                                    {insight.type === 'progress' && (
                                        <View style={dashboardStyles.progressBar}>
                                            <View style={[dashboardStyles.progressFill, { width: `${goalProgress}%` }]} />
                                        </View>
                                    )}

                                    {insight.type === 'actions' && (
                                        <View style={dashboardStyles.actionButtons}>
                                            {Array.isArray(insight.content) && insight.content.map((action, i) => (
                                                <TouchableOpacity key={i} style={dashboardStyles.actionButton}>
                                                    <Text style={dashboardStyles.actionText}>{action}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    {insight.type === 'health' && (
                                        <View style={dashboardStyles.healthIndicator}>
                                            <Text style={dashboardStyles.healthText}>{insight.content}</Text>
                                            <Text style={dashboardStyles.healthSubtext}>{insight.subtitle}</Text>
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