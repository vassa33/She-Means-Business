import React, { useState, useMemo, useContext } from 'react';
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
import { useInternalData } from '../contexts/InternalDataContext';

const CHART_COLORS = [
    '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
    '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'
];

const SavingsTracker = () => {
    // Context Integration
    const {
        savingsGoals,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        financialMetrics,
    } = useInternalData();

    // Local State
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', targetAmount: '' });
    const [editingGoal, setEditingGoal] = useState(null);
    const [showLogTooltip, setShowLogTooltip] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showPercentages, setShowPercentages] = useState(false);
    const [chartViewIndex, setChartViewIndex] = useState(0);
    const screenWidth = Dimensions.get('window').width;

    // Current Month Management
    const [currentDate, setCurrentDate] = useState(new Date());

    // Use financial metrics for enhanced data visualization
    const savingsProgress = financialMetrics?.savingsProgress || [];
    const currentMonthSavings = financialMetrics?.currentMonth?.income?.totalSaved || 0;
    const savingsRate = financialMetrics?.currentMonth?.savingsRate || 0;

    // Chart calculations using context data and financial metrics
    const { totalSavings, totalTarget, chartData, percentageAllocations } = useMemo(() => {
        const savingsProgress = financialMetrics?.savingsProgress || [];

        const total = chartViewIndex === 0
            ? savingsProgress.reduce((sum, goal) => sum + goal.saved, 0)
            : savingsProgress.reduce((sum, goal) => sum + goal.targetAmount, 0);

        const pieData = savingsProgress
            .filter(goal => chartViewIndex === 0
                ? goal.saved > 0
                : goal.targetAmount > 0)
            .map((goal, index) => {
                const value = showPercentages
                    ? (total > 0
                        ? (chartViewIndex === 0
                            ? (goal.saved / total) * 100
                            : (goal.targetAmount / total) * 100)
                        : 0)
                    : (chartViewIndex === 0 ? goal.saved : goal.targetAmount);

                return {
                    name: goal.name,
                    saved: goal.saved || 0,
                    target: goal.targetAmount || 0,
                    color: CHART_COLORS[index % CHART_COLORS.length],
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12,
                    value: value
                };
            });

        const allocations = savingsProgress
            .filter(goal => goal.targetAmount > 0)
            .map(goal => ({
                name: goal.name,
                percentage: total > 0
                    ? ((chartViewIndex === 0
                        ? goal.saved
                        : goal.targetAmount) / total * 100).toFixed(1)
                    : '0'
            }));

        return {
            totalSavings: total,
            totalTarget: total,
            chartData: pieData,
            percentageAllocations: allocations
        };
    }, [financialMetrics, showPercentages, chartViewIndex]);


    // Modified handlers to use context
    const handleAddGoal = () => {
        if (!newGoal.name.trim()) {
            Alert.alert('Missing Information', 'Please enter a goal name');
            return;
        }
        if (!newGoal.targetAmount || isNaN(parseFloat(newGoal.targetAmount))) {
            Alert.alert('Invalid Target', 'Please enter a valid target amount');
            return;
        }

        addSavingsGoal({
            name: newGoal.name.trim(),
            targetAmount: parseFloat(newGoal.targetAmount),
            currentAmount: 0,
            description: newGoal.description || ''
        });

        setModalVisible(false);
        setNewGoal({ name: '', targetAmount: '', description: '' });
        Alert.alert("Goal Added", "Your new savings goal has been added successfully!");
    };

    const handleEditGoal = (goal) => {
        setEditingGoal({
            id: goal.id,
            name: goal.name,
            newName: goal.name, // Ensure newName exists
            newTarget: goal.targetAmount,
            newDescription: goal.description
        });
        setEditModalVisible(true);
    };

    const handleUpdateGoal = () => {
        if (!editingGoal) {
            Alert.alert('Error', 'No goal selected for editing');
            return;
        }

        const goalToUpdate = savingsGoals.find(goal => goal.id === editingGoal.id);

        updateSavingsGoal(editingGoal.id, {
            name: editingGoal.newName?.trim() || goalToUpdate.name,
            targetAmount: parseFloat(editingGoal.newTarget) || goalToUpdate.targetAmount,
            description: editingGoal.newDescription || goalToUpdate.description,
            // Preserve the current saved amount
            currentAmount: goalToUpdate.currentAmount
        });

        setEditModalVisible(false);
        setEditingGoal(null);
        Alert.alert("Goal Updated", "Your savings goal has been successfully updated!");
    };

    const handleDeleteGoal = () => {
        Alert.alert(
            "Delete Goal",
            `Are you sure you want to delete "${editingGoal.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteSavingsGoal(editingGoal.id);
                        setEditModalVisible(false);
                        setEditingGoal(null);
                        Alert.alert("Goal Deleted", "The savings goal has been removed successfully.");
                    }
                }
            ]
        );
    };

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

    // Render functions updated for new data structure
    const renderSavingsGoal = ({ item }) => {
        const progressInfo = (financialMetrics?.savingsProgress || [])
            .find(progress => progress.id === item.id) || {
            saved: 0,
            percentage: 0
        };

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
                                width: `${Math.min(progressInfo.percentage, 100)}%`,
                                backgroundColor: progressInfo.percentage >= 100 ? '#4CAF50' : '#4CAF50'
                            }
                        ]}
                    />
                </View>
                <Text style={savingsTrackerStyles.goalText}>
                    Target: Ksh {item.targetAmount.toLocaleString()} | Saved: Ksh {progressInfo.saved.toLocaleString()}
                </Text>
                <Text style={[
                    savingsTrackerStyles.goalPercentage,
                    { color: progressInfo.percentage >= 100 ? '#4CAF50' : '#4CAF50' }
                ]}>
                    {Math.round(progressInfo.percentage)}% Complete
                </Text>
            </View>
        );
    };

    // Chart rendering with safety checks
    const renderChart = () => {
        // Filter goals with non-zero target amounts
        const goalsWithTargets = chartData.filter(goal => goal.target > 0);
        const relevantTotal = chartViewIndex === 0 ? totalSavings : totalTarget;

        if (!goalsWithTargets.length || relevantTotal === 0) {
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
                data={goalsWithTargets}
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
                                <Text style={savingsTrackerStyles.overviewLabel}>Total Saved</Text>
                                <Text style={savingsTrackerStyles.overviewAmount}>
                                    Ksh {currentMonthSavings.toLocaleString()}
                                </Text>
                            </View>
                            <View style={savingsTrackerStyles.overviewDivider} />
                            <View style={savingsTrackerStyles.overviewItem}>
                                <Text style={savingsTrackerStyles.overviewLabel}>Savings Rate</Text>
                                <Text style={[savingsTrackerStyles.overviewAmount, { color: totalTarget > totalSavings ? '#FF6B6B' : '#4CAF50' }]}>
                                    {savingsRate.toFixed(1)}%
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
                        data={savingsGoals}
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
                                    value={newGoal.targetAmount}
                                    onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
                                />

                                <TouchableOpacity
                                    style={[savingsTrackerStyles.modalAddButton, { backgroundColor: '#007AFF' }]}
                                    onPress={handleAddGoal}
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