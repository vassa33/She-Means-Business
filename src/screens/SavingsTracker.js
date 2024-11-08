import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
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
    const [savingsGoals, setSavingsGoals] = useState([
        { id: '1', name: 'Campaign', target: 30000, saved: 5300 },
        { id: '2', name: 'Equipment', target: 42000, saved: 21000 },
        { id: '3', name: 'Expansion', target: 125000, saved: 12000 },
        { id: '4', name: 'Tech Upgrade', target: 90500, saved: 2000 },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', target: '' });
    const [editingGoal, setEditingGoal] = useState(null);
    const [showChart, setShowChart] = useState(true);
    const [showPercentages, setShowPercentages] = useState(false);
    const [showLogTooltip, setShowLogTooltip] = useState(false);
    const [chartViewIndex, setChartViewIndex] = useState(0); // 0 for saved, 1 for target
    const screenWidth = Dimensions.get('window').width;

    const { totalSavings, totalTarget, chartData } = useMemo(() => {
        const total = savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);
        const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
        const pieDataBySaved = savingsGoals.map((goal, index) => ({
            name: goal.name,
            value: showPercentages ? ((goal.saved / total) * 100) : goal.saved,
            color: CHART_COLORS[index % CHART_COLORS.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 12
        }));
        const pieDataByTarget = savingsGoals.map((goal, index) => ({
            name: goal.name,
            value: showPercentages ? ((goal.target / totalTarget) * 100) : goal.target,
            color: CHART_COLORS[index % CHART_COLORS.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 12
        }));

        return {
            totalSavings: total,
            totalTarget,
            chartData: chartViewIndex === 0 ? pieDataBySaved : pieDataByTarget
        };
    }, [savingsGoals, showPercentages, chartViewIndex]);

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

        const updatedGoals = savingsGoals.map(goal => {
            if (goal.id === editingGoal.id) {
                return {
                    ...goal,
                    name: editingGoal.newName.trim(),
                    target: parseFloat(editingGoal.newTarget),
                    saved: parseFloat(editingGoal.newSaved)
                };
            }
            return goal;
        });

        setSavingsGoals(updatedGoals);
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
            `Are you sure you want to delete "${editingGoal.name}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        const updatedGoals = savingsGoals.filter(
                            goal => goal.id !== editingGoal.id
                        );
                        setSavingsGoals(updatedGoals);
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

        setSavingsGoals([
            ...savingsGoals,
            {
                id: Date.now().toString(),
                name: newGoal.name.trim(),
                target: parseFloat(newGoal.target),
                saved: 0,
            },
        ]);
        setModalVisible(false);
        setNewGoal({ name: '', target: '' });

        Alert.alert(
            "Goal Added",
            "Your new savings goal has been added successfully!"
        );
    };

    const renderSavingsGoal = ({ item }) => {
        const progressPercentage = (item.saved / item.target) * 100;
        return (
            <View style={styles.goalItem}>
                <View style={styles.goalHeader}>
                    <Text style={styles.goalName}>{item.name}</Text>
                    <TouchableOpacity
                        onPress={() => handleEditGoal(item)}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <Ionicons name="pencil" size={20} color="#666" />
                    </TouchableOpacity>
                </View>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${Math.min(progressPercentage, 100)}%`,
                                backgroundColor: progressPercentage >= 100 ? '#4CAF50' : '#4CAF50'
                            }
                        ]}
                    />
                </View>
                <Text style={styles.goalText}>
                    Target: Ksh {item.target.toLocaleString()} | Saved: Ksh {item.saved.toLocaleString()}
                </Text>
                <Text style={[
                    styles.goalPercentage,
                    { color: progressPercentage >= 100 ? '#4CAF50' : '#4CAF50' }
                ]}>
                    {Math.round(progressPercentage)}% Complete
                </Text>
            </View>
        );
    };

    const screenHeaderProps = {
        title: "Savings Tracker",
        tooltipContent: "Track your savings goals and watch your money grow! Set targets and monitor your progress here.",
        showTooltip: showLogTooltip,
        setShowTooltip: setShowLogTooltip
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScreenLayout headerProps={screenHeaderProps}>
                <View style={styles.container}>
                    {/* Total Savings Overview */}
                    <View style={styles.overviewContainer}>
                        <Text style={styles.overviewTitle}>Total Savings Overview</Text>
                        <View style={styles.overviewDetails}>
                            <View style={styles.overviewItem}>
                                <Text style={styles.overviewLabel}>Target</Text>
                                <Text style={styles.overviewAmount}>
                                    Ksh {totalTarget.toLocaleString()}
                                </Text>
                            </View>
                            <View style={styles.overviewDivider} />
                            <View style={styles.overviewItem}>
                                <Text style={styles.overviewLabel}>Saved</Text>
                                <Text style={[styles.overviewAmount, { color: totalTarget > totalSavings ? '#FF6B6B' : '#4CAF50' }]}>
                                    Ksh {totalSavings.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.overviewSubtext}>
                            💡 Regular savings help build a strong financial foundation
                        </Text>
                    </View>

                    {/* Chart Section */}
                    <View style={styles.chartContainer}>
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Savings Allocation</Text>
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
                                    By Saved
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
                                    By Target
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showChart && savingsGoals.length > 0 && (
                            <View style={styles.chartWrapper}>
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
                            </View>
                        )}
                    </View>

                    {/* Savings Goals List */}
                    <FlatList
                        data={savingsGoals}
                        renderItem={renderSavingsGoal}
                        keyExtractor={item => item.id}
                    />

                    {/* Add Goal Button */}
                    <TouchableOpacity
                        style={styles.floatingAddButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                        <Text style={styles.addButtonText}>Add Goal</Text>
                    </TouchableOpacity>

                    {/* Add Goal Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalView}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Add New Savings Goal</Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={styles.modalCloseButton}
                                    >
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.modalTip}>
                                    💡 Set specific, achievable savings goals for your business growth
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Goal Name (e.g., Emergency Fund)"
                                    value={newGoal.name}
                                    onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Target Amount (Ksh)"
                                    keyboardType="numeric"
                                    value={newGoal.target}
                                    onChangeText={(text) => setNewGoal({ ...newGoal, target: text })}
                                />

                                <TouchableOpacity
                                    style={[styles.modalAddButton, { backgroundColor: '#007AFF' }]}
                                    onPress={addSavingsGoal}
                                >
                                    <Text style={[styles.modalAddButtonText, { color: '#FFFFFF' }]}>
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
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalView}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Edit Savings Goal</Text>
                                    <TouchableOpacity
                                        onPress={() => setEditModalVisible(false)}
                                        style={styles.modalCloseButton}
                                    >
                                        <Ionicons name="close" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.modalTip}>
                                    💡 Update your goal details or adjust your progress
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Goal Name"
                                    value={editingGoal?.newName}
                                    onChangeText={(text) => setEditingGoal({
                                        ...editingGoal,
                                        newName: text
                                    })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Target Amount (Ksh)"
                                    keyboardType="numeric"
                                    value={editingGoal?.newTarget}
                                    onChangeText={(text) => setEditingGoal({
                                        ...editingGoal,
                                        newTarget: text
                                    })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Amount Saved (Ksh)"
                                    keyboardType="numeric"
                                    value={editingGoal?.newSaved}
                                    onChangeText={(text) => setEditingGoal({
                                        ...editingGoal,
                                        newSaved: text
                                    })}
                                />

                                <View style={styles.editModalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalAddButton, { backgroundColor: '#007AFF' }]}
                                        onPress={handleUpdateGoal}
                                    >
                                        <Text style={[styles.modalAddButtonText, { color: '#FFFFFF' }]}>
                                            Update Goal
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalDeleteButton]}
                                        onPress={handleDeleteGoal}
                                    >
                                        <Text style={styles.modalDeleteButtonText}>
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

//Savings Tracker styles
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
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        color: '#444',
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

    // Goals List
    goalItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
    },
    goalText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    goalPercentage: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        marginVertical: 8,
    },
    progressFill: {
        height: 12,
        borderRadius: 6,
    },

    // Floating Add Button
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
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#444',
    },
    modalCloseButton: {
        padding: 5,
    },
    modalTip: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    modalAddButton: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    modalAddButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    editModalButtons: {
        width: '100%',
        gap: 10,
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
});

export default SavingsTracker;