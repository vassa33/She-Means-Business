import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import ScreenLayout from '../layouts/ScreenLayout';

const CashFlow = () => {
    const screenWidth = Dimensions.get("window").width;

    const [cashFlowData] = useState([
        { id: '1', date: '2023-10-01', inflows: 10000, outflows: 8000 },
        { id: '2', date: '2023-10-02', inflows: 12000, outflows: 7500 },
        { id: '3', date: '2023-10-03', inflows: 9000, outflows: 8500 },
        { id: '4', date: '2023-10-04', inflows: 11000, outflows: 7000 },
        { id: '5', date: '2023-10-05', inflows: 13000, outflows: 9000 },
        { id: '6', date: '2023-10-06', inflows: 10500, outflows: 8200 },
        { id: '7', date: '2023-10-07', inflows: 11500, outflows: 7800 },
    ]);

    const netCashFlowData = {
        labels: cashFlowData.map(item => item.date.slice(-2)),
        datasets: [
            {
                data: cashFlowData.map(item => item.inflows - item.outflows),
                color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
                strokeWidth: 2
            }
        ],
        legend: ["Net Cash Flow"]
    };

    const inflowOutflowData = {
        labels: cashFlowData.map(item => item.date.slice(-2)),
        datasets: [
            {
                data: cashFlowData.map(item => item.inflows),
                color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
            },
            {
                data: cashFlowData.map(item => item.outflows),
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
            }
        ],
        legend: ["Inflows", "Outflows"]
    };

    const calculateTotals = () => {
        return cashFlowData.reduce((acc, curr) => {
            acc.totalInflows += curr.inflows;
            acc.totalOutflows += curr.outflows;
            return acc;
        }, { totalInflows: 0, totalOutflows: 0 });
    };

    const { totalInflows, totalOutflows } = calculateTotals();
    const netCashFlow = totalInflows - totalOutflows;

    const screenHeaderProps = {
        title: "Cash Flow Analysis"
    };

    return (
        <ScreenLayout headerProps={screenHeaderProps}>
            <View style={styles.container}>
                <ScrollView style={styles.content}>
                    {/* Net Cash Flow Summary */}
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Net Cash Flow</Text>
                        <Text style={[styles.summaryAmount, { color: netCashFlow >= 0 ? 'green' : 'red' }]}>
                            Ksh {netCashFlow.toLocaleString()}
                        </Text>
                    </View>

                    {/* Cash Flow Components */}
                    <View style={styles.componentsContainer}>
                        <View style={styles.componentItem}>
                            <Text style={styles.componentLabel}>Total Inflows:</Text>
                            <Text style={styles.componentValue}>Ksh {totalInflows.toLocaleString()}</Text>
                        </View>
                        <View style={styles.componentItem}>
                            <Text style={styles.componentLabel}>Total Outflows:</Text>
                            <Text style={styles.componentValue}>Ksh {totalOutflows.toLocaleString()}</Text>
                        </View>
                    </View>

                    {/* Net Cash Flow Trend Graph */}
                    <View style={styles.graphContainer}>
                        <Text style={styles.graphTitle}>Net Cash Flow Trend</Text>
                        <LineChart
                            data={netCashFlowData}
                            width={screenWidth - 60}
                            height={220}
                            chartConfig={{
                                backgroundColor: "#e26a00",
                                backgroundGradientFrom: "#fb8c00",
                                backgroundGradientTo: "#ffa726",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726"
                                }
                            }}
                            bezier
                            style={styles.chart}
                        />
                    </View>

                    {/* Cash Inflows and Outflows Graph */}
                    <View style={styles.graphContainer}>
                        <Text style={styles.graphTitle}>Cash Inflows and Outflows</Text>
                        <BarChart
                            data={inflowOutflowData}
                            width={screenWidth - 60}
                            height={220}
                            yAxisLabel="Ksh "
                            chartConfig={{
                                backgroundColor: "#e26a00",
                                backgroundGradientFrom: "#fb8c00",
                                backgroundGradientTo: "#ffa726",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                barPercentage: 0.5,
                            }}
                            style={styles.chart}
                        />
                    </View>

                    {/* Cash Flow Statement */}
                    <View style={styles.statementContainer}>
                        <Text style={styles.statementTitle}>Cash Flow Statement</Text>
                        {cashFlowData.map((item) => (
                            <View key={item.id} style={styles.statementItem}>
                                <Text style={styles.statementDate}>{item.date}</Text>
                                <View style={styles.statementDetails}>
                                    <Text style={styles.statementInflow}>+Ksh {item.inflows.toLocaleString()}</Text>
                                    <Text style={styles.statementOutflow}>-Ksh {item.outflows.toLocaleString()}</Text>
                                    <Text style={[styles.statementNet, { color: item.inflows - item.outflows >= 0 ? 'green' : 'red' }]}>
                                        Net: Ksh {(item.inflows - item.outflows).toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Cash Flow Projection Button */}
                    <TouchableOpacity style={styles.projectionButton}>
                        <Text style={styles.projectionButtonText}>Generate Cash Flow Projection</Text>
                    </TouchableOpacity>
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
    summaryContainer: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    summaryAmount: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    componentsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    componentItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        width: '48%',
    },
    componentLabel: {
        fontSize: 12,
        marginBottom: 5,
    },
    componentValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    graphContainer: {
        marginBottom: 20,
    },
    graphTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    statementContainer: {
        marginBottom: 20,
    },
    statementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    statementItem: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    statementDate: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statementDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statementInflow: {
        color: 'green',
    },
    statementOutflow: {
        color: 'red',
    },
    statementNet: {
        fontWeight: 'bold',
    },
    projectionButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    projectionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default CashFlow;