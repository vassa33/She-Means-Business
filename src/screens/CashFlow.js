// ======================================
// Imports and Dependencies
// ======================================
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Modal,
    Animated,
    TextInput,
    Alert,
    StatusBar,
    Platform,
    ActivityIndicator,
    ScrollView as HorizontalScrollView
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import {
    TrendingUp,
    TrendingDown,
    HelpCircle,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    X
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenLayout from '../layouts/ScreenLayout';
import { useAppContext } from '../context/AppContext';
import CashFlowStyles from '../styles/CashFlowStyles';

// ======================================
// Constants and Configuration
// ======================================

// Color palette for the application
const COLORS = {
    primary: '#007AFF',
    primaryLight: 'rgba(0, 122, 255, 0.1)',
    secondary: '#81b0ff',
    gray: '#767577',
    lightGray: '#f4f3f4',
    success: '#34C759',
    successLight: 'rgba(52, 199, 89, 0.1)',
    danger: '#FF3B30',
    dangerLight: 'rgba(255, 59, 48, 0.1)',
    warning: '#FF9500',
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#7F7F7F',
};

// Educational tooltip content
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
    },
    inflowOutflow: {
        title: "Inflows and Outflows Comparison",
        description: "This chart compares your cash inflows (money coming in) with outflows (money going out) over time. The comparison helps identify periods of high expenses or strong revenue.",
        tips: [
            "Look for consistent patterns",
            "Monitor the gap between inflows and outflows",
            "Plan for periods when outflows exceed inflows",
            "Identify seasonal trends in both flows"
        ]
    },
    forecast: {
        title: "Cash Flow Forecast",
        description: "Predict future cash flows based on historical data and growth assumptions.",
        tips: [
            "Use realistic growth rates",
            "Consider market conditions",
            "Update regularly with actual data",
            "Account for seasonal variations"
        ]
    }
};

// ======================================
// Helper Functions
// ======================================

// Generate mock data for testing
const generateMockData = (period) => {
    let length;
    let dateGenerator;

    switch (period) {
        case 'week':
            length = 7;
            dateGenerator = (i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split('T')[0];
            };
            break;
        case 'month':
            length = 30;
            dateGenerator = (i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split('T')[0];
            };
            break;
        case 'year':
            length = 12;
            dateGenerator = (i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                return date.toISOString().slice(0, 7);
            };
            break;
        default:
            length = 7;
            dateGenerator = (i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split('T')[0];
            };
    }

    const dates = Array.from({ length }, (_, i) => dateGenerator(i)).reverse();

    return dates.map((date, index) => ({
        id: index.toString(),
        date,
        inflows: Math.floor(Math.random() * 5000) + 8000,
        outflows: Math.floor(Math.random() * 3000) + 6000,
        category: ['Sales', 'Services', 'Online', 'Retail'][Math.floor(Math.random() * 4)]
    }));
};

// Calculate projections based on current data
const calculateProjections = (baseData, months, growth) => {
    if (!Array.isArray(baseData) || baseData.length === 0) return [];
    const growthRate = Number(growth) / 100 || 0;
    const lastEntry = baseData[baseData.length - 1];
    const projections = [];

    for (let i = 1; i <= parseInt(months); i++) {
        const projectedInflows = lastEntry.inflows * Math.pow(1 + growthRate, i);
        const projectedOutflows = lastEntry.outflows * Math.pow(1 + (growthRate * 0.8), i);
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

// ======================================
// Sub-Components
// ======================================

// Enhanced chart component with horizontal scroll
const ScrollableChart = React.memo(({ children, height, yAxis, legend }) => {
    const [scrollEnabled, setScrollEnabled] = useState(true);

    return (
        <View style={{ height, flexDirection: 'row' }}>
            {/* Fixed Y-Axis */}
            <View style={{ width: 50 }}>
                {yAxis}
            </View>

            {/* Scrollable Chart Area */}
            <View style={{ flex: 1 }}>
                {legend}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    scrollEnabled={scrollEnabled}
                    onScrollBeginDrag={() => setScrollEnabled(true)}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingRight: 20, paddingTop: 40 }}
                >
                    {children}
                </ScrollView>
            </View>
        </View>
    );
});

const formatXAxisLabel = (date, period) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeks = ['week 1', 'week 2', 'week 3', 'week 4', 'week 5', 'week 6', 'week 7'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (period === 'week') {
        const dayIndex = new Date(date).getDay();
        return days[dayIndex];
    } else if (period === 'month') {
        return date.slice(-2); // Day of month
    } else if (period === 'year') {
        const monthIndex = parseInt(date.slice(5, 7)) - 1;
        return months[monthIndex];
    }
    return date;
};

const DataPointTooltip = ({ value, date, visible, position }) => {
    if (!visible) return null;

    return (
        <View
            style={{
                position: 'absolute',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 8,
                borderRadius: 4,
                left: position.x - 50,
                top: position.y - 60,
                zIndex: 999,
            }}
        >
            <Text style={{ color: 'white', fontSize: 12 }}>
                Date: {date}
            </Text>
            <Text style={{ color: 'white', fontSize: 12 }}>
                Value: Ksh {value.toLocaleString()}
            </Text>
        </View>
    );
};

const ChartLegend = ({ datasets, colors }) => (
    <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        left: 50,
        right: 0,
        zIndex: 999,
    }}>
        {datasets.map((dataset, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: colors[index],
                    marginRight: 4,
                }} />
                <Text style={{ fontSize: 12, color: '#666' }}>{dataset}</Text>
            </View>
        ))}
    </View>
);

// Projection Modal Component
const ProjectionModal = ({ visible, onClose, onApply }) => {
    const [forecastPeriod, setForecastPeriod] = useState('3');
    const [growthRate, setGrowthRate] = useState('5');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const newErrors = {};
        if (isNaN(forecastPeriod) || forecastPeriod < 1 || forecastPeriod > 12) {
            newErrors.forecastPeriod = 'Please enter a number between 1 and 12';
        }
        if (isNaN(growthRate) || growthRate < -100 || growthRate > 100) {
            newErrors.growthRate = 'Please enter a number between -100 and 100';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateInputs()) {
            onApply({ forecastPeriod, growthRate });
            onClose();
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={CashFlowStyles.modalOverlay}>
                <View style={CashFlowStyles.projectionModalContainer}>
                    <View style={CashFlowStyles.modalHeader}>
                        <Text style={CashFlowStyles.projectionModalTitle}>
                            Cash Flow Forecast Settings
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color={COLORS.text} size={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={CashFlowStyles.modalContent}>
                        <View style={CashFlowStyles.inputGroup}>
                            <Text style={CashFlowStyles.inputLabel}>Forecast Period (1-12 months):</Text>
                            <TextInput
                                style={[
                                    CashFlowStyles.input,
                                    errors.forecastPeriod && CashFlowStyles.inputError
                                ]}
                                keyboardType="numeric"
                                value={forecastPeriod}
                                onChangeText={setForecastPeriod}
                                maxLength={2}
                            />
                            {errors.forecastPeriod && (
                                <Text style={CashFlowStyles.errorText}>{errors.forecastPeriod}</Text>
                            )}
                        </View>
                        <View style={CashFlowStyles.inputGroup}>
                            <Text style={CashFlowStyles.inputLabel}>Growth Rate (-100 to 100%):</Text>
                            <TextInput
                                style={[
                                    CashFlowStyles.input,
                                    errors.growthRate && CashFlowStyles.inputError
                                ]}
                                keyboardType="numeric"
                                value={growthRate}
                                onChangeText={setGrowthRate}
                                maxLength={4}
                            />
                            {errors.growthRate && (
                                <Text style={CashFlowStyles.errorText}>{errors.growthRate}</Text>
                            )}
                        </View>
                        <TouchableOpacity
                            style={CashFlowStyles.projectionModalButton}
                            onPress={handleSubmit}
                        >
                            <Text style={CashFlowStyles.projectionModalButtonText}>
                                Apply Forecast Settings
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// Chart Type Selector Component
const ChartTypeSelector = ({ selectedChart, setSelectedChart }) => (
    <View style={CashFlowStyles.chartTypeSelector}>
        <TouchableOpacity
            style={[
                CashFlowStyles.chartTypeButton,
                selectedChart === 'line' && CashFlowStyles.chartTypeButtonActive
            ]}
            onPress={() => setSelectedChart('line')}
        >
            <Text
                style={[
                    CashFlowStyles.chartTypeText,
                    selectedChart === 'line' && CashFlowStyles.chartTypeTextActive
                ]}
            >
                Line
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[
                CashFlowStyles.chartTypeButton,
                selectedChart === 'bar' && CashFlowStyles.chartTypeButtonActive
            ]}
            onPress={() => setSelectedChart('bar')}
        >
            <Text
                style={[
                    CashFlowStyles.chartTypeText,
                    selectedChart === 'bar' && CashFlowStyles.chartTypeTextActive
                ]}
            >
                Bar
            </Text>
        </TouchableOpacity>
    </View>
);

// Period Selector Component
const PeriodSelector = ({ selectedPeriod, setSelectedPeriod }) => (
    <View style={CashFlowStyles.periodSelector}>
        {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
                key={period}
                style={[
                    CashFlowStyles.periodButton,
                    selectedPeriod === period && CashFlowStyles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
            >
                <Text
                    style={[
                        CashFlowStyles.periodButtonText,
                        selectedPeriod === period && CashFlowStyles.periodButtonTextActive
                    ]}
                >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

// ======================================
// Main Component
// ======================================

const CashFlow = () => {
    // ----------------
    // State Management
    // ----------------
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

    // ----------------
    // Effects
    // ----------------
    React.useEffect(() => {
        setCurrentScreen('CashFlow');

        // Fetch mock data
        try {
            setIsLoading(true);
            const data = generateMockData();
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid data format');
            }
            setCashFlowData(data);
        } catch (err) {
            setError('Failed to load cash flow data. Please try again later.');
            Alert.alert('Error', 'Failed to load cash flow data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Enhanced useEffect for data fetching
    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 3;

        const fetchCashFlowData = async () => {
            try {
                setIsLoading(true);
                const data = generateMockData(selectedPeriod);
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('Invalid data format');
                }
                setCashFlowData(data);
            } catch (err) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    setTimeout(fetchCashFlowData, 1000 * retryCount);
                } else {
                    setError('Failed to load cash flow data. Please try again later.');
                    Alert.alert('Error', 'Failed to load cash flow data');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchCashFlowData();
    }, [selectedPeriod]); // Re-fetch when period changes

    useEffect(() => {
        return () => {
            tooltipFadeAnim.setValue(0);
        };
    }, [tooltipFadeAnim]);

    // ----------------
    // Memoized Values
    // ----------------
    const screenWidth = useMemo(() => Platform.OS === 'web' ? 500 : Dimensions.get('window').width, []);

    const { netCashFlowData, inflowOutflowData, yAxisLabels } = useMemo(() => {
        let dataToUse = cashFlowData || [];
        if (showProjections) {
            const projections = calculateProjections(cashFlowData, forecastPeriod, growthRate);
            dataToUse = [...cashFlowData, ...projections];
        }

        // Calculate max value for y-axis scale
        const maxValue = Math.max(
            ...dataToUse.map(item => Math.max(item.inflows, item.outflows))
        );
        const yAxisStep = Math.ceil(maxValue / 5 / 1000) * 1000;
        const yLabels = Array.from({ length: 6 }, (_, i) => (yAxisStep * i).toLocaleString());

        return {
            netCashFlowData: {
                labels: dataToUse.map(item =>
                    selectedPeriod === 'year'
                        ? item.date.slice(5, 7)
                        : item.date.slice(-2)
                ),
                datasets: [{
                    data: dataToUse.map(item => Math.max(0, item.inflows - item.outflows)),
                    color: (opacity = 1) => COLORS.success,
                    strokeWidth: 2
                }],
                //legend: ["Net Cash Flow"]
            },
            inflowOutflowData: {
                labels: dataToUse.map(item =>
                    selectedPeriod === 'year'
                        ? item.date.slice(5, 7)
                        : item.date.slice(-2)
                ),
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
                //legend: ["Inflows", "Outflows"]
            },
            yAxisLabels: yLabels
        };
    }, [cashFlowData, showProjections, forecastPeriod, growthRate, selectedPeriod]);

    // Chart configuration settings
    const chartConfig = useMemo(() => ({
        backgroundColor: COLORS.background,
        backgroundGradientFrom: COLORS.background,
        backgroundGradientTo: COLORS.background,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: COLORS.primary
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: "rgba(0, 0, 0, 0.1)",
            strokeWidth: 1
        },
        propsForLabels: {
            fontSize: 12,
            fontWeight: '600'
        },
        rotateLabels: 45,
        //formatXLabel: (label) => formatXAxisLabel(label, selectedPeriod),
        renderDotContent: ({ x, y, index, dataset }) => (
            <TouchableOpacity
                key={`dot-${index}`}
                onPress={() => {
                    const dataPoint = dataset.data[index];
                    const date = netCashFlowData.labels[index];
                    setTooltipData({
                        value: dataPoint,
                        date,
                        visible: true,
                        position: { x, y }
                    });
                }}
                style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: dataset.color(1),
                    position: 'absolute',
                    left: x - 10,
                    top: y - 10,
                }}
            />
        )
    }), [selectedPeriod, netCashFlowData.labels]);

    // ----------------
    // Event Handlers and Calculations
    // ----------------
    const handleProjectionApply = ({ forecastPeriod: newPeriod, growthRate: newRate }) => {
        setForecastPeriod(newPeriod);
        setGrowthRate(newRate);
        setShowProjections(true);

        return calculateProjections(cashFlowData, newPeriod, newRate);
    };

    const calculateTotals = useCallback(() => {
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
    }, [cashFlowData, showProjections, forecastPeriod, growthRate]);

    const { totalInflows, totalOutflows } = calculateTotals();
    const netCashFlow = totalInflows - totalOutflows;

    const showTooltip = useCallback((type) => {
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
    }, [tooltipFadeAnim]);

    const hideTooltip = () => {
        Animated.timing(tooltipFadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start(() => setSelectedTooltip(null));
    };

    const [tooltipData, setTooltipData] = useState({
        value: 0,
        date: '',
        visible: false,
        position: { x: 0, y: 0 }
    });

    // ----------------
    // Render Methods
    // ----------------
    const TooltipModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={selectedTooltip !== null}
            onRequestClose={hideTooltip}
        >
            <View style={CashFlowStyles.tooltipOverlay}>
                <Animated.View
                    style={[
                        CashFlowStyles.tooltipContainer,
                        {
                            opacity: tooltipFadeAnim
                        }
                    ]}
                >
                    {selectedTooltip && (
                        <>
                            <Text style={CashFlowStyles.tooltipTitle}>
                                {tooltipContent[selectedTooltip].title}
                            </Text>
                            <Text style={CashFlowStyles.tooltipDescription}>
                                {tooltipContent[selectedTooltip].description}
                            </Text>
                            <View style={CashFlowStyles.tooltipTipsContainer}>
                                <Text style={CashFlowStyles.tooltipTipsTitle}>Tips:</Text>
                                {tooltipContent[selectedTooltip].tips.map((tip, index) => (
                                    <View key={index} style={CashFlowStyles.tooltipTipItem}>
                                        <HelpCircle color={COLORS.primary} size={16} />
                                        <Text style={CashFlowStyles.tooltipTipText}>{tip}</Text>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={CashFlowStyles.tooltipCloseButton}
                                onPress={hideTooltip}
                            >
                                <Text style={CashFlowStyles.tooltipCloseText}>Close</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={CashFlowStyles.safeArea}>
            <>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor={'#fff'}
                    translucent={Platform.OS === 'android'}
                />
                <ScreenLayout headerProps={{ title: "Cash Flow Analysis" }}>
                    {isLoading ? (
                        <View style={CashFlowStyles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : error ? (
                        <View style={CashFlowStyles.errorContainer}>
                            <Text style={CashFlowStyles.errorText}>{error}</Text>
                        </View>
                    ) : (
                        <View style={CashFlowStyles.container}>
                            <ScrollView
                                style={CashFlowStyles.content}
                                contentContainerStyle={[{ paddingBottom: 100 }]}
                            >
                                {/* Period Selector */}
                                <PeriodSelector
                                    selectedPeriod={selectedPeriod}
                                    setSelectedPeriod={setSelectedPeriod}
                                />

                                {/* Summary Section */}
                                <View style={CashFlowStyles.summaryContainer}>
                                    <View style={CashFlowStyles.summaryHeader}>
                                        <Text style={CashFlowStyles.summaryTitle}>Net Cash Flow</Text>
                                        <TouchableOpacity
                                            style={CashFlowStyles.helpButton}
                                            onPress={() => showTooltip('netCashFlow')}
                                            accessibilityLabel="Net cash flow information"
                                            accessibilityRole="button"
                                        >
                                            <HelpCircle color={COLORS.primary} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[
                                        CashFlowStyles.summaryAmount,
                                        { color: (netCashFlow || 0) >= 0 ? COLORS.success : COLORS.danger }
                                    ]}>
                                        Ksh {(netCashFlow || 0).toLocaleString()}
                                    </Text>
                                    {netCashFlow >= 0 ? (
                                        <View style={CashFlowStyles.statusIndicator}>
                                            <TrendingUp color={COLORS.success} size={16} />
                                            <Text style={[CashFlowStyles.statusText, { color: COLORS.success }]}>
                                                Healthy Cash Position
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={CashFlowStyles.statusIndicator}>
                                            <TrendingDown color={COLORS.danger} size={16} />
                                            <Text style={[CashFlowStyles.statusText, { color: COLORS.danger }]}>
                                                Action Required: Review Expenses
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {/* Components Container */}
                                <View style={CashFlowStyles.componentsContainer}>
                                    <TouchableOpacity
                                        style={[CashFlowStyles.componentItem, { backgroundColor: COLORS.success + '20' }]}
                                        onPress={() => showTooltip('inflows')}
                                    >
                                        <View style={CashFlowStyles.componentHeader}>
                                            <ArrowUpRight color={COLORS.success} size={20} />
                                            <Text style={CashFlowStyles.componentLabel}>Total Inflows</Text>
                                        </View>
                                        <Text style={[CashFlowStyles.componentValue, { color: COLORS.success }]}>
                                            Ksh {totalInflows.toLocaleString()}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[CashFlowStyles.componentItem, { backgroundColor: COLORS.danger + '20' }]}
                                        onPress={() => showTooltip('outflows')}
                                    >
                                        <View style={CashFlowStyles.componentHeader}>
                                            <ArrowDownRight color={COLORS.danger} size={20} />
                                            <Text style={CashFlowStyles.componentLabel}>Total Outflows</Text>
                                        </View>
                                        <Text style={[CashFlowStyles.componentValue, { color: COLORS.danger }]}>
                                            Ksh {totalOutflows.toLocaleString()}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Charts Section */}
                                <View style={CashFlowStyles.chartTypeSelector}>
                                    <ChartTypeSelector
                                        selectedChart={selectedChart}
                                        setSelectedChart={setSelectedChart}
                                    />
                                </View>
                                {/* Net Cash Flow Chart */}
                                <View style={CashFlowStyles.graphContainer}>
                                    <View style={CashFlowStyles.graphTitleContainer}>
                                        <Text style={CashFlowStyles.graphTitle}>Net Cash Flow Trend</Text>
                                        <TouchableOpacity
                                            onPress={() => showTooltip('cashFlowTrend')}
                                            style={CashFlowStyles.helpButton}
                                        >
                                            <HelpCircle color={COLORS.primary} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollableChart
                                        height={280}
                                        yAxis={
                                            <View style={{ height: '100%', justifyContent: 'space-between', paddingRight: 10 }}>
                                                {yAxisLabels.reverse().map((label, index) => (
                                                    <Text key={index} style={{ fontSize: 10, color: COLORS.textSecondary }}>
                                                        {label}
                                                    </Text>
                                                ))}
                                            </View>
                                        }
                                        legend={
                                            <ChartLegend
                                                datasets={['Net Cash Flow']}
                                                colors={[COLORS.success]}
                                            />
                                        }
                                    >
                                        {selectedChart === 'line' ? (
                                            <>
                                                <LineChart
                                                    data={netCashFlowData}
                                                    width={Math.max(screenWidth * 1.2, 400)}
                                                    height={220}
                                                    chartConfig={chartConfig}
                                                    bezier
                                                    style={CashFlowStyles.chart}
                                                    withVerticalLabels={true}
                                                    withHorizontalLabels={false}
                                                    withInnerLines={true}
                                                    withOuterLines={true}
                                                    withDots={true}
                                                    withShadow={false}
                                                    segments={5}
                                                    decorator={chartConfig.decorator}
                                                    formatXLabel={chartConfig.formatXLabel}
                                                    rotateLabels={chartConfig.rotateLabels}
                                                />
                                                <DataPointTooltip {...tooltipData} />
                                            </>
                                        ) : (
                                            <>
                                                <BarChart
                                                    data={netCashFlowData}
                                                    width={Math.max(screenWidth * 1.2, 400)}
                                                    height={220}
                                                    chartConfig={chartConfig}
                                                    style={CashFlowStyles.chart}
                                                    withVerticalLabels={true}
                                                    withHorizontalLabels={false}
                                                    segments={5}
                                                    decorator={chartConfig.decorator}
                                                    formatXLabel={chartConfig.formatXLabel}
                                                    rotateLabels={chartConfig.rotateLabels}
                                                />
                                                <DataPointTooltip {...tooltipData} />
                                            </>
                                        )}
                                    </ScrollableChart>
                                </View>

                                {/* Inflows/Outflows Chart */}
                                <View style={CashFlowStyles.graphContainer}>
                                    <View style={CashFlowStyles.graphTitleContainer}>
                                        <Text style={CashFlowStyles.graphTitle}>Cash Inflows and Outflows</Text>
                                        <TouchableOpacity
                                            onPress={() => showTooltip('inflowOutflow')}
                                            style={CashFlowStyles.helpButton}
                                        >
                                            <HelpCircle color={COLORS.primary} size={20} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollableChart height={280} yAxis={
                                        <View style={{ height: '100%', justifyContent: 'space-between', paddingRight: 10 }}>
                                            {yAxisLabels.reverse().map((label, index) => (
                                                <Text key={index} style={{ fontSize: 10, color: COLORS.textSecondary }}>
                                                    {label}
                                                </Text>
                                            ))}
                                        </View>
                                    }
                                        legend={
                                            <ChartLegend
                                                datasets={['Inflows', 'Outflows']}
                                                colors={[COLORS.success, COLORS.danger]}
                                            />
                                        }
                                    >
                                        {selectedChart === 'line' ? (
                                            <>
                                                <LineChart
                                                    data={inflowOutflowData}
                                                    width={Math.max(screenWidth * 1.2, 400)}
                                                    height={220}
                                                    chartConfig={chartConfig}
                                                    bezier
                                                    style={CashFlowStyles.chart}
                                                    withVerticalLabels={true}
                                                    withHorizontalLabels={false}
                                                    withInnerLines={true}
                                                    withOuterLines={true}
                                                    withDots={true}
                                                    withShadow={false}
                                                    segments={5}
                                                    decorator={chartConfig.decorator}
                                                    formatXLabel={chartConfig.formatXLabel}
                                                    rotateLabels={chartConfig.rotateLabels}
                                                />
                                                <DataPointTooltip {...tooltipData} />
                                            </>
                                        ) : (
                                            <>
                                                <BarChart
                                                    data={netCashFlowData}
                                                    width={Math.max(screenWidth * 1.2, 400)}
                                                    height={220}
                                                    chartConfig={chartConfig}
                                                    style={CashFlowStyles.chart}
                                                    withVerticalLabels={true}
                                                    withHorizontalLabels={false}
                                                    segments={5}
                                                    decorator={chartConfig.decorator}
                                                    formatXLabel={chartConfig.formatXLabel}
                                                    rotateLabels={chartConfig.rotateLabels}
                                                />
                                                <DataPointTooltip {...tooltipData} />
                                            </>
                                        )}
                                    </ScrollableChart>
                                </View>

                                {/* Forecast Button */}
                                <TouchableOpacity
                                    style={CashFlowStyles.forecastButton}
                                    onPress={() => setProjectionModalVisible(true)}
                                >
                                    <View style={CashFlowStyles.forecastButtonContent}>
                                        <PieChart color={COLORS.background} size={24} />
                                        <Text style={CashFlowStyles.forecastButtonText}>
                                            {showProjections ? 'Update Forecast' : 'Generate Cash Flow Forecast'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Insights Section */}
                                {showProjections && (
                                    <View style={CashFlowStyles.insightsContainer}>
                                        <View style={CashFlowStyles.graphTitleContainer}>
                                            <Text style={CashFlowStyles.graphTitle}>Forecast Insights</Text>
                                            <TouchableOpacity
                                                onPress={() => showTooltip('forecast')}
                                                style={CashFlowStyles.helpButton}
                                            >
                                                <HelpCircle color={COLORS.primary} size={20} />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={CashFlowStyles.insightItem}>
                                            <Text style={CashFlowStyles.insightLabel}>Projected Growth Rate:</Text>
                                            <Text style={CashFlowStyles.insightValue}>{growthRate}%</Text>
                                        </View>
                                        <View style={CashFlowStyles.insightItem}>
                                            <Text style={CashFlowStyles.insightLabel}>Forecast Period:</Text>
                                            <Text style={CashFlowStyles.insightValue}>{forecastPeriod} months</Text>
                                        </View>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    )}
                </ScreenLayout>

                {/* Modals */}
                <ProjectionModal
                    visible={projectionModalVisible}
                    onClose={() => setProjectionModalVisible(false)}
                    onApply={handleProjectionApply}
                />
                <TooltipModal />
            </>
        </SafeAreaView>
    );
};

export default CashFlow;