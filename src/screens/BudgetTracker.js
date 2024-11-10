import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, TextInput, StatusBar, Alert, Pressable, Switch, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../layouts/ScreenLayout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { PieChart } from 'react-native-chart-kit';
import budgetTrackerstyles from '../styles/BudgetTrackerStyles';

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


const BudgetTracker = () => {
    const { setCurrentScreen, budgetData, setBudgetData } = useAppContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', budget: '', spent: 0 });
    const [editingCategory, setEditingCategory] = useState(null);
    const [tooltipVisible, setTooltipVisible] = useState(null);
    const [showLogTooltip, setShowLogTooltip] = useState(false);
    const [showChart, setShowChart] = useState(false);
    const [showPercentages, setShowPercentages] = useState(false);
    const [chartViewIndex, setChartViewIndex] = useState(0); // 0 for budget, 1 for spent
    const screenWidth = Dimensions.get('window').width;

    const educationalTips = {
        low: "💡 Tip: Consider allocating 20-30% of your budget to business growth activities.",
        medium: "💡 Tip: Having 3-6 months of operating expenses as emergency fund is recommended.",
        high: "💡 Tip: Consider reinvesting excess budget into inventory or equipment."
    };

    useEffect(() => {
        setCurrentScreen('Budget Tracker');
    }, []);

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

    // Modified data structure to handle monthly budgets
    const getMonthKey = (date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
    };

    const currentMonthKey = getMonthKey(currentDate);

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

    // Modified to use monthly categories
    const currentCategories = useMemo(() => {
        return budgetData.monthlyBudgets?.[currentMonthKey]?.categories || [];
    }, [budgetData.monthlyBudgets, currentMonthKey]);

    // Add month navigation UI at the top
    const MonthNavigation = () => (
        <View style={budgetTrackerstyles.monthNavigationContainer}>
            <TouchableOpacity
                onPress={goToPreviousMonth}
                style={budgetTrackerstyles.monthNavigationButton}
            >
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>

            <Text style={budgetTrackerstyles.currentMonthText}>
                {formatMonthYear(currentDate)}
            </Text>

            <TouchableOpacity
                onPress={goToNextMonth}
                style={budgetTrackerstyles.monthNavigationButton}
            >
                <Ionicons name="chevron-forward" size={24} color="#007AFF" />
            </TouchableOpacity>
        </View>
    );

    // Chart data calculations with safety checks
    const { totalBudget, totalSpent, chartData, percentageAllocations } = useMemo(() => {
        const total = currentCategories.reduce((sum, cat) => sum + cat.budget, 0);
        const spent = currentCategories.reduce((sum, cat) => sum + (cat.spent || 0), 0);

        // Only create chart data if we have valid numbers to show
        const pieData = currentCategories
            .filter(cat => {
                // For budget view, include categories with budget > 0
                // For spent view, include categories with spent > 0
                return chartViewIndex === 0 ? cat.budget > 0 : cat.spent > 0;
            })
            .map((cat, index) => {
                const value = showPercentages
                    ? (chartViewIndex === 0
                        ? (total > 0 ? (cat.budget / total) * 100 : 0)
                        : (spent > 0 ? (cat.spent / spent) * 100 : 0))
                    : (chartViewIndex === 0 ? cat.budget : cat.spent);

                return {
                    name: cat.name,
                    budget: cat.budget,
                    spent: cat.spent || 0,
                    color: CHART_COLORS[index % CHART_COLORS.length],
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12,
                    value: value
                };
            });

        const allocations = currentCategories
            .filter(cat => cat.budget > 0)
            .map(cat => ({
                name: cat.name,
                percentage: total > 0 ? ((cat.budget / total) * 100).toFixed(1) : '0'
            }));

        return {
            totalBudget: total,
            totalSpent: spent,
            chartData: pieData,
            percentageAllocations: allocations
        };
    }, [currentCategories, showPercentages, chartViewIndex]);

    const addCategory = () => {
        if (!newCategory.name.trim()) {
            Alert.alert('Missing Information', 'Please enter a category name');
            return;
        }
        if (!newCategory.budget || isNaN(parseFloat(newCategory.budget))) {
            Alert.alert('Invalid Budget', 'Please enter a valid budget amount');
            return;
        }

        const budget = parseFloat(newCategory.budget);
        const newCategoryItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: newCategory.name.trim(),
            budget: budget,
            spent: 0,
        };

        // Add category to all months with zero budget except current month
        const updatedMonthlyBudgets = { ...budgetData.monthlyBudgets };
        Object.keys(updatedMonthlyBudgets).forEach(monthKey => {
            if (monthKey !== currentMonthKey) {
                updatedMonthlyBudgets[monthKey] = {
                    ...updatedMonthlyBudgets[monthKey],
                    categories: [
                        ...updatedMonthlyBudgets[monthKey].categories,
                        { ...newCategoryItem, budget: 0, spent: 0 }
                    ]
                };
            }
        });

        // Add category to current month with specified budget
        updatedMonthlyBudgets[currentMonthKey] = {
            ...updatedMonthlyBudgets[currentMonthKey],
            categories: [
                ...(updatedMonthlyBudgets[currentMonthKey]?.categories || []),
                newCategoryItem
            ]
        };

        setBudgetData({
            ...budgetData,
            monthlyBudgets: updatedMonthlyBudgets
        });

        setModalVisible(false);
        setNewCategory({ name: '', budget: '', spent: 0 });

        Alert.alert(
            "Category Added",
            "New category has been added successfully!"
        );
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

        const updatedMonthlyBudgets = { ...budgetData.monthlyBudgets };

        // Update category name across all months
        Object.keys(updatedMonthlyBudgets).forEach(monthKey => {
            updatedMonthlyBudgets[monthKey] = {
                ...updatedMonthlyBudgets[monthKey],
                categories: updatedMonthlyBudgets[monthKey].categories.map(cat => {
                    if (cat.id === editingCategory.id) {
                        return {
                            ...cat,
                            name: editingCategory.newName.trim(),
                            // Only update budget for current month
                            budget: monthKey === currentMonthKey
                                ? parseFloat(editingCategory.newBudget)
                                : cat.budget
                        };
                    }
                    return cat;
                })
            };
        });

        setBudgetData({
            ...budgetData,
            monthlyBudgets: updatedMonthlyBudgets
        });

        setEditModalVisible(false);
        setEditingCategory(null);

        Alert.alert(
            "Category Updated",
            "Your budget category has been successfully updated!"
        );
    };

    // Updated handleDeleteCategory function
    const handleDeleteCategory = () => {
        Alert.alert(
            "Delete Category",
            `Are you sure you want to delete "${editingCategory.name}"? This will remove the category from all months.`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // Remove category from all months
                        const updatedMonthlyBudgets = Object.keys(budgetData.monthlyBudgets).reduce((acc, monthKey) => {
                            acc[monthKey] = {
                                ...budgetData.monthlyBudgets[monthKey],
                                categories: budgetData.monthlyBudgets[monthKey].categories
                                    .filter(cat => cat.id !== editingCategory.id)
                            };
                            return acc;
                        }, {});

                        setBudgetData({
                            ...budgetData,
                            monthlyBudgets: updatedMonthlyBudgets
                        });

                        setEditModalVisible(false);
                        setEditingCategory(null);

                        Alert.alert(
                            "Category Deleted",
                            "The budget category has been removed successfully from all months."
                        );
                    }
                }
            ]
        );
    };

    const renderCategoryItem = ({ item }) => {
        const spentPercentage = (item.spent / item.budget) * 100;

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
                    Spent: Ksh {(item.spent || 0).toLocaleString()}
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
                                    onPress={addCategory}
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