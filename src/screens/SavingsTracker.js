import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    StatusBar,
    Alert,
    Switch,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../layouts/ScreenLayout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import savingsTrackerStyles from '../styles/SavingsTrackerStyles';

const CHART_COLORS = [
    '#4E79A7', // Steel Blue
    '#F28E2B', // Sunset Orange
    '#E15759', // Terra Cotta
    '#76B7B2', // Teal
    '#59A14F', // Moss Green
    '#EDC948', // Goldenrod
    '#B07AA1', // Lavender Purple
    '#FF9DA7', // Rose Pink
    '#9C755F', // Taupe
    '#BAB0AC', // Silver
];


const SavingsTracker = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', target: '' });
    const [editingGoal, setEditingGoal] = useState(null);
    const [showChart, setShowChart] = useState(false);
    const [showPercentages, setShowPercentages] = useState(false);
    const [showLogTooltip, setShowLogTooltip] = useState(false);
    const [chartViewIndex, setChartViewIndex] = useState(0); // 0 for saved, 1 for target
    const screenWidth = Dimensions.get('window').width;

    // Modified data structure to handle monthly savings
    const getMonthKey = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
    };

    // Update the state to handle monthly data
    const [savingsData, setSavingsData] = useState({
        monthlyData: {
            [getMonthKey(new Date())]: {
                goals: []
            }
        }
    });

    // New state for month navigation
    const [currentDate, setCurrentDate] = useState(new Date());

    // Function to format the current month and year
    const formatMonthYear = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Functions to handle month navigation
    const goToPreviousMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() - 1);
            return newDate;
        });
    };

    const goToNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + 1);
            return newDate;
        });
    };

    const currentMonthKey = getMonthKey(currentDate);

    // Initialize monthly savings data if it doesn't exist
    useEffect(() => {
        if (!savingsData.monthlyData) {
            // Initialize first month
            setSavingsData({
                ...savingsData,
                monthlyData: {
                    [currentMonthKey]: {
                        goals: []
                    }
                }
            });
        } else if (!savingsData.monthlyData[currentMonthKey]) {
            // Get goal names from any existing month
            const existingMonths = Object.keys(savingsData.monthlyData);
            const goalTemplates = existingMonths.length > 0
                ? savingsData.monthlyData[existingMonths[0]].goals.map(goal => ({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: goal.name,
                    target: 0, // Start with zero
                    saved: 0
                }))
                : [];

            setSavingsData({
                ...savingsData,
                monthlyData: {
                    ...savingsData.monthlyData,
                    [currentMonthKey]: {
                        goals: goalTemplates
                    }
                }
            });
        }
    }, [currentMonthKey]);

    // Modified to use monthly goals
    const currentGoals = useMemo(() => {
        return savingsData.monthlyData?.[currentMonthKey]?.goals || [];
    }, [savingsData.monthlyData, currentMonthKey]);

    // Add month navigation UI at the top
    const MonthNavigation = () => (
        <View style={savingsTrackerStyles.monthNavigationContainer}>
            <TouchableOpacity
                onPress={goToPreviousMonth}
                style={savingsTrackerStyles.monthNavigationButton}
            >
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <Text style={savingsTrackerStyles.currentMonthText}>
                {formatMonthYear(currentDate)}
            </Text>

            <TouchableOpacity
                onPress={goToNextMonth}
                style={savingsTrackerStyles.monthNavigationButton}
            >
                <Ionicons name="chevron-forward" size={24} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );

    // Chart data calculations with safety checks and monthly tracking
    const { totalSavings, totalTarget, chartData, percentageAllocations } = useMemo(() => {
        const currentGoals = savingsData.monthlyData[currentMonthKey]?.goals || [];

        const total = currentGoals.reduce((sum, goal) => sum + (goal.saved || 0), 0);
        const targetTotal = currentGoals.reduce((sum, goal) => sum + (goal.target || 0), 0);

        // Only create chart data if we have valid numbers to show
        const pieData = currentGoals
            .filter(goal => {
                // For target view, include goals with target > 0
                // For saved view, include goals with saved > 0
                return chartViewIndex === 0 ? goal.saved > 0 : goal.target > 0;
            })
            .map((goal, index) => {
                const value = showPercentages
                    ? (chartViewIndex === 0
                        ? (total > 0 ? (goal.saved / total) * 100 : 0)
                        : (targetTotal > 0 ? (goal.target / targetTotal) * 100 : 0))
                    : (chartViewIndex === 0 ? goal.saved : goal.target);

                return {
                    name: goal.name,
                    saved: goal.saved || 0,
                    target: goal.target || 0,
                    color: CHART_COLORS[index % CHART_COLORS.length],
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12,
                    value: value
                };
            });

        const allocations = currentGoals
            .filter(goal => goal.target > 0)
            .map(goal => ({
                name: goal.name,
                percentage: targetTotal > 0 ? ((goal.target / targetTotal) * 100).toFixed(1) : '0'
            }));

        return {
            totalSavings: total,
            totalTarget: targetTotal,
            chartData: pieData,
            percentageAllocations: allocations
        };
    }, [savingsData.monthlyData, currentMonthKey, showPercentages, chartViewIndex]);

    const handleEditGoal = (goal) => {
        setEditingGoal({
            ...goal,
            newName: goal.name,
            newTarget: goal.target.toString(),
            newSaved: goal.saved.toString()
        });
        setEditModalVisible(true);
    };

    const handleUpdateGoal = () => {
        if (!editingGoal.newName.trim()) {
            Alert.alert('Missing Information', 'Please enter a goal name');
            return;
        }
        if (!editingGoal.newTarget || isNaN(parseFloat(editingGoal.newTarget))) {
            Alert.alert('Invalid Target', 'Please enter a valid target amount');
            return;
        }
        if (!editingGoal.newSaved || isNaN(parseFloat(editingGoal.newSaved))) {
            Alert.alert('Invalid Amount', 'Please enter a valid saved amount');
            return;
        }

        const updatedMonthlyData = { ...savingsData.monthlyData };
        Object.keys(updatedMonthlyData).forEach(monthKey => {
            updatedMonthlyData[monthKey].goals = updatedMonthlyData[monthKey].goals.map(goal => {
                if (goal.id === editingGoal.id) {
                    return {
                        ...goal,
                        name: editingGoal.newName.trim(),
                        target: parseFloat(editingGoal.newTarget),
                        // Only update saved amount for current month
                        saved: monthKey === currentMonthKey
                            ? parseFloat(editingGoal.newSaved)
                            : goal.saved
                    };
                }
                return goal;
            });
        });

        setSavingsData({
            ...savingsData,
            monthlyData: updatedMonthlyData
        });

        setEditModalVisible(false);
        setEditingGoal(null);

        Alert.alert(
            "Goal Updated",
            "Your savings goal has been successfully updated!"
        );
    };

    const handleDeleteGoal = () => {
        Alert.alert(
            "Delete Goal",
            `Are you sure you want to delete "${editingGoal.name}"? This will remove this goal from all months.`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // Remove goal from all months
                        const updatedMonthlyData = Object.keys(savingsData.monthlyData).reduce((acc, monthKey) => {
                            acc[monthKey] = {
                                ...savingsData.monthlyData[monthKey],
                                goals: savingsData.monthlyData[monthKey].goals
                                    .filter(goal => goal.id !== editingGoal.id)
                            };
                            return acc;
                        }, {});

                        setSavingsData({
                            ...savingsData,
                            monthlyData: updatedMonthlyData
                        });

                        setEditModalVisible(false);
                        setEditingGoal(null);
                        Alert.alert(
                            "Goal Deleted",
                            "The savings goal has been removed successfully."
                        );
                    }
                }
            ]
        );
    };

    const addSavingsGoal = () => {
        if (!newGoal.name.trim()) {
            Alert.alert('Missing Information', 'Please enter a goal name');
            return;
        }
        if (!newGoal.target || isNaN(parseFloat(newGoal.target))) {
            Alert.alert('Invalid Target', 'Please enter a valid target amount');
            return;
        }

        // const newGoalItem = {
        //     id: Date.now().toString(),
        //     name: newGoal.name.trim(),
        //     target: parseFloat(newGoal.target),
        //     saved: 0,
        // };
        const target = parseFloat(newGoal.target);
        const newGoalItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: newGoal.name.trim(),
            target: target,
            saved: 0,
        };

        // Add goal to all months with zero target except current month
        const updatedMonthlyData = { ...savingsData.monthlyData };
        Object.keys(updatedMonthlyData).forEach(monthKey => {
            if (monthKey !== currentMonthKey) {
                updatedMonthlyData[monthKey] = {
                    ...updatedMonthlyData[monthKey],
                    goals: [
                        ...updatedMonthlyData[monthKey].goals,
                        { ...newGoalItem, target: 0, saved: 0 }
                    ]
                };
            }
        });

        // Add goal to current month with specified target
        updatedMonthlyData[currentMonthKey] = {
            ...updatedMonthlyData[currentMonthKey],
            goals: [
                ...(updatedMonthlyData[currentMonthKey]?.goals || []),
                newGoalItem
            ]
        };

        setSavingsData({
            ...savingsData,
            monthlyData: updatedMonthlyData
        });

        setModalVisible(false);
        setNewGoal({ name: '', target: '', saved: 0 });

        Alert.alert(
            "Goal Added",
            "Your new savings goal has been added successfully!"
        );
    };

    const renderSavingsGoal = ({ item }) => {
        const progressPercentage = (item.saved / item.target) * 100;
        return (
            <View style={savingsTrackerStyles.goalItem}>
                <View style={savingsTrackerStyles.goalHeader}>
                    <Text style={savingsTrackerStyles.goalName}>{item.name}</Text>
                    <TouchableOpacity
                        onPress={() => handleEditGoal(item)}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <Ionicons name="pencil" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
                <View style={savingsTrackerStyles.progressBar}>
                    <View
                        style={[
                            savingsTrackerStyles.progressFill,
                            {
                                width: `${Math.min(progressPercentage, 100)}%`,
                                backgroundColor: progressPercentage >= 100 ? '#4CAF50' : '#4CAF50'
                            }
                        ]}
                    />
                </View>
                <Text style={savingsTrackerStyles.goalText}>
                    Target: Ksh {item.target.toLocaleString()} | Saved: Ksh {item.saved.toLocaleString()}
                </Text>
                <Text style={[
                    savingsTrackerStyles.goalPercentage,
                    { color: progressPercentage >= 100 ? '#4CAF50' : '#4CAF50' }
                ]}>
                    {Math.round(progressPercentage)}% Complete
                </Text>
            </View>
        );
    };

    // Chart rendering with safety checks
    const renderChart = () => {
        const hasData = chartData.length > 0;
        const relevantTotal = chartViewIndex === 0 ? totalSavings : totalTarget;

        if (!hasData || relevantTotal === 0) {
            return (
                <View style={savingsTrackerStyles.emptyChartContainer}>
                    <Text style={savingsTrackerStyles.emptyChartText}>
                        {chartViewIndex === 0
                            ? "No savings recorded for this month yet"
                            : "No savings targets set for this month yet"}
                    </Text>
                    <Text style={savingsTrackerStyles.emptyChartSubtext}>
                        {chartViewIndex === 0
                            ? "Add savings to see the distribution"
                            : "Set savings targets to see the distribution"}
                    </Text>
                </View>
            );
        }

        return (
            <PieChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute={!showPercentages}
            />
        );
    };

    const screenHeaderProps = {
        title: "Savings Tracker",
        tooltipContent: "Track your savings goals and watch your money grow! Set targets and monitor your progress here.",
        showTooltip: showLogTooltip,
        setShowTooltip: setShowLogTooltip
    };

    return (
        <SafeAreaView style={savingsTrackerStyles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScreenLayout headerProps={screenHeaderProps}>
                <View style={savingsTrackerStyles.container}>
                    <MonthNavigation />
                    {/* Total Savings Overview */}
                    <View style={savingsTrackerStyles.overviewContainer}>
                        <Text style={savingsTrackerStyles.overviewTitle}>Total Savings Overview</Text>
                        <View style={savingsTrackerStyles.overviewDetails}>
                            <View style={savingsTrackerStyles.overviewItem}>
                                <Text style={savingsTrackerStyles.overviewLabel}>Target</Text>
                                <Text style={savingsTrackerStyles.overviewAmount}>
                                    Ksh {totalTarget.toLocaleString()}
                                </Text>
                            </View>
                            <View style={savingsTrackerStyles.overviewDivider} />
                            <View style={savingsTrackerStyles.overviewItem}>
                                <Text style={savingsTrackerStyles.overviewLabel}>Saved</Text>
                                <Text style={[savingsTrackerStyles.overviewAmount, { color: totalTarget > totalSavings ? '#FF6B6B' : '#4CAF50' }]}>
                                    Ksh {totalSavings.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                        <Text style={savingsTrackerStyles.overviewSubtext}>
                            💡 Regular savings help build a strong financial foundation
                        </Text>
                    </View>

                    {/* Chart Section */}
                    <View style={savingsTrackerStyles.chartContainer}>
                        <View style={savingsTrackerStyles.chartHeader}>
                            <Text style={savingsTrackerStyles.chartTitle}>Savings Allocation</Text>
                            <View style={savingsTrackerStyles.chartControls}>
                                <View style={savingsTrackerStyles.toggleContainer}>
                                    <Text style={savingsTrackerStyles.toggleLabel}>Show %</Text>
                                    <Switch
                                        value={showPercentages}
                                        onValueChange={setShowPercentages}
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={showPercentages ? "#007AFF" : "#f4f3f4"}
                                    />
                                </View>
                                <View style={savingsTrackerStyles.toggleContainer}>
                                    <Text style={savingsTrackerStyles.toggleLabel}>Chart</Text>
                                    <Switch
                                        value={showChart}
                                        onValueChange={setShowChart}
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={showChart ? "#007AFF" : "#f4f3f4"}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={savingsTrackerStyles.chartFilterContainer}>
                            <TouchableOpacity
                                style={[
                                    savingsTrackerStyles.chartViewButton,
                                    chartViewIndex === 0 && savingsTrackerStyles.activeChartViewButton
                                ]}
                                onPress={() => setChartViewIndex(0)}
                            >
                                <Text style={[
                                    savingsTrackerStyles.chartViewButtonText,
                                    chartViewIndex === 0 && savingsTrackerStyles.activeChartViewButtonText
                                ]}>
                                    By Saved
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    savingsTrackerStyles.chartViewButton,
                                    chartViewIndex === 1 && savingsTrackerStyles.activeChartViewButton
                                ]}
                                onPress={() => setChartViewIndex(1)}
                            >
                                <Text style={[
                                    savingsTrackerStyles.chartViewButtonText,
                                    chartViewIndex === 1 && savingsTrackerStyles.activeChartViewButtonText
                                ]}>
                                    By Target
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showChart && (
                            <View style={savingsTrackerStyles.chartWrapper}>
                                {renderChart()}
                            </View>
                        )}
                    </View>

                    {/* Savings Goals List */}
                    <FlatList
                        data={currentGoals}
                        renderItem={renderSavingsGoal}
                        keyExtractor={item => item.id}
                        style={savingsTrackerStyles.goalsList}
                        contentContainerStyle={savingsTrackerStyles.goalsListContent}
                        ListEmptyComponent={() => (
                            <View style={savingsTrackerStyles.emptyChartContainer}>
                                <Text style={savingsTrackerStyles.emptyListText}>
                                    No Savings Goals yet
                                </Text>
                                <Text style={savingsTrackerStyles.emptyListSubtext}>
                                    Tap the "Add Goal" button to create your first Goal
                                </Text>
                            </View>
                        )}
                    />

                    {/* Add Goal Button */}
                    <TouchableOpacity
                        style={savingsTrackerStyles.floatingAddButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                        <Text style={savingsTrackerStyles.addButtonText}>Add Goal</Text>
                    </TouchableOpacity>

                    {/* Add Goal Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={savingsTrackerStyles.modalOverlay}>
                            <View style={savingsTrackerStyles.modalView}>
                                <View style={savingsTrackerStyles.modalHeader}>
                                    <Text style={savingsTrackerStyles.modalTitle}>Add New Savings Goal</Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={savingsTrackerStyles.modalCloseButton}
                                    >
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={savingsTrackerStyles.modalTip}>
                                    💡 Set specific, achievable savings goals for your business growth
                                </Text>

                                <TextInput
                                    style={savingsTrackerStyles.input}
                                    placeholder="Goal Name (e.g., Emergency Fund)"
                                    value={newGoal.name}
                                    onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
                                />

                                <TextInput
                                    style={savingsTrackerStyles.input}
                                    placeholder="Target Amount (Ksh)"
                                    keyboardType="numeric"
                                    value={newGoal.target}
                                    onChangeText={(text) => setNewGoal({ ...newGoal, target: text })}
                                />

                                <TouchableOpacity
                                    style={[savingsTrackerStyles.modalAddButton, { backgroundColor: '#007AFF' }]}
                                    onPress={addSavingsGoal}
                                >
                                    <Text style={[savingsTrackerStyles.modalAddButtonText, { color: '#FFFFFF' }]}>
                                        Add Goal
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Edit Goal Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={editModalVisible}
                        onRequestClose={() => setEditModalVisible(false)}
                    >
                        <View style={savingsTrackerStyles.modalOverlay}>
                            <View style={savingsTrackerStyles.modalView}>
                                <View style={savingsTrackerStyles.modalHeader}>
                                    <Text style={savingsTrackerStyles.modalTitle}>Edit Savings Goal</Text>
                                    <TouchableOpacity
                                        onPress={() => setEditModalVisible(false)}
                                        style={savingsTrackerStyles.modalCloseButton}
                                    >
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={savingsTrackerStyles.modalTip}>
                                    💡 Update your goal details or adjust your progress
                                </Text>

                                <TextInput
                                    style={savingsTrackerStyles.input}
                                    placeholder="Goal Name"
                                    value={editingGoal?.newName}
                                    onChangeText={(text) => setEditingGoal({
                                        ...editingGoal,
                                        newName: text
                                    })}
                                />

                                <TextInput
                                    style={savingsTrackerStyles.input}
                                    placeholder="Target Amount (Ksh)"
                                    keyboardType="numeric"
                                    value={editingGoal?.newTarget}
                                    onChangeText={(text) => setEditingGoal({
                                        ...editingGoal,
                                        newTarget: text
                                    })}
                                />

                                <TextInput
                                    style={savingsTrackerStyles.input}
                                    placeholder="Amount Saved (Ksh)"
                                    keyboardType="numeric"
                                    value={editingGoal?.newSaved}
                                    onChangeText={(text) => setEditingGoal({
                                        ...editingGoal,
                                        newSaved: text
                                    })}
                                />

                                <View style={savingsTrackerStyles.editModalButtons}>
                                    <TouchableOpacity
                                        style={[savingsTrackerStyles.modalAddButton, { backgroundColor: '#007AFF' }]}
                                        onPress={handleUpdateGoal}
                                    >
                                        <Text style={[savingsTrackerStyles.modalAddButtonText, { color: '#FFFFFF' }]}>
                                            Update Goal
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[savingsTrackerStyles.modalDeleteButton]}
                                        onPress={handleDeleteGoal}
                                    >
                                        <Text style={savingsTrackerStyles.modalDeleteButtonText}>
                                            Delete Goal
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScreenLayout>
        </SafeAreaView>
    );
};

export default SavingsTracker;