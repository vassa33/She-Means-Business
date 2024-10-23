import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import Sidebar from './Sidebar';
import ScreenLayout from '../layouts/ScreenLayout';

const Reports = () => {
    const screenWidth = Dimensions.get("window").width;

    // Sample data for Profit and Loss Trend
    const profitLossData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [
            {
                data: [3000, 2000, 5000, 3000, 4000],
                color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Green for profit
            },
            {
                data: [2000, 3000, 1000, 2000, 1000],
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for loss
            }
        ],
        legend: ["Profit", "Loss"]
    };

    // Sample P&L Summary data
    const [plSummary] = useState({
        totalRevenue: 5000,
        totalExpenses: 3500,
        netProfit: 1500,
        profitMargin: 30
    });

    const screenHeaderProps = {
        title: "Reports"
    };

    return (
        <ScreenLayout headerProps={screenHeaderProps}>
            <View style={styles.container}>
                <ScrollView style={styles.content}>
                    {/* Profit and Loss Trend Graph */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Profit and Loss Trend</Text>
                        <BarChart
                            data={profitLossData}
                            width={screenWidth - 60}
                            height={220}
                            yAxisLabel="Ksh "
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                barPercentage: 0.5,
                            }}
                            style={styles.chart}
                        />
                    </View>

                    {/* P&L Summary */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>P&L Summary</Text>
                        <View style={styles.summaryItem}>
                            <Text>Total Revenue:</Text>
                            <Text>Ksh {plSummary.totalRevenue}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text>Total Expenses:</Text>
                            <Text>Ksh {plSummary.totalExpenses}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text>Net Profit:</Text>
                            <Text>Ksh {plSummary.netProfit}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text>Profit Margin:</Text>
                            <Text>{plSummary.profitMargin}%</Text>
                        </View>
                    </View>

                    {/* Generate Report Button */}
                    <TouchableOpacity style={styles.generateButton}>
                        <Text style={styles.generateButtonText}>Generate Report</Text>
                    </TouchableOpacity>

                    {/* Export Options */}
                    <View style={styles.exportContainer}>
                        <TouchableOpacity style={styles.exportButton}>
                            <Text style={styles.exportButtonText}>Export PDF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.exportButton}>
                            <Text style={styles.exportButtonText}>Export CSV</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    generateButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    exportContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    exportButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    exportButtonText: {
        color: '#007AFF',
        fontSize: 14,
    },
});

export default Reports;