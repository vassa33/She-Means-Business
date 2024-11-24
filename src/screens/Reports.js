import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import ScreenLayout from '../layouts/ScreenLayout';
import { useAppContext } from '../contexts/AppContext';
import ReportStyles from '../styles/ReportStyles';
import { useInternalData } from '../contexts/InternalDataContext';
import FinancialReportService from '../service/FinancialReportService';


const Reports = () => {
    const screenWidth = Dimensions.get("window").width;
    const { setCurrentScreen } = useAppContext();
    const [selectedIncomeView, setSelectedIncomeView] = useState('weekly');
    const [selectedExpenseView, setSelectedExpenseView] = useState('weekly');
    const [showTooltip, setShowTooltip] = useState({
        profitLoss: false,
        mrr: false,
        expenses: false
    });
    const [tooltipData, setTooltipData] = useState(null);

    const {
        selectedView,
        setSelectedView,
        financialData,
        fetchFinancialData
    } = useInternalData();

    const [financialReportData, setFinancialReportData] = useState(null);
    const [reportService, setReportService] = useState(null);

    useEffect(() => {
        // Fetch financial data
        const initializeReportService = async () => {
            try {
                const data = financialData || await fetchFinancialData();

                // Ensure data is set before creating service
                if (data) {
                    setFinancialReportData(data);
                    setReportService(new FinancialReportService(data));
                } else {
                    throw new Error('No financial data available');
                }
            } catch (error) {
                console.error('Initialization error:', error);
                Alert.alert('Error', 'Could not initialize financial report service');
            }
        };

        initializeReportService();
    }, []);

    useEffect(() => {
        setCurrentScreen('Reports');
        calculatePLSummary();
    }, [selectedView]);

    const handleGenerateReport = async () => {
        try {
            if (!reportService) {
                throw new Error('Report service not initialized');
            }

            const report = await reportService.generateReport();

            Alert.alert(
                'Report Generated',
                'Your financial report has been successfully created.'
            );

            return report;
        } catch (error) {
            Alert.alert(
                'Error',
                'Unable to generate report. Please try again.'
            );
        }
    };

    const handleExportPDF = async () => {
        try {
            const report = await handleGenerateReport();
            if (report && reportService) {
                await reportService.exportToPDF(report);

                Alert.alert(
                    'PDF Exported',
                    'Your financial report PDF has been successfully exported.'
                );
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'An unexpected error occurred while exporting PDF.'
            );
        }
    };

    const handleDownloadPDF = async () => {
        try {
            if (!reportService) {
                throw new Error('Report service not initialized');
            }

            const fileUri = await reportService.downloadPDF();

            Alert.alert(
                'PDF Downloaded',
                'Your financial report has been saved to your device.',
                [
                    {
                        text: 'Open',
                        onPress: () => Linking.openURL(fileUri)
                    },
                    { text: 'OK' }
                ]
            );
        } catch (error) {
            Alert.alert(
                'Download Failed',
                'Unable to download the PDF. Please try again.'
            );
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
        const currentData = financialData.profitLoss[selectedView];
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
        <SafeAreaView style={ReportStyles.safeArea}>
            <>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#fff"
                    translucent={true}
                />
                <ScreenLayout headerProps={screenHeaderProps}>
                    <View style={ReportStyles.container}>
                        <ScrollView style={ReportStyles.content}>
                            {/* Profit and Loss Trend Graph */}
                            <View style={ReportStyles.sectionContainer}>
                                <View style={ReportStyles.sectionHeader}>
                                    <Text style={ReportStyles.sectionTitle}>Profit and Loss Trend</Text>
                                    <TouchableOpacity style={ReportStyles.chartTooltipIcon} onPress={() => graphToggleTooltip('profitLoss')}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.profitLoss && (
                                            <View style={[ReportStyles.chartTooltip, ReportStyles.elevatedTooltip]}>
                                                <Text style={ReportStyles.chartTooltipTitle}>Profit and Loss Trend</Text>
                                                <Text style={ReportStyles.chartTooltipText}>
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
                                <View style={ReportStyles.chartContainer}>
                                    <View style={ReportStyles.chartViewButtons}>
                                        <TouchableOpacity
                                            style={[
                                                ReportStyles.chartViewButton,
                                                selectedView === 'daily' && { backgroundColor: '#81b0ff' }
                                            ]}
                                            onPress={() => toggleView('daily')}
                                        >
                                            <Text
                                                style={[
                                                    ReportStyles.chartViewButtonText,
                                                    selectedView === 'daily' && { color: '#007AFF' }
                                                ]}
                                            >
                                                Daily
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                ReportStyles.chartViewButton,
                                                selectedView === 'weekly' && { backgroundColor: '#81b0ff' }
                                            ]}
                                            onPress={() => toggleView('weekly')}
                                        >
                                            <Text
                                                style={[
                                                    ReportStyles.chartViewButtonText,
                                                    selectedView === 'weekly' && { color: '#007AFF' }
                                                ]}
                                            >
                                                Weekly
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                ReportStyles.chartViewButton,
                                                selectedView === 'monthly' && { backgroundColor: '#81b0ff' }
                                            ]}
                                            onPress={() => toggleView('monthly')}
                                        >
                                            <Text
                                                style={[
                                                    ReportStyles.chartViewButtonText,
                                                    selectedView === 'monthly' && { color: '#007AFF' }
                                                ]}
                                            >
                                                Monthly
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                ReportStyles.chartViewButton,
                                                selectedView === 'yearly' && { backgroundColor: '#81b0ff' }
                                            ]}
                                            onPress={() => toggleView('yearly')}
                                        >
                                            <Text
                                                style={[
                                                    ReportStyles.chartViewButtonText,
                                                    selectedView === 'yearly' && { color: '#007AFF' }
                                                ]}
                                            >
                                                Yearly
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <LineChart
                                        data={{
                                            labels: financialData.profitLoss[selectedView].labels,
                                            datasets: financialData.profitLoss[selectedView].datasets
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
                                        <View style={[ReportStyles.chartTooltip, ReportStyles.elevatedTooltip]}>
                                            <Text style={ReportStyles.chartTooltipTitle}>Profit and Loss Details</Text>
                                            <Text style={ReportStyles.chartTooltipText}>
                                                {selectedView === 'daily'
                                                    ? `${tooltipData.dayLabel}: Profit Ksh ${tooltipData.profit.toLocaleString()}, Loss Ksh ${tooltipData.loss.toLocaleString()}`
                                                    : `${tooltipData.label}: Profit Ksh ${tooltipData.profit.toLocaleString()}, Loss Ksh ${tooltipData.loss.toLocaleString()}`}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* P&L Summary */}
                            <View style={ReportStyles.sectionContainer}>
                                <View style={ReportStyles.sectionHeader}>
                                    <Text style={ReportStyles.sectionTitle}>P&L Summary</Text>
                                    <TouchableOpacity style={ReportStyles.chartTooltipIcon} onPress={summaryToggleTooltip}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.summary && (
                                            <View style={[ReportStyles.chartTooltip, ReportStyles.elevatedTooltip]}>
                                                <Text style={ReportStyles.chartTooltipTitle}>P&L Summary</Text>
                                                <Text style={ReportStyles.chartTooltipText}>
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
                                <View style={ReportStyles.summaryContainer}>
                                    <View style={ReportStyles.summaryItem}>
                                        <Text style={ReportStyles.summaryLabel}>Total Revenue:</Text>
                                        <Text style={ReportStyles.summaryValue}>
                                            Ksh {plSummary.totalRevenue.toLocaleString()}
                                        </Text>
                                    </View>
                                    <View style={ReportStyles.summaryItem}>
                                        <Text style={ReportStyles.summaryLabel}>Total Expenses:</Text>
                                        <Text style={ReportStyles.summaryValue}>Ksh {plSummary.totalExpenses.toLocaleString()}</Text>
                                    </View>
                                    <View style={ReportStyles.summaryItem}>
                                        <Text style={ReportStyles.summaryLabel}>Net Profit:</Text>
                                        <Text style={[ReportStyles.summaryValue, { color: plSummary.totalExpenses > plSummary.totalRevenue ? '#FF6B6B' : '#4CAF50' }]}>
                                            Ksh {plSummary.netProfit.toLocaleString()}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Income Breakdown */}
                            <View style={ReportStyles.sectionContainer}>
                                <View style={ReportStyles.sectionHeader}>
                                    <Text style={ReportStyles.sectionTitle}>Income Breakdown</Text>
                                    <TouchableOpacity style={ReportStyles.chartTooltipIcon} onPress={incomeToggleTooltip}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.income && (
                                            <View style={[ReportStyles.chartTooltip, ReportStyles.elevatedTooltip]}>
                                                <Text style={ReportStyles.chartTooltipTitle}>Income Breakdown</Text>
                                                <Text style={ReportStyles.chartTooltipText}>
                                                    The Income Breakdown shows the different sources of your business revenue, such as subscriptions, one-time sales, and consulting.
                                                    This information helps you understand the relative contributions of each revenue stream and identify opportunities for growth.
                                                    For example, if a significant portion of your income comes from one-time sales, you may want to focus on building a more stable, subscription-based revenue model.
                                                    Alternatively, if a particular service or product line is generating a lot of revenue, you could consider expanding that part of your business.
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={ReportStyles.chartViewButtons}>
                                    <TouchableOpacity
                                        style={[
                                            ReportStyles.chartViewButton,
                                            selectedIncomeView === 'weekly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedIncomeView('weekly')}
                                    >
                                        <Text style={[
                                            ReportStyles.chartViewButtonText,
                                            selectedIncomeView === 'weekly' && { color: '#007AFF' }
                                        ]}>
                                            Weekly
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            ReportStyles.chartViewButton,
                                            selectedIncomeView === 'monthly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedIncomeView('monthly')}
                                    >
                                        <Text style={[
                                            ReportStyles.chartViewButtonText,
                                            selectedIncomeView === 'monthly' && { color: '#007AFF' }
                                        ]}>
                                            Monthly
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            ReportStyles.chartViewButton,
                                            selectedIncomeView === 'yearly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedIncomeView('yearly')}
                                    >
                                        <Text style={[
                                            ReportStyles.chartViewButtonText,
                                            selectedIncomeView === 'yearly' && { color: '#007AFF' }
                                        ]}>
                                            Yearly
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={ReportStyles.summaryContainer}>
                                    {incomeBreakdown.map((item) => (
                                        <View key={item.category} style={ReportStyles.summaryItem}>
                                            <Text style={ReportStyles.summaryLabel}>{item.category}</Text>
                                            <Text style={ReportStyles.summaryValue}>
                                                Ksh {(item[selectedIncomeView] || 0).toLocaleString()}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Expense Breakdown */}
                            <View style={ReportStyles.sectionContainer}>
                                <View style={ReportStyles.sectionHeader}>
                                    <Text style={ReportStyles.sectionTitle}>Expense Breakdown</Text>
                                    <TouchableOpacity style={ReportStyles.chartTooltipIcon} onPress={expenseToggleTooltip}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.expenses && (
                                            <View style={[ReportStyles.chartTooltip, ReportStyles.elevatedTooltip]}>
                                                <Text style={ReportStyles.chartTooltipTitle}>Expense Breakdown</Text>
                                                <Text style={ReportStyles.chartTooltipText}>
                                                    The Expense Breakdown shows the different categories of your business expenses, such as rent, payroll, and marketing.
                                                    This information helps you identify areas where you may be able to cut costs or find more efficient ways of operating.
                                                    For example, if your rent is a significant portion of your expenses, you could look into options like co-working spaces or negotiating with your landlord.
                                                    Alternatively, if your payroll costs are high, you could explore ways to improve productivity or outsource certain tasks.
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={ReportStyles.chartViewButtons}>
                                    <TouchableOpacity
                                        style={[
                                            ReportStyles.chartViewButton,
                                            selectedExpenseView === 'weekly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedExpenseView('weekly')}
                                    >
                                        <Text style={[
                                            ReportStyles.chartViewButtonText,
                                            selectedExpenseView === 'weekly' && { color: '#007AFF' }
                                        ]}>
                                            Weekly
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            ReportStyles.chartViewButton,
                                            selectedExpenseView === 'monthly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedExpenseView('monthly')}
                                    >
                                        <Text style={[
                                            ReportStyles.chartViewButtonText,
                                            selectedExpenseView === 'monthly' && { color: '#007AFF' }
                                        ]}>
                                            Monthly
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            ReportStyles.chartViewButton,
                                            selectedExpenseView === 'yearly' && { backgroundColor: '#81b0ff' }
                                        ]}
                                        onPress={() => setSelectedExpenseView('yearly')}
                                    >
                                        <Text style={[
                                            ReportStyles.chartViewButtonText,
                                            selectedExpenseView === 'yearly' && { color: '#007AFF' }
                                        ]}>
                                            Yearly
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={ReportStyles.summaryContainer}>
                                    {expenseBreakdown.map((item) => (
                                        <View key={item.category} style={ReportStyles.summaryItem}>
                                            <Text style={ReportStyles.summaryLabel}>{item.category}</Text>
                                            <Text style={ReportStyles.summaryValue}>
                                                Ksh {(item[selectedExpenseView] || 0).toLocaleString()}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Monthly Recurring Revenue (MRR) Trend */}
                            <View style={ReportStyles.sectionContainer}>
                                <View style={ReportStyles.sectionHeader}>
                                    <Text style={ReportStyles.sectionTitle}>Monthly Recurring Revenue (MRR) Trend</Text>
                                    <TouchableOpacity style={ReportStyles.chartTooltipIcon} onPress={mrrToggleTooltip}>
                                        <Ionicons name="information-circle-outline" size={18} color="#7F7F7F" />
                                        {showTooltip.mrr && (
                                            <View style={[ReportStyles.chartTooltip, ReportStyles.elevatedTooltip]}>
                                                <Text style={ReportStyles.chartTooltipTitle}>Monthly Recurring Revenue (MRR) Trend</Text>
                                                <Text style={ReportStyles.chartTooltipText}>
                                                    The Monthly Recurring Revenue (MRR) Trend graph shows your monthly recurring revenue over time.
                                                    This metric is crucial for understanding the stability and growth of your subscription-based business.
                                                    Monitoring your MRR trend can help you identify any changes in your customer retention or subscription pricing, which can inform your business decisions.
                                                    For example, a steady increase in MRR might indicate that your product or service is resonating well with your target market, while a decline could signal the need to revisit your pricing or customer engagement strategies.
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <View style={ReportStyles.chartContainer}>
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
                                        <View style={ReportStyles.chartTooltip}>
                                            <Text style={ReportStyles.chartTooltipText}>
                                                {tooltipData.label}: Ksh {tooltipData.value.toLocaleString()}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Generate Report Button */}
                            <TouchableOpacity
                                style={[ReportStyles.generateButton, { backgroundColor: '#007AFF' }]}
                                onPress={handleGenerateReport}
                            >
                                <Text style={ReportStyles.generateButtonText}>Generate Report</Text>
                            </TouchableOpacity>

                            {/* Export Options */}
                            <View style={ReportStyles.exportContainer}>
                                <TouchableOpacity
                                    style={[ReportStyles.exportButton, { backgroundColor: '#f0f0f0' }]}
                                    onPress={handleExportPDF}
                                >
                                    <Text style={[ReportStyles.exportButtonText, { color: '#007AFF' }]}>Export PDF</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[ReportStyles.exportButton, { backgroundColor: '#f0f0f0' }]}
                                    onPress={handleDownloadPDF}
                                >
                                    <Text style={[ReportStyles.exportButtonText, { color: '#007AFF' }]}>Download PDF</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </ScreenLayout>
            </>
        </SafeAreaView>
    );
};

export default Reports;