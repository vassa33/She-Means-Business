// screens/Dashboard.js
import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAppContext } from '../context/AppContext';
import ScreenLayout from '../layouts/ScreenLayout';

const Dashboard = () => {
    const { profileData, setCurrentScreen } = useAppContext();
    const screenWidth = Dimensions.get("window").width;

    useEffect(() => {
        setCurrentScreen('Dashboard');
    }, []);

    // Sample data for the financial overview chart
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
            {
                data: [5000, 10000, 7500, 12000, 9000],
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                strokeWidth: 2
            }
        ],
        legend: ["Financial Overview"]
    };

    const quickAccessItems = [
        {
            title: 'Business Start Date',
            content: 'January 1, 2020',
            icon: 'calendar-outline'
        },
        {
            title: 'Sales Overview',
            content: 'Total Sales: Ksh 1,200,000',
            icon: 'cash-outline'
        },
        {
            title: 'P&L Summary',
            content: ['Net Profit: Ksh 400,000', 'Expenses: Ksh 800,000'],
            icon: 'stats-chart-outline'
        }
    ];

    const screenHeaderProps = {
        title: "Dashboard"
    };

    return (
        <ScreenLayout headerProps={screenHeaderProps}>
            <ScrollView style={styles.content}>
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.businessName}>{profileData.business}</Text>
                </View>

                {/* Financial Wellbeing Chart */}
                <View style={styles.chartContainer}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.sectionHeader}>Financial Wellbeing</Text>
                        <TouchableOpacity style={styles.chartOptionsButton}>
                            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                    <LineChart
                        data={data}
                        width={screenWidth - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#007AFF"
                            }
                        }}
                        bezier
                        style={styles.chart}
                    />
                </View>

                {/* Quick Access Sections */}
                <View style={styles.quickAccessContainer}>
                    {quickAccessItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.section}
                            onPress={() => {/* Handle section press */ }}
                        >
                            <View style={styles.sectionIconContainer}>
                                <Ionicons name={item.icon} size={24} color="#007AFF" />
                            </View>
                            <View style={styles.sectionContent}>
                                <Text style={styles.sectionHeader}>{item.title}</Text>
                                {Array.isArray(item.content) ? (
                                    item.content.map((text, i) => (
                                        <Text key={i} style={styles.sectionText}>{text}</Text>
                                    ))
                                ) : (
                                    <Text style={styles.sectionText}>{item.content}</Text>
                                )}
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
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
    chartContainer: {
        padding: 20,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    chartOptionsButton: {
        padding: 5,
    },
    chart: {
        marginVertical: 10,
        borderRadius: 16,
    },
    quickAccessContainer: {
        padding: 20,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    sectionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    sectionContent: {
        flex: 1,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    sectionText: {
        fontSize: 14,
        color: '#666',
    },
});

export default Dashboard;