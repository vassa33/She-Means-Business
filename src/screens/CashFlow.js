import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Modal,
    Animated,
    TextInput,
    Alert,
    StatusBar,
    Platform
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import {
    TrendingUp,
    TrendingDown,
    HelpCircle,
    Calendar,
    DollarSign,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    X
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenLayout from '../layouts/ScreenLayout';
import { useAppContext } from '../context/AppContext';

// Color constants
const COLORS = {
    primary: '#007AFF',
    secondary: '#81b0ff',
    gray: '#767577',
    lightGray: '#f4f3f4',
    success: '#34C759',
    danger: '#FF3B30',
    warning: '#FF9500',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#7F7F7F',
};

// Chart configuration
const chartConfig = {
    backgroundColor: COLORS.background,
    backgroundGradientFrom: COLORS.background,
    backgroundGradientTo: COLORS.background,
    decimalPlaces: 0,
    color: (opacity = 1) => COLORS.primary,
    labelColor: (opacity = 1) => COLORS.text,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: COLORS.primary
    }
};

// Tooltip content with educational information
const tooltipContent = {
    netCashFlow: {
        title: "Understanding Net Cash Flow",
        description: "Net Cash Flow shows the difference between money coming in (revenue, investments) and going out (expenses, payments). A positive number means you're gaining money, while negative means you're spending more than earning.",
        tips: [
            "Monitor this number regularly",
            "Aim for consistent positive cash flow",
            "Plan for seasonal variations",
        ]
    },
    inflows: {
        title: "Cash Inflows",
        description: "Money coming into your business through sales, investments, and other income sources.",
        tips: [
            "Track all revenue sources",
            "Monitor payment collection",
            "Look for growth opportunities",
        ]
    },
    outflows: {
        title: "Cash Outflows",
        description: "Money leaving your business through expenses, payments, and investments.",
        tips: [
            "Control operating costs",
            "Plan major expenses",
            "Look for cost-saving opportunities",
        ]
    },
    cashFlowTrend: {
        title: "Cash Flow Trends & Patterns",
        description: "This graph shows how your money flows over time. Understanding these patterns helps you make better business decisions.",
        tips: [
            "Look for seasonal patterns",
            "Identify your peak periods",
            "Plan for slow periods",
        ]
    }
};

// Mock data generator function
const generateMockData = () => {
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    return dates.map((date, index) => ({
        id: index.toString(),
        date,
        inflows: Math.floor(Math.random() * 5000) + 8000,
        outflows: Math.floor(Math.random() * 3000) + 6000,
        category: ['Sales', 'Services', 'Online', 'Retail'][Math.floor(Math.random() * 4)]
    }));
};

const CashFlow = () => {
    const screenWidth = Dimensions.get("window").width;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cashFlowData, setCashFlowData] = useState([]);
    const [selectedTooltip, setSelectedTooltip] = useState(null);
    const tooltipFadeAnim = useState(new Animated.Value(0))[0];
    const [projectionModalVisible, setProjectionModalVisible] = useState(false);
    const [forecastPeriod, setForecastPeriod] = useState('3');
    const [growthRate, setGrowthRate] = useState('5');
    const [showProjections, setShowProjections] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'year'
    const [selectedChart, setSelectedChart] = useState('line'); // 'line', 'bar'

    const { setCurrentScreen } = useAppContext();

    useEffect(() => {
        setCurrentScreen('CashFlow');
    }, []);

    useEffect(() => {
        const fetchCashFlowData = async () => {
            try {
                setIsLoading(true);
                const data = generateMockData();
                setCashFlowData(data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load cash flow data');
                setIsLoading(false);
                Alert.alert('Error', 'Could not load cash flow information');
            }
        };

        fetchCashFlowData();
    }, []);

    // Enhanced chart data preparation with projections
    const { netCashFlowData, inflowOutflowData } = useMemo(() => {
        let dataToUse = cashFlowData;
        if (showProjections) {
            const projections = calculateProjections(cashFlowData, forecastPeriod, growthRate);
            dataToUse = [...cashFlowData, ...projections];
        }

        return {
            netCashFlowData: {
                labels: dataToUse.map(item => item.date.slice(-2)),
                datasets: [{
                    data: dataToUse.map(item => Math.max(0, item.inflows - item.outflows)),
                    color: (opacity = 1) => COLORS.success,
                    strokeWidth: 2
                }],
                legend: ["Net Cash Flow"]
            },
            inflowOutflowData: {
                labels: dataToUse.map(item => item.date.slice(-2)),
                datasets: [
                    {
                        data: dataToUse.map(item => item.inflows),
                        color: (opacity = 1) => COLORS.success,
                    },
                    {
                        data: dataToUse.map(item => item.outflows),
                        color: (opacity = 1) => COLORS.danger,
                    }
                ],
                legend: ["Inflows", "Outflows"]
            }
        };
    }, [cashFlowData, showProjections, forecastPeriod, growthRate]);

    // Enhanced totals calculation with projections
    const calculateTotals = () => {
        let dataToUse = cashFlowData;
        if (showProjections) {
            const projections = calculateProjections(cashFlowData, forecastPeriod, growthRate);
            dataToUse = [...cashFlowData, ...projections];
        }

        return dataToUse.reduce((acc, curr) => {
            acc.totalInflows += (curr.inflows || 0);
            acc.totalOutflows += (curr.outflows || 0);
            return acc;
        }, { totalInflows: 0, totalOutflows: 0 });
    };

    const { totalInflows, totalOutflows } = calculateTotals();
    const netCashFlow = totalInflows - totalOutflows;

    // Enhanced tooltip animations
    const showTooltip = (type) => {
        setSelectedTooltip(type);
        Animated.sequence([
            Animated.timing(tooltipFadeAnim, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true
            }),
            Animated.timing(tooltipFadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            })
        ]).start();
    };

    const hideTooltip = () => {
        Animated.timing(tooltipFadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start(() => setSelectedTooltip(null));
    };

    // Calculate projections based on current data and user inputs
    const calculateProjections = (baseData, months, growth) => {
        const growthRate = parseFloat(growth) / 100;
        const lastEntry = baseData[baseData.length - 1];
        const projections = [];

        for (let i = 1; i <= parseInt(months); i++) {
            const projectedInflows = lastEntry.inflows * Math.pow(1 + growthRate, i);
            const projectedOutflows = lastEntry.outflows * Math.pow(1 + (growthRate * 0.8), i); // Assuming costs grow slightly slower
            projections.push({
                id: `proj_${i}`,
                date: `Projection ${i}`,
                inflows: projectedInflows,
                outflows: projectedOutflows,
                category: 'Projected'
            });
        }

        return projections;
    };

    // Chart Type Selector Component
    const ChartTypeSelector = () => (
        <View style={styles.chartTypeSelector}>
            <TouchableOpacity
                style={[
                    styles.chartTypeButton,
                    selectedChart === 'line' && styles.chartTypeButtonActive
                ]}
                onPress={() => setSelectedChart('line')}
            >
                <Text
                    style={[
                        styles.chartTypeText,
                        selectedChart === 'line' && styles.chartTypeTextActive
                    ]}
                >
                    Line
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.chartTypeButton,
                    selectedChart === 'bar' && styles.chartTypeButtonActive
                ]}
                onPress={() => setSelectedChart('bar')}
            >
                <Text
                    style={[
                        styles.chartTypeText,
                        selectedChart === 'bar' && styles.chartTypeTextActive
                    ]}
                >
                    Bar
                </Text>
            </TouchableOpacity>
        </View>
    );

    // Projection Modal Component
    const ProjectionModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={projectionModalVisible}
            onRequestClose={() => setProjectionModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.projectionModalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.projectionModalTitle}>
                            {showProjections ? 'Update Cash Flow Forecast' : 'Generate Cash Flow Forecast'}
                        </Text>
                        <TouchableOpacity
                            onPress={() => setProjectionModalVisible(false)}
                        >
                            <X color={COLORS.text} size={24} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.inputLabel}>Forecast Period (months):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={forecastPeriod}
                            onChangeText={setForecastPeriod}
                        />
                        <Text style={styles.inputLabel}>Projected Growth Rate (%):</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={growthRate}
                            onChangeText={setGrowthRate}
                        />
                        <TouchableOpacity
                            style={styles.projectionModalButton}
                            onPress={() => {
                                setShowProjections(true);
                                setProjectionModalVisible(false);
                            }}
                        >
                            <Text style={styles.projectionModalButtonText}>
                                {showProjections ? 'Update Forecast' : 'Generate Forecast'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    // Tooltip Modal Component
    const TooltipModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={selectedTooltip !== null}
            onRequestClose={hideTooltip}
        >
            <View style={styles.tooltipOverlay}>
                <Animated.View
                    style={[
                        styles.tooltipContainer,
                        {
                            opacity: tooltipFadeAnim
                        }
                    ]}
                >
                    {selectedTooltip && (
                        <>
                            <Text style={styles.tooltipTitle}>
                                {tooltipContent[selectedTooltip].title}
                            </Text>
                            <Text style={styles.tooltipDescription}>
                                {tooltipContent[selectedTooltip].description}
                            </Text>
                            <View style={styles.tooltipTipsContainer}>
                                <Text style={styles.tooltipTipsTitle}>Tips:</Text>
                                {tooltipContent[selectedTooltip].tips.map((tip, index) => (
                                    <View key={index} style={styles.tooltipTipItem}>
                                        <HelpCircle color={COLORS.primary} size={16} />
                                        <Text style={styles.tooltipTipText}>{tip}</Text>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={styles.tooltipCloseButton}
                                onPress={hideTooltip}
                            >
                                <Text style={styles.tooltipCloseText}>Close</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );

    // Period Selector Component
    const PeriodSelector = () => (
        <View style={styles.periodSelector}>
            {['week', 'month', 'year'].map((period) => (
                <TouchableOpacity
                    key={period}
                    style={[
                        styles.periodButton,
                        selectedPeriod === period && styles.periodButtonActive
                    ]}
                    onPress={() => setSelectedPeriod(period)}
                >
                    <Text
                        style={[
                            styles.periodButtonText,
                            selectedPeriod === period && styles.periodButtonTextActive
                        ]}
                    >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor={'#fff'}
                    translucent={true}
                />
                <ScreenLayout headerProps={{ title: "Cash Flow Analysis" }}>
                    <View style={styles.container}>
                        <ScrollView style={styles.content}>
                            {/* Period Selector */}
                            <PeriodSelector />

                            {/* Summary Section */}
                            <View style={styles.summaryContainer}>
                                <View style={styles.summaryHeader}>
                                    <Text style={styles.summaryTitle}>Net Cash Flow</Text>
                                    <TouchableOpacity
                                        onPress={() => showTooltip('netCashFlow')}
                                        style={styles.helpButton}
                                    >
                                        <HelpCircle color={COLORS.primary} size={20} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={[
                                    styles.summaryAmount,
                                    { color: netCashFlow >= 0 ? COLORS.success : COLORS.danger }
                                ]}>
                                    Ksh {netCashFlow.toLocaleString()}
                                </Text>
                                {netCashFlow >= 0 ? (
                                    <View style={styles.statusIndicator}>
                                        <TrendingUp color={COLORS.success} size={16} />
                                        <Text style={[styles.statusText, { color: COLORS.success }]}>
                                            Healthy Cash Position
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.statusIndicator}>
                                        <TrendingDown color={COLORS.danger} size={16} />
                                        <Text style={[styles.statusText, { color: COLORS.danger }]}>
                                            Action Required: Review Expenses
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Components Container */}
                            <View style={styles.componentsContainer}>
                                <TouchableOpacity
                                    style={[styles.componentItem, { backgroundColor: COLORS.success + '20' }]}
                                    onPress={() => showTooltip('inflows')}
                                >
                                    <View style={styles.componentHeader}>
                                        <ArrowUpRight color={COLORS.success} size={20} />
                                        <Text style={styles.componentLabel}>Total Inflows</Text>
                                    </View>
                                    <Text style={[styles.componentValue, { color: COLORS.success }]}>
                                        Ksh {totalInflows.toLocaleString()}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.componentItem, { backgroundColor: COLORS.danger + '20' }]}
                                    onPress={() => showTooltip('outflows')}
                                >
                                    <View style={styles.componentHeader}>
                                        <ArrowDownRight color={COLORS.danger} size={20} />
                                        <Text style={styles.componentLabel}>Total Outflows</Text>
                                    </View>
                                    <Text style={[styles.componentValue, { color: COLORS.danger }]}>
                                        Ksh {totalOutflows.toLocaleString()}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Charts Section */}
                            <View style={styles.chartTypeSelector}>
                                {/* ... chart type selector ... */}
                                <ChartTypeSelector />
                            </View>
                            <View style={styles.graphContainer}>
                                <View style={styles.graphTitleContainer}>
                                    <Text style={styles.graphTitle}>Net Cash Flow Trend</Text>
                                    <TouchableOpacity
                                        onPress={() => showTooltip('cashFlowTrend')}
                                        style={styles.helpButton}
                                    >
                                        <HelpCircle color={COLORS.primary} size={20} />
                                    </TouchableOpacity>
                                </View>
                                {selectedChart === 'line' ? (
                                    <LineChart
                                        data={netCashFlowData}
                                        width={screenWidth - 40}
                                        height={220}
                                        chartConfig={chartConfig}
                                        bezier
                                        style={styles.chart}
                                        onDataPointClick={({ value }) => {
                                            Alert.alert("Cash Flow", `Net Cash Flow: Ksh ${value.toLocaleString()}`);
                                        }}
                                    />
                                ) : (
                                    <BarChart
                                        data={netCashFlowData}
                                        width={screenWidth - 40}
                                        height={220}
                                        chartConfig={chartConfig}
                                        style={styles.chart}
                                    />
                                )}
                            </View>
                            <View style={styles.graphContainer}>
                                <View style={styles.graphTitleContainer}>
                                    <Text style={styles.graphTitle}>Cash Inflows and Outflows</Text>
                                    <TouchableOpacity
                                        onPress={() => showTooltip('inflowOutflow')}
                                        style={styles.helpButton}
                                    >
                                        <HelpCircle color={COLORS.primary} size={20} />
                                    </TouchableOpacity>
                                </View>
                                <BarChart
                                    data={inflowOutflowData}
                                    width={screenWidth - 40}
                                    height={220}
                                    chartConfig={chartConfig}
                                    style={styles.chart}
                                    showValuesOnTopOfBars
                                />
                            </View>

                            {/* Forecast Button */}
                            <TouchableOpacity
                                style={styles.forecastButton}
                                onPress={() => setProjectionModalVisible(true)}
                            >
                                <View style={styles.forecastButtonContent}>
                                    <PieChart color={COLORS.background} size={24} />
                                    <Text style={styles.forecastButtonText}>
                                        {showProjections ? 'Update Forecast' : 'Generate Cash Flow Forecast'}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            {/* Insights Section */}
                            {showProjections && (
                                <View style={styles.insightsContainer}>
                                    <Text style={styles.insightsTitle}>Forecast Insights</Text>
                                    <View style={styles.insightItem}>
                                        <Text style={styles.insightLabel}>Projected Growth Rate:</Text>
                                        <Text style={styles.insightValue}>{growthRate}%</Text>
                                    </View>
                                    <View style={styles.insightItem}>
                                        <Text style={styles.insightLabel}>Forecast Period:</Text>
                                        <Text style={styles.insightValue}>{forecastPeriod} months</Text>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </ScreenLayout>

                {/* Modals */}
                <ProjectionModal />
                <TooltipModal />
            </>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: COLORS.lightGray,
        borderRadius: 10,
        paddingVertical: 4,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    periodButtonActive: {
        backgroundColor: COLORS.background,
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    periodButtonText: {
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    periodButtonTextActive: {
        color: COLORS.text,
        fontWeight: '600',
    },
    summaryContainer: {
        backgroundColor: COLORS.lightGray,
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
    },
    summaryAmount: {
        fontSize: 32,
        fontWeight: '700',
        marginVertical: 10,
    },
    helpButton: {
        padding: 6,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    statusText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    componentsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    componentItem: {
        width: '48%',
        padding: 15,
        borderRadius: 12,
    },
    componentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    componentLabel: {
        fontSize: 14,
        marginLeft: 6,
        color: COLORS.text,
        fontWeight: '500',
    },
    componentValue: {
        fontSize: 20,
        fontWeight: '600',
    },
    chartTypeSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    chartTypeButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: COLORS.lightGray,
    },
    chartTypeButtonActive: {
        backgroundColor: COLORS.primary,
    },
    chartTypeText: {
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    chartTypeTextActive: {
        color: COLORS.background,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    projectionModalContainer: {
        backgroundColor: COLORS.background,
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    projectionModalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.text,
    },
    inputLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.lightGray,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    projectionModalButton: {
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    projectionModalButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: '600',
    },
    tooltipOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    tooltipContainer: {
        backgroundColor: COLORS.background,
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    tooltipTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 10,
    },
    tooltipDescription: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 15,
        lineHeight: 20,
    },
    tooltipTipsContainer: {
        backgroundColor: COLORS.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    tooltipTipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 10,
    },
    tooltipTipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    tooltipTipText: {
        marginLeft: 8,
        fontSize: 14,
        color: COLORS.text,
        flex: 1,
    },
    tooltipCloseButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    tooltipCloseText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: '600',
    },
    graphContainer: {
        marginBottom: 25,
        backgroundColor: COLORS.background,
        borderRadius: 15,
        padding: 15,
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    graphTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    graphTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    forecastButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    forecastButtonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    forecastButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    insightsContainer: {
        backgroundColor: COLORS.lightGray,
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    insightsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 15,
    },
    insightItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    insightLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    insightValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    }
});

export default CashFlow;