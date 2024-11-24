import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, StatusBar, Alert, Pressable, Switch, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../layouts/ScreenLayout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';
import { PieChart } from 'react-native-chart-kit';
import budgetTrackerstyles from '../styles/BudgetTrackerStyles';
import { useInternalData } from '../contexts/InternalDataContext';

const CHART_COLORS = [
    '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
    '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC'
];

const BudgetTracker = () => {
    const { setCurrentScreen } = useAppContext();
    const {
        budgetData,
        setBudgetData,
        addBudgetCategory,
        updateBudgetCategory,
        deleteBudgetCategory,
        financialMetrics,
        getMonthKey
    } = useInternalData();

    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', budget: '', spent: 0 });
    const [editingCategory, setEditingCategory] = useState(null);
    const [tooltipVisible, setTooltipVisible] = useState(null);
    const [showLogTooltip, setShowLogTooltip] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showPercentages, setShowPercentages] = useState(false);
    const [chartViewIndex, setChartViewIndex] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    const screenWidth = Dimensions.get('window').width;

    const currentMonthKey = getMonthKey();

    useEffect(() => {
        setCurrentScreen('Budget Tracker');
    }, []);


    // Initialize monthly budget data with zero budgets
    useEffect(() => {
        if (!budgetData.monthlyBudgets) {
            // Initialize first month
            setBudgetData({
                ...budgetData,
                monthlyBudgets: {
                    [currentMonthKey]: {
                        categories: []
                    }
                }
            });
        } else if (!budgetData.monthlyBudgets[currentMonthKey]) {
            // Get category names from any existing month
            const existingMonths = Object.keys(budgetData.monthlyBudgets);
            const categoryTemplates = existingMonths.length > 0
                ? budgetData.monthlyBudgets[existingMonths[0]].categories.map(cat => ({
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    name: cat.name,
                    budget: 0, // Start with zero budget
                    spent: 0
                }))
                : [];

            setBudgetData({
                ...budgetData,
                monthlyBudgets: {
                    ...budgetData.monthlyBudgets,
                    [currentMonthKey]: {
                        categories: categoryTemplates
                    }
                }
            });
        }
    }, [currentMonthKey]);

    // Get current categories from budgetData using monthKey
    const currentCategories = useMemo(() => {
        return budgetData.monthlyBudgets?.[currentMonthKey]?.categories || [];
    }, [budgetData.monthlyBudgets, currentMonthKey]);

    // Enhanced with actual spending data from financialMetrics
    const { totalBudget, totalSpent, chartData, percentageAllocations } = useMemo(() => {
        const budgetComparison = financialMetrics?.budgetComparison || [];
        const categoriesWithMetrics = currentCategories.map(cat => {
            const metrics = budgetComparison.find(b => b.id === cat.id) || {};
            return {
                ...cat,
                spent: metrics.actual || 0
            };
        });

        const total = categoriesWithMetrics.reduce((sum, cat) => sum + cat.budget, 0);
        const spent = categoriesWithMetrics.reduce((sum, cat) => sum + cat.spent, 0);

        const pieData = categoriesWithMetrics
            .filter(cat => chartViewIndex === 0 ? cat.budget > 0 : cat.spent > 0)
            .map((cat, index) => ({
                name: cat.name,
                budget: cat.budget,
                spent: cat.spent,
                color: CHART_COLORS[index % CHART_COLORS.length],
                legendFontColor: '#7F7F7F',
                legendFontSize: 12,
                value: showPercentages
                    ? (chartViewIndex === 0
                        ? (total > 0 ? (cat.budget / total) * 100 : 0)
                        : (spent > 0 ? (cat.spent / spent) * 100 : 0))
                    : (chartViewIndex === 0 ? cat.budget : cat.spent)
            }));

        const allocations = categoriesWithMetrics
            .filter(cat => cat.budget > 0)
            .map(cat => ({
                name: cat.name,
                percentage: total > 0 ? ((cat.budget / total) * 100).toFixed(1) : '0'
            }));

        return { totalBudget: total, totalSpent: spent, chartData: pieData, percentageAllocations: allocations };
    }, [currentCategories, showPercentages, chartViewIndex, financialMetrics]);

    // Modified to use context functions
    const handleAddCategory = () => {
        if (!newCategory.name.trim()) {
            Alert.alert('Missing Information', 'Please enter a category name');
            return;
        }
        if (!newCategory.budget || isNaN(parseFloat(newCategory.budget))) {
            Alert.alert('Invalid Budget', 'Please enter a valid budget amount');
            return;
        }

        const budget = parseFloat(newCategory.budget);
        addBudgetCategory({
            name: newCategory.name.trim(),
            budget: budget
        }, currentMonthKey);

        setModalVisible(false);
        setNewCategory({ name: '', budget: '' });

        Alert.alert("Category Added", "New category has been added successfully!");
    };

    const handleEditBudget = (category) => {
        setEditingCategory({
            ...category,
            newName: category.name,
            newBudget: category.budget.toString()
        });
        setEditModalVisible(true);
    };

    const handleUpdateCategory = () => {
        if (!editingCategory.newName.trim()) {
            Alert.alert('Missing Information', 'Please enter a category name');
            return;
        }
        if (!editingCategory.newBudget || isNaN(parseFloat(editingCategory.newBudget))) {
            Alert.alert('Invalid Budget', 'Please enter a valid budget amount');
            return;
        }

        updateBudgetCategory(
            editingCategory.id,
            {
                name: editingCategory.newName.trim(),
                budget: parseFloat(editingCategory.newBudget)
            },
            currentMonthKey
        );

        setEditModalVisible(false);
        setEditingCategory(null);

        Alert.alert("Category Updated", "Your budget category has been successfully updated!");
    };

    const handleDeleteCategory = () => {
        Alert.alert(
            "Delete Category",
            `Are you sure you want to delete "${editingCategory.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteBudgetCategory(editingCategory.id, currentMonthKey);
                        setEditModalVisible(false);
                        setEditingCategory(null);
                        Alert.alert("Category Deleted", "The budget category has been removed successfully.");
                    }
                }
            ]
        );
    };

    const renderCategoryItem = ({ item }) => {
        const metrics = financialMetrics?.budgetComparison?.find(b => b.id === item.id) || {};
        const spentAmount = metrics.actual || 0;
        const spentPercentage = (spentAmount / item.budget) * 100;

        return (
            <View style={budgetTrackerstyles.categoryItem}>
                <View style={budgetTrackerstyles.categoryHeader}>
                    <Text style={budgetTrackerstyles.categoryName}>{item.name}</Text>
                    <TouchableOpacity
                        onPress={() => handleEditBudget(item)}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        style={budgetTrackerstyles.editIconContainer}
                    >
                        <Ionicons name="pencil" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <Text style={budgetTrackerstyles.spentAmount}>
                    Spent: Ksh {spentAmount.toLocaleString()}
                </Text>
                <Text style={budgetTrackerstyles.budgetAmount}>
                    Budget: Ksh {item.budget.toLocaleString()}
                </Text>

                <View style={budgetTrackerstyles.progressBarContainer}>
                    <View
                        style={[
                            budgetTrackerstyles.progressBar,
                            {
                                width: `${Math.min(spentPercentage, 100)}%`,
                                backgroundColor: spentPercentage > 90 ? '#FF6B6B' : '#4CAF50'
                            }
                        ]}
                    />
                </View>
            </View>
        );
    };

    const renderChart = () => {
        const hasData = chartData.length > 0;
        const relevantTotal = chartViewIndex === 0 ? totalBudget : totalSpent;

        if (!hasData || relevantTotal === 0) {
            return (
                <View style={budgetTrackerstyles.emptyChartContainer}>
                    <Text style={budgetTrackerstyles.emptyChartText}>
                        {chartViewIndex === 0
                            ? "No budget allocations for this month yet"
                            : "No expenses recorded for this month yet"}
                    </Text>
                    <Text style={budgetTrackerstyles.emptyChartSubtext}>
                        {chartViewIndex === 0
                            ? "Add budget to categories to see the distribution"
                            : "Record expenses to see the distribution"}
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
                accessor={showPercentages ? "value" : (chartViewIndex === 0 ? "budget" : "spent")}
                backgroundColor="transparent"
                paddingLeft="15"
                absolute={!showPercentages}
            />
        );
    };

    // Month Navigation Functions
    const formatMonthYear = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const handleMonthChange = (newDate) => {
        const newMonthKey = getMonthKey(newDate);

        // Ensure the new month exists in budgetData
        setBudgetData(prev => {
            if (!prev.monthlyBudgets[newMonthKey]) {
                const updatedBudgets = { ...prev.monthlyBudgets };
                const previousMonths = Object.keys(updatedBudgets).sort();
                const previousMonth = previousMonths[previousMonths.length - 1];

                // Copy categories from previous month with zero budgets
                updatedBudgets[newMonthKey] = {
                    categories: prev.monthlyBudgets[previousMonth]?.categories.map(cat => ({
                        ...cat,
                        budget: 0,
                        spent: 0
                    })) || []
                };

                return {
                    ...prev,
                    monthlyBudgets: updatedBudgets
                };
            }
            return prev;
        });

        setCurrentDate(newDate);
    };

    // Month on Month View
    const MonthNavigation = () => (
        <View style={budgetTrackerstyles.monthNavigationContainer}>
            <TouchableOpacity
                onPress={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(currentDate.getMonth() - 1);
                    handleMonthChange(newDate);
                }}
                style={budgetTrackerstyles.monthNavigationButton}
            >
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <Text style={budgetTrackerstyles.currentMonthText}>
                {formatMonthYear(currentDate)}
            </Text>

            <TouchableOpacity
                onPress={() => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(currentDate.getMonth() + 1);
                    handleMonthChange(newDate);
                }}
                style={budgetTrackerstyles.monthNavigationButton}
            >
                <Ionicons name="chevron-forward" size={24} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );

    const screenHeaderProps = {
        title: "Budget Tracker",
        tooltipContent: "It's time to Budget! This is where you will really set your Business apart from the rest. Plan your spending and track your progress here.",
        showTooltip: showLogTooltip,
        setShowTooltip: setShowLogTooltip
    };

    return (
        <SafeAreaView style={budgetTrackerstyles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScreenLayout headerProps={screenHeaderProps}>
                <View style={budgetTrackerstyles.container}>
                    <MonthNavigation />

                    {/* Add Category Button */}
                    <TouchableOpacity
                        style={budgetTrackerstyles.floatingAddButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                        <Text style={budgetTrackerstyles.addButtonText}>Add Category</Text>
                    </TouchableOpacity>

                    {/* Budget Overview */}
                    <View style={budgetTrackerstyles.overviewContainer}>
                        <Text style={budgetTrackerstyles.overviewTitle}>Total Budget Overview</Text>
                        <View style={budgetTrackerstyles.overviewDetails}>
                            <View style={budgetTrackerstyles.overviewItem}>
                                <Text style={budgetTrackerstyles.overviewLabel}>Budget</Text>
                                <Text style={budgetTrackerstyles.overviewAmount}>
                                    Ksh {totalBudget.toLocaleString()}
                                </Text>
                            </View>
                            <View style={budgetTrackerstyles.overviewDivider} />
                            <View style={budgetTrackerstyles.overviewItem}>
                                <Text style={budgetTrackerstyles.overviewLabel}>Spent</Text>
                                <Text style={[budgetTrackerstyles.overviewAmount, { color: totalSpent > totalBudget ? '#FF6B6B' : '#4CAF50' }]}>
                                    Ksh {totalSpent.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                        <Text style={budgetTrackerstyles.overviewSubtext}>
                            💡 Tip: A clear budget helps you make informed decisions and track business growth
                        </Text>
                    </View>

                    {/* Budget Tracker chart section */}
                    <View style={budgetTrackerstyles.chartContainer}>
                        <View style={budgetTrackerstyles.chartHeader}>
                            <Text style={budgetTrackerstyles.chartTitle}>Budget Allocation</Text>
                            <View style={budgetTrackerstyles.chartControls}>
                                <View style={budgetTrackerstyles.toggleContainer}>
                                    <Text style={budgetTrackerstyles.toggleLabel}>Show %</Text>
                                    <Switch
                                        value={showPercentages}
                                        onValueChange={setShowPercentages}
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={showPercentages ? "#007AFF" : "#f4f3f4"}
                                    />
                                </View>
                                <View style={budgetTrackerstyles.toggleContainer}>
                                    <Text style={budgetTrackerstyles.toggleLabel}>Chart</Text>
                                    <Switch
                                        value={showChart}
                                        onValueChange={setShowChart}
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={showChart ? "#007AFF" : "#f4f3f4"}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={budgetTrackerstyles.chartFilterContainer}>
                            <TouchableOpacity
                                style={[
                                    budgetTrackerstyles.chartViewButton,
                                    chartViewIndex === 0 && budgetTrackerstyles.activeChartViewButton
                                ]}
                                onPress={() => setChartViewIndex(0)}
                            >
                                <Text style={[
                                    budgetTrackerstyles.chartViewButtonText,
                                    chartViewIndex === 0 && budgetTrackerstyles.activeChartViewButtonText
                                ]}>
                                    By Budget
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    budgetTrackerstyles.chartViewButton,
                                    chartViewIndex === 1 && budgetTrackerstyles.activeChartViewButton
                                ]}
                                onPress={() => setChartViewIndex(1)}
                            >
                                <Text style={[
                                    budgetTrackerstyles.chartViewButtonText,
                                    chartViewIndex === 1 && budgetTrackerstyles.activeChartViewButtonText
                                ]}>
                                    By Spent
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showChart && (
                            <View style={budgetTrackerstyles.chartWrapper}>
                                {renderChart()}
                            </View>
                        )}
                    </View>

                    {/* Categories List */}
                    <FlatList
                        data={currentCategories}
                        renderItem={renderCategoryItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={budgetTrackerstyles.goalsListContent}
                        ListEmptyComponent={() => (
                            <View style={budgetTrackerstyles.emptyChartContainer}>
                                <Text style={budgetTrackerstyles.emptyListText}>
                                    No Budget set yet
                                </Text>
                                <Text style={budgetTrackerstyles.emptyListSubtext}>
                                    Tap the "Add Category" button to create your first Budget
                                </Text>
                            </View>
                        )}
                    />

                    {/* Add Category Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={budgetTrackerstyles.modalOverlay}>
                            <View style={budgetTrackerstyles.modalView}>
                                <View style={budgetTrackerstyles.modalHeader}>
                                    <Text style={budgetTrackerstyles.modalTitle}>Add New Category</Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={budgetTrackerstyles.modalCloseButton}
                                    >
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={budgetTrackerstyles.modalTip}>
                                    💡 Create specific categories to better track different aspects of your business
                                </Text>

                                <TextInput
                                    style={budgetTrackerstyles.input}
                                    placeholder="Category Name (e.g., Inventory, Marketing)"
                                    value={newCategory.name}
                                    onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
                                />

                                <TextInput
                                    style={budgetTrackerstyles.input}
                                    placeholder="Budget Amount (Ksh)"
                                    keyboardType="numeric"
                                    value={newCategory.budget}
                                    onChangeText={(text) => setNewCategory({ ...newCategory, budget: text })}
                                />

                                <TouchableOpacity
                                    style={[budgetTrackerstyles.modalAddButton, { backgroundColor: '#007AFF' }]}
                                    onPress={handleAddCategory}
                                >
                                    <Text style={[budgetTrackerstyles.modalAddButtonText, { color: '#FFFFFF' }]}>
                                        Add Category
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* Edit Category Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={editModalVisible}
                        onRequestClose={() => setEditModalVisible(false)}
                    >
                        <View style={budgetTrackerstyles.modalOverlay}>
                            <View style={budgetTrackerstyles.modalView}>
                                <View style={budgetTrackerstyles.modalHeader}>
                                    <Text style={budgetTrackerstyles.modalTitle}>Edit Category</Text>
                                    <TouchableOpacity
                                        onPress={() => setEditModalVisible(false)}
                                        style={budgetTrackerstyles.modalCloseButton}
                                    >
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={budgetTrackerstyles.modalTip}>
                                    💡 Update your category details or delete if no longer needed
                                </Text>

                                <TextInput
                                    style={budgetTrackerstyles.input}
                                    placeholder="Category Name"
                                    value={editingCategory?.newName}
                                    onChangeText={(text) => setEditingCategory({
                                        ...editingCategory,
                                        newName: text
                                    })}
                                />

                                <TextInput
                                    style={budgetTrackerstyles.input}
                                    placeholder="Budget Amount (Ksh)"
                                    keyboardType="numeric"
                                    value={editingCategory?.newBudget}
                                    onChangeText={(text) => setEditingCategory({
                                        ...editingCategory,
                                        newBudget: text
                                    })}
                                />

                                <View style={budgetTrackerstyles.editModalButtons}>
                                    <TouchableOpacity
                                        style={[budgetTrackerstyles.modalAddButton, { backgroundColor: '#007AFF' }]}
                                        onPress={handleUpdateCategory}
                                    >
                                        <Text style={[budgetTrackerstyles.modalAddButtonText, { color: '#FFFFFF' }]}>
                                            Update Category
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[budgetTrackerstyles.modalDeleteButton]}
                                        onPress={handleDeleteCategory}
                                    >
                                        <Text style={budgetTrackerstyles.modalDeleteButtonText}>
                                            Delete Category
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

export default BudgetTracker;