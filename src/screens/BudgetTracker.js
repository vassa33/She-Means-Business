import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, StatusBar, Alert, Pressable, Switch, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../layouts/ScreenLayout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { PieChart } from 'react-native-chart-kit';

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
    const [showChart, setShowChart] = useState(true);
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

    const { totalBudget, totalSpent, chartData, percentageAllocations } = useMemo(() => {
        const total = budgetData.categories.reduce((sum, cat) => sum + cat.budget, 0);
        const spent = budgetData.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);

        const pieData = budgetData.categories.map((cat, index) => ({
            name: cat.name,
            budget: cat.budget,
            spent: cat.spent || 0,
            color: CHART_COLORS[index % CHART_COLORS.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
            value: showPercentages ? (chartViewIndex === 0 ? (cat.budget / total) * 100 : (cat.spent / spent) * 100) : (chartViewIndex === 0 ? cat.budget : cat.spent)
        }));

        const allocations = budgetData.categories.map(cat => ({
            name: cat.name,
            percentage: ((cat.budget / total) * 100).toFixed(1)
        }));

        return {
            totalBudget: total,
            totalSpent: spent,
            chartData: pieData,
            percentageAllocations: allocations
        };
    }, [budgetData.categories, showPercentages, chartViewIndex]);

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
        const newCategories = [
            ...budgetData.categories,
            {
                id: Date.now().toString(),
                name: newCategory.name.trim(),
                budget: budget,
                spent: 0,
            },
        ];

        setBudgetData({ ...budgetData, categories: newCategories });
        setModalVisible(false);
        setNewCategory({ name: '', budget: '', spent: 0 });

        Alert.alert(
            "Category Added",
            "Tip: A well-organized budget helps you make informed business decisions."
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

        const updatedCategories = budgetData.categories.map(cat => {
            if (cat.id === editingCategory.id) {
                return {
                    ...cat,
                    name: editingCategory.newName.trim(),
                    budget: parseFloat(editingCategory.newBudget)
                };
            }
            return cat;
        });

        setBudgetData({ ...budgetData, categories: updatedCategories });
        setEditModalVisible(false);
        setEditingCategory(null);

        Alert.alert(
            "Category Updated",
            "Your budget category has been successfully updated!"
        );
    };

    const handleDeleteCategory = () => {
        Alert.alert(
            "Delete Category",
            `Are you sure you want to delete "${editingCategory.name}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const updatedCategories = budgetData.categories.filter(
                            cat => cat.id !== editingCategory.id
                        );
                        setBudgetData({ ...budgetData, categories: updatedCategories });
                        setEditModalVisible(false);
                        setEditingCategory(null);
                        Alert.alert(
                            "Category Deleted",
                            "The budget category has been removed successfully."
                        );
                    }
                }
            ]
        );
    };

    const renderCategoryItem = ({ item }) => {
        const spentPercentage = (item.spent / item.budget) * 100;

        return (
            <View style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{item.name}</Text>
                    <TouchableOpacity
                        onPress={() => handleEditBudget(item)}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        style={styles.editIconContainer}
                    >
                        <Ionicons name="pencil" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.spentAmount}>
                    Spent: Ksh {(item.spent || 0).toLocaleString()}
                </Text>
                <Text style={styles.budgetAmount}>
                    Budget: Ksh {item.budget.toLocaleString()}
                </Text>

                <View style={styles.progressBarContainer}>
                    <View
                        style={[
                            styles.progressBar,
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

    const screenHeaderProps = {
        title: "Budget Tracker",
        tooltipContent: "It's time to Budget! This is where you will really set your Business apart from the rest. Plan your spending and track your progress here.",
        showTooltip: showLogTooltip,
        setShowTooltip: setShowLogTooltip
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScreenLayout headerProps={screenHeaderProps}>
                <View style={styles.container}>
                    {/* Add Category Button */}
                    <TouchableOpacity
                        style={styles.floatingAddButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>Add Category</Text>
                    </TouchableOpacity>

                    {/* Budget Overview */}
                    <View style={styles.overviewContainer}>
                        <Text style={styles.overviewTitle}>Total Budget Overview</Text>
                        <View style={styles.overviewDetails}>
                            <View style={styles.overviewItem}>
                                <Text style={styles.overviewLabel}>Budget</Text>
                                <Text style={styles.overviewAmount}>
                                    Ksh {totalBudget.toLocaleString()}
                                </Text>
                            </View>
                            <View style={styles.overviewDivider} />
                            <View style={styles.overviewItem}>
                                <Text style={styles.overviewLabel}>Spent</Text>
                                <Text style={[styles.overviewAmount, { color: totalSpent > totalBudget ? '#FF6B6B' : '#4CAF50' }]}>
                                    Ksh {totalSpent.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.overviewSubtext}>
                            💡 Tip: A clear budget helps you make informed decisions and track business growth
                        </Text>
                    </View>

                    {/* Budget Tracker chart section */}
                    <View style={styles.chartContainer}>
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Budget Allocation</Text>
                            <View style={styles.chartControls}>
                                <View style={styles.toggleContainer}>
                                    <Text style={styles.toggleLabel}>Show %</Text>
                                    <Switch
                                        value={showPercentages}
                                        onValueChange={setShowPercentages}
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={showPercentages ? "#007AFF" : "#f4f3f4"}
                                    />
                                </View>
                                <View style={styles.toggleContainer}>
                                    <Text style={styles.toggleLabel}>Chart</Text>
                                    <Switch
                                        value={showChart}
                                        onValueChange={setShowChart}
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={showChart ? "#007AFF" : "#f4f3f4"}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.chartFilterContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.chartViewButton,
                                    chartViewIndex === 0 && styles.activeChartViewButton
                                ]}
                                onPress={() => setChartViewIndex(0)}
                            >
                                <Text style={[
                                    styles.chartViewButtonText,
                                    chartViewIndex === 0 && styles.activeChartViewButtonText
                                ]}>
                                    By Budget
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.chartViewButton,
                                    chartViewIndex === 1 && styles.activeChartViewButton
                                ]}
                                onPress={() => setChartViewIndex(1)}
                            >
                                <Text style={[
                                    styles.chartViewButtonText,
                                    chartViewIndex === 1 && styles.activeChartViewButtonText
                                ]}>
                                    By Spent
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showChart && budgetData.categories.length > 0 && (
                            <View style={styles.chartWrapper}>
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
                            </View>
                        )}
                    </View>

                    {/* Categories List */}
                    <FlatList
                        data={budgetData.categories}
                        renderItem={renderCategoryItem}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Add Category Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalView}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Add New Category</Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={styles.modalCloseButton}
                                    >
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.modalTip}>
                                    💡 Create specific categories to better track different aspects of your business
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Category Name (e.g., Inventory, Marketing)"
                                    value={newCategory.name}
                                    onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Budget Amount (Ksh)"
                                    keyboardType="numeric"
                                    value={newCategory.budget}
                                    onChangeText={(text) => setNewCategory({ ...newCategory, budget: text })}
                                />

                                <TouchableOpacity
                                    style={[styles.modalAddButton, { backgroundColor: '#007AFF' }]}
                                    onPress={addCategory}
                                >
                                    <Text style={[styles.modalAddButtonText, { color: '#FFFFFF' }]}>
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
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalView}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Edit Category</Text>
                                    <TouchableOpacity
                                        onPress={() => setEditModalVisible(false)}
                                        style={styles.modalCloseButton}
                                    >
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.modalTip}>
                                    💡 Update your category details or delete if no longer needed
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Category Name"
                                    value={editingCategory?.newName}
                                    onChangeText={(text) => setEditingCategory({
                                        ...editingCategory,
                                        newName: text
                                    })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Budget Amount (Ksh)"
                                    keyboardType="numeric"
                                    value={editingCategory?.newBudget}
                                    onChangeText={(text) => setEditingCategory({
                                        ...editingCategory,
                                        newBudget: text
                                    })}
                                />

                                <View style={styles.editModalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalAddButton, { backgroundColor: '#007AFF' }]}
                                        onPress={handleUpdateCategory}
                                    >
                                        <Text style={[styles.modalAddButtonText, { color: '#FFFFFF' }]}>
                                            Update Category
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalDeleteButton]}
                                        onPress={handleDeleteCategory}
                                    >
                                        <Text style={styles.modalDeleteButtonText}>
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

//Budget Tracker styles
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    // Overview Section
    overviewContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
    },
    overviewTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    overviewAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    overviewSubtext: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    overviewDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    overviewItem: {
        flex: 1,
        alignItems: 'center',
    },
    overviewLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    overviewDivider: {
        width: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 16,
    },

    // Chart Section
    chartContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chartControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleLabel: {
        marginRight: 8,
        fontSize: 14,
        color: '#666',
    },
    chartWrapper: {
        alignItems: 'center',
    },
    chartFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    chartViewButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginHorizontal: 6,
    },
    activeChartViewButton: {
        backgroundColor: '#81b0ff',
    },
    chartViewButtonText: {
        fontSize: 14,
        color: '#666',
    },
    activeChartViewButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    categoryItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginTop: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    spentAmount: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    editButton: {
        padding: 8,
    },
    percentageText: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    budgetAmount: {
        fontSize: 14,
        color: '#666',
    },
    educationalTip: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tipText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        flex: 1,
    },
    tipCloseButton: {
        padding: 4,
    },
    tipCloseText: {
        fontSize: 16,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        alignItems: "stretch",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#333',
    },
    modalTip: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalAddButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginBottom: 12,
    },
    modalAddButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalDeleteButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FF6B6B',
    },
    modalDeleteButtonText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '600',
    },
    editModalButtons: {
        marginTop: 8,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    floatingAddButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 12,
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    }
});

export default BudgetTracker;