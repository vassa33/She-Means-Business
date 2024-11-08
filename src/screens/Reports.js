import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
    FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import ScreenLayout from '../layouts/ScreenLayout';
import { useAppContext } from '../context/AppContext';

const Reports = () => {
    const screenWidth = Dimensions.get("window").width;
    const { setCurrentScreen } = useAppContext();
    const [selectedView, setSelectedView] = useState('daily');
    const [selectedIncomeView, setSelectedIncomeView] = useState('weekly');
    const [selectedExpenseView, setSelectedExpenseView] = useState('weekly');
    const [showTooltip, setShowTooltip] = useState({
        profitLoss: false,
        mrr: false,
        expenses: false
    });
    const [tooltipData, setTooltipData] = useState(null);

    useEffect(() => {
        setCurrentScreen('Reports');
        calculatePLSummary();
    }, [selectedView]);

    // Sample data for Profit and Loss Trend
    const profitLossData = {
        daily: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    data: [1000, 1200, 900, 300, 300, 1000, 850],
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Profit (blue)
                    strokeWidth: 2
                },
                {
                    data: [700, 200, 600, 750, 900, 700, 550],
                    color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Loss (red)
                    strokeWidth: 2
                }
            ]
        },
        weekly: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [
                {
                    data: [4500, 5000, 1300, 5200],
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Profit (blue)
                    strokeWidth: 2
                },
                {
                    data: [1500, 6000, 3200, 3600],
                    color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Loss (red)
                    strokeWidth: 2
                }
            ]
        },
        monthly: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    data: [12000, 14000, 3000, 15000, 14500, 7000, 15000, 15000, 16000, 18000, 17000, 19000],
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Profit (blue)
                    strokeWidth: 2
                },
                {
                    data: [8000, 9000, 8500, 9500, 15000, 10000, 12500, 11000, 10000, 12000, 15000, 13000],
                    color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Loss (red)
                    strokeWidth: 2
                }
            ]
        },
        yearly: {
            labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
            datasets: [
                {
                    data: [120000, 150000, 70000, 200000, 100000, 200000],
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Profit (blue)
                    strokeWidth: 2
                },
                {
                    data: [80000, 100000, 120000, 100000, 160000, 140000],
                    color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Loss (red)
                    strokeWidth: 2
                }
            ]
        }
    };

    // Sample data for Monthly Recurring Revenue (MRR) Trend
    const mrrData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                data: [3000, 7000, 5000, 10000, 13500, 16000, 15000, 7000, 20000, 18000, 22000, 20000],
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // MRR (blue)
                strokeWidth: 2
            }
        ]
    };

    // Sample Income Breakdown data
    const [incomeBreakdown] = useState([
        { category: 'Subscriptions', amount: 150000, weekly: 30000, monthly: 50000, yearly: 150000 },
        { category: 'One-time Sales', amount: 50000, weekly: 10000, monthly: 20000, yearly: 50000 },
        { category: 'Consulting', amount: 25000, weekly: 5000, monthly: 10000, yearly: 25000 },
        { category: 'Other', amount: 10000, weekly: 2000, monthly: 5000, yearly: 10000 }
    ]);

    // Sample Expense Breakdown data
    const [expenseBreakdown] = useState([
        { category: 'Rent', amount: 20000, weekly: 4000, monthly: 6666.67, yearly: 20000 },
        { category: 'Payroll', amount: 50000, weekly: 10000, monthly: 16666.67, yearly: 50000 },
        { category: 'Utilities', amount: 10000, weekly: 2000, monthly: 3333.33, yearly: 10000 },
        { category: 'Marketing', amount: 15000, weekly: 3000, monthly: 5000, yearly: 15000 },
        { category: 'Other', amount: 45000, weekly: 9000, monthly: 15000, yearly: 45000 }
    ]);

    // Sample P&L Summary data
    const [plSummary, setPLSummary] = useState({
        totalRevenue: 0,
        totalExpenses: 0,
        netProfit: 0,
        profitMargin: 0
    });

    const calculatePLSummary = () => {
        const currentData = profitLossData[selectedView];
        const totalRevenue = currentData.datasets[0].data.reduce((a, b) => a + b, 0);
        const totalExpenses = currentData.datasets[1].data.reduce((a, b) => a + b, 0);
        const netProfit = totalRevenue - totalExpenses;
        const profitMargin = (netProfit / totalRevenue) * 100;

        setPLSummary({
            totalRevenue,
            totalExpenses,
            netProfit,
            profitMargin: profitMargin.toFixed(2)
        });
    };

    const toggleView = (view) => {
        setSelectedView(view);
    };

    const graphToggleTooltip = (type, data) => {
        setTooltipData(data);
        setShowTooltip({ ...showTooltip, [type]: !showTooltip[type] });
    };

    const summaryToggleTooltip = () => {
        setShowTooltip({ ...showTooltip, summary: !showTooltip.summary });
    };

    const incomeToggleTooltip = () => {
        setShowTooltip({ ...showTooltip, income: !showTooltip.income });
    };

    const expenseToggleTooltip = () => {
        setShowTooltip({ ...showTooltip, expenses: !showTooltip.expenses });
    };

    const mrrToggleTooltip = () => {
        setShowTooltip({ ...showTooltip, mrr: !showTooltip.mrr });
    };

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#007AFF"
        },
        yAxisInterval: 1,
        scrollEnabled: true, // Enable horizontal scrolling
        xLabelsOffset: 5, // Adjust the offset for slanted x-axis labels
        xAxisStyle: {
            rotation: -45,
            fontSize: 10,
        }
    };

    const screenHeaderProps = {
        title: "Financial Reports"
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#fff"
                    translucent={true}
                />
                <ScreenLayout headerProps={screenHeaderProps}>
                    <View style={styles.container}>
                        <ScrollView style={styles.content}>
                            {/* Profit and Loss Trend Graph */}
                            <View style={styles.sectionContainer}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Profit and Loss Trend</Text>
                                    <TouchableOpacity style={styles.chartTooltipIcon} onPress={() => graphToggleTooltip('profitLoss')}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.profitLoss && (
                                            <View style={[styles.chartTooltip, styles.elevatedTooltip]}>
                                                <Text style={styles.chartTooltipTitle}>Profit and Loss Trend</Text>
                                                <Text style={styles.chartTooltipText}>
                                                    The Profit and Loss Trend graph shows your monthly revenue and expenses,
                                                    allowing you to visualize your company's financial performance over time.
                                                    Profit is displayed in blue, and loss is shown in red.
                                                    Use the toggle buttons to switch between daily, weekly, monthly, and yearly views.
                                                    Click on data points to view the corresponding profit and loss values.
                                                    This graph helps you identify periods of strong performance, as well as areas
                                                    where you may need to focus on cost-cutting or revenue generation.
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.chartContainer}>
                                    <View style={styles.chartViewButtons}>
                                        <TouchableOpacity
                                            style={[
                                                styles.chartViewButton,
                                                selectedView === 'daily' && { backgroundColor: '#81b0ff' }
                                            ]}
                                            onPress={() => toggleView('daily')}
                                        >
                                            <Text
                                                style={[
                                                    styles.chartViewButtonText,
                                                    selectedView === 'daily' && { color: '#007AFF' }
                                                ]}
                                            >
                                                Daily
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.chartViewButton,
                                                selectedView === 'weekly' && { backgroundColor: '#81b0ff' }
                                            ]}
                                            onPress={() => toggleView('weekly')}
                                        >
                                            <Text
                                                style={[
                                                    styles.chartViewButtonText,
                                                    selectedView === 'weekly' && { color: '#007AFF' }
                                                ]}
                                            >
                                                Weekly
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.chartViewButton,
                                                selectedView === 'monthly' && { backgroundColor: '#81b0ff' }
                                            ]}
                                            onPress={() => toggleView('monthly')}
                                        >
                                            <Text
                                                style={[
                                                    styles.chartViewButtonText,
                                                    selectedView === 'monthly' && { color: '#007AFF' }
                                                ]}
                                            >
                                                Monthly
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.chartViewButton,
                                                selectedView === 'yearly' && { backgroundColor: '#81b0ff' }
                                            ]}
                                            onPress={() => toggleView('yearly')}
                                        >
                                            <Text
                                                style={[
                                                    styles.chartViewButtonText,
                                                    selectedView === 'yearly' && { color: '#007AFF' }
                                                ]}
                                            >
                                                Yearly
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <LineChart
                                        data={{
                                            labels: profitLossData[selectedView].labels,
                                            datasets: profitLossData[selectedView].datasets
                                        }}
                                        width={screenWidth - 40}
                                        height={300}
                                        chartConfig={{
                                            ...chartConfig,
                                            xLabelsOffset: 10, // Adjust the offset for slanted x-axis labels
                                            xAxisStyle: {
                                                rotation: -45,
                                                fontSize: 10,
                                            }
                                        }}
                                        bezier
                                        withDots
                                        fromZero
                                        // onDataPointClick={(data) => graphToggleTooltip('profitLoss', data)}
                                        scrollableDotFill="#dfe6e9"
                                        scrollableInfoViewStyle={{ height: 120 }}
                                    />
                                    {showTooltip.profitLoss && tooltipData && (
                                        <View style={[styles.chartTooltip, styles.elevatedTooltip]}>
                                            <Text style={styles.chartTooltipTitle}>Profit and Loss Details</Text>
                                            <Text style={styles.chartTooltipText}>
                                                {selectedView === 'daily'
                                                    ? `${tooltipData.dayLabel}: Profit Ksh ${tooltipData.profit.toLocaleString()}, Loss Ksh ${tooltipData.loss.toLocaleString()}`
                                                    : `${tooltipData.label}: Profit Ksh ${tooltipData.profit.toLocaleString()}, Loss Ksh ${tooltipData.loss.toLocaleString()}`}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* P&L Summary */}
                            <View style={styles.sectionContainer}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>P&L Summary</Text>
                                    <TouchableOpacity style={styles.chartTooltipIcon} onPress={summaryToggleTooltip}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.summary && (
                                            <View style={[styles.chartTooltip, styles.elevatedTooltip]}>
                                                <Text style={styles.chartTooltipTitle}>P&L Summary</Text>
                                                <Text style={styles.chartTooltipText}>
                                                    The P&L Summary provides a high-level overview of your company's financial performance.
                                                    It shows your total revenue, total expenses, net profit, and profit margin for the selected time period.
                                                    Use this information to identify areas for cost savings or opportunities for revenue growth.
                                                    For example, if your profit margin is low, you may need to focus on increasing your prices or reducing your expenses.
                                                    Conversely, if your net profit is high, you could consider reinvesting in your business or distributing dividends to your shareholders.
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.summaryContainer}>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Total Revenue:</Text>
                                        <Text style={styles.summaryValue}>
                                            Ksh {plSummary.totalRevenue.toLocaleString()}
                                        </Text>
                                    </View>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Total Expenses:</Text>
                                        <Text style={styles.summaryValue}>Ksh {plSummary.totalExpenses.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.summaryItem}>
                                        <Text style={styles.summaryLabel}>Net Profit:</Text>
                                        <Text style={[styles.summaryValue, { color: plSummary.totalExpenses > plSummary.totalRevenue ? '#FF6B6B' : '#4CAF50' }]}>
                                            Ksh {plSummary.netProfit.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Income Breakdown */}
                            <View style={styles.sectionContainer}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Income Breakdown</Text>
                                    <TouchableOpacity style={styles.chartTooltipIcon} onPress={incomeToggleTooltip}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.income && (
                                            <View style={[styles.chartTooltip, styles.elevatedTooltip]}>
                                                <Text style={styles.chartTooltipTitle}>Income Breakdown</Text>
                                                <Text style={styles.chartTooltipText}>
                                                    The Income Breakdown shows the different sources of your business revenue, such as subscriptions, one-time sales, and consulting.
                                                    This information helps you understand the relative contributions of each revenue stream and identify opportunities for growth.
                                                    For example, if a significant portion of your income comes from one-time sales, you may want to focus on building a more stable, subscription-based revenue model.
                                                    Alternatively, if a particular service or product line is generating a lot of revenue, you could consider expanding that part of your business.
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.chartViewButtons}>
                                    <TouchableOpacity
                                        style={[
                                            styles.chartViewButton,
                                            selectedIncomeView === 'weekly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedIncomeView('weekly')}
                                    >
                                        <Text style={[
                                            styles.chartViewButtonText,
                                            selectedIncomeView === 'weekly' && { color: '#007AFF' }
                                        ]}>
                                            Weekly
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.chartViewButton,
                                            selectedIncomeView === 'monthly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedIncomeView('monthly')}
                                    >
                                        <Text style={[
                                            styles.chartViewButtonText,
                                            selectedIncomeView === 'monthly' && { color: '#007AFF' }
                                        ]}>
                                            Monthly
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.chartViewButton,
                                            selectedIncomeView === 'yearly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedIncomeView('yearly')}
                                    >
                                        <Text style={[
                                            styles.chartViewButtonText,
                                            selectedIncomeView === 'yearly' && { color: '#007AFF' }
                                        ]}>
                                            Yearly
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.summaryContainer}>
                                    {incomeBreakdown.map((item) => (
                                        <View key={item.category} style={styles.summaryItem}>
                                            <Text style={styles.summaryLabel}>{item.category}</Text>
                                            <Text style={styles.summaryValue}>
                                                Ksh {(item[selectedIncomeView] || 0).toLocaleString()}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Expense Breakdown */}
                            <View style={styles.sectionContainer}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Expense Breakdown</Text>
                                    <TouchableOpacity style={styles.chartTooltipIcon} onPress={expenseToggleTooltip}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.expenses && (
                                            <View style={[styles.chartTooltip, styles.elevatedTooltip]}>
                                                <Text style={styles.chartTooltipTitle}>Expense Breakdown</Text>
                                                <Text style={styles.chartTooltipText}>
                                                    The Expense Breakdown shows the different categories of your business expenses, such as rent, payroll, and marketing.
                                                    This information helps you identify areas where you may be able to cut costs or find more efficient ways of operating.
                                                    For example, if your rent is a significant portion of your expenses, you could look into options like co-working spaces or negotiating with your landlord.
                                                    Alternatively, if your payroll costs are high, you could explore ways to improve productivity or outsource certain tasks.
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.chartViewButtons}>
                                    <TouchableOpacity
                                        style={[
                                            styles.chartViewButton,
                                            selectedExpenseView === 'weekly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedExpenseView('weekly')}
                                    >
                                        <Text style={[
                                            styles.chartViewButtonText,
                                            selectedExpenseView === 'weekly' && { color: '#007AFF' }
                                        ]}>
                                            Weekly
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.chartViewButton,
                                            selectedExpenseView === 'monthly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedExpenseView('monthly')}
                                    >
                                        <Text style={[
                                            styles.chartViewButtonText,
                                            selectedExpenseView === 'monthly' && { color: '#007AFF' }
                                        ]}>
                                            Monthly
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.chartViewButton,
                                            selectedExpenseView === 'yearly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedExpenseView('yearly')}
                                    >
                                        <Text style={[
                                            styles.chartViewButtonText,
                                            selectedExpenseView === 'yearly' && { color: '#007AFF' }
                                        ]}>
                                            Yearly
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.summaryContainer}>
                                    {expenseBreakdown.map((item) => (
                                        <View key={item.category} style={styles.summaryItem}>
                                            <Text style={styles.summaryLabel}>{item.category}</Text>
                                            <Text style={styles.summaryValue}>
                                                Ksh {(item[selectedExpenseView] || 0).toLocaleString()}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Monthly Recurring Revenue (MRR) Trend */}
                            <View style={styles.sectionContainer}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Monthly Recurring Revenue (MRR) Trend</Text>
                                    <TouchableOpacity style={styles.chartTooltipIcon} onPress={mrrToggleTooltip}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.mrr && (
                                            <View style={[styles.chartTooltip, styles.elevatedTooltip]}>
                                                <Text style={styles.chartTooltipTitle}>Monthly Recurring Revenue (MRR) Trend</Text>
                                                <Text style={styles.chartTooltipText}>
                                                    The Monthly Recurring Revenue (MRR) Trend graph shows your monthly recurring revenue over time.
                                                    This metric is crucial for understanding the stability and growth of your subscription-based business.
                                                    Monitoring your MRR trend can help you identify any changes in your customer retention or subscription pricing, which can inform your business decisions.
                                                    For example, a steady increase in MRR might indicate that your product or service is resonating well with your target market, while a decline could signal the need to revisit your pricing or customer engagement strategies.
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.chartContainer}>
                                    <LineChart
                                        data={{
                                            labels: mrrData.labels,
                                            datasets: mrrData.datasets
                                        }}
                                        width={screenWidth - 40}
                                        height={300}
                                        chartConfig={chartConfig}
                                        bezier
                                        withDots
                                        fromZero
                                        onDataPointClick={(data) => graphToggleTooltip('mrr', data)}
                                    />
                                    {showTooltip.mrr && tooltipData && (
                                        <View style={styles.chartTooltip}>
                                            <Text style={styles.chartTooltipText}>
                                                {tooltipData.label}: Ksh {tooltipData.value.toLocaleString()}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Generate Report Button */}
                            <TouchableOpacity style={[styles.generateButton, { backgroundColor: '#007AFF' }]}>
                                <Text style={styles.generateButtonText}>Generate Report</Text>
                            </TouchableOpacity>

                            {/* Export Options */}
                            <View style={styles.exportContainer}>
                                <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#f0f0f0' }]}>
                                    <Text style={[styles.exportButtonText, { color: '#007AFF' }]}>Export PDF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.exportButton, { backgroundColor: '#f0f0f0' }]}>
                                    <Text style={[styles.exportButtonText, { color: '#007AFF' }]}>Export CSV</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
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
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    chartContainer: {
        position: 'relative',
        overflow: 'visible',
    },
    scrollableInfoViewContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
    },
    scrollableInfoViewText: {
        fontSize: 14,
        color: '#7F7F7F',
    },
    chartViewButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    chartViewButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    chartViewButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#767577',
    },
    chartTooltipIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    chartTooltip: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 280,
    },
    chartTooltipText: {
        fontSize: 14,
        color: '#7F7F7F',
    },
    elevatedTooltip: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    chartTooltipTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8
    },
    summaryContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
        //fontWeight: 'bold',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666'
    },
    generateButton: {
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
        marginBottom: 42,
    },
    exportButton: {
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    exportButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    expenseCategory: {
        fontSize: 16,
        color: '#7F7F7F'
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    breakdownContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    breakdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    breakdownCategory: {
        fontSize: 16,
        color: '#7F7F7F'
    },
    breakdownAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'
    },
    breakdownPeriodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    breakdownPeriodItem: {
        alignItems: 'center',
    },
    breakdownPeriodLabel: {
        fontSize: 14,
        color: '#7F7F7F'
    },
    breakdownPeriodValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    profitMargin: {
        color: '#20B2AA' // Light Sea Green for profit margin
    }
});

export default Reports;