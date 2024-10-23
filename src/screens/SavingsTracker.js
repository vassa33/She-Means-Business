import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../layouts/ScreenLayout';

const SavingsTracker = () => {
    const [savingsGoals, setSavingsGoals] = useState([
        { id: '1', name: 'Emergency Fund', target: 1000, saved: 700 },
        { id: '2', name: 'New Equipment', target: 500, saved: 200 },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [newGoal, setNewGoal] = useState({ name: '', target: '' });

    const renderSavingsGoal = ({ item }) => (
        <View style={styles.goalItem}>
            <Text style={styles.goalName}>{item.name}</Text>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(item.saved / item.target) * 100}%` }]} />
            </View>
            <Text style={styles.goalText}>
                Target: Ksh {item.target} | Saved: Ksh {item.saved}
            </Text>
            <Text style={styles.goalPercentage}>
                {Math.round((item.saved / item.target) * 100)}% Complete
            </Text>
        </View>
    );

    const addSavingsGoal = () => {
        if (newGoal.name && newGoal.target) {
            setSavingsGoals([
                ...savingsGoals,
                {
                    id: Date.now().toString(),
                    name: newGoal.name,
                    target: parseFloat(newGoal.target),
                    saved: 0,
                },
            ]);
            setModalVisible(false);
            setNewGoal({ name: '', target: '' });
        }
    };

    const totalSavings = savingsGoals.reduce((sum, goal) => sum + goal.saved, 0);

    const screenHeaderProps = {
        title: "Savings Tracker"
    };

    return (
        <ScreenLayout headerProps={screenHeaderProps}>
            <View style={styles.container}>
                {/* Savings Goals List */}
                <FlatList
                    data={savingsGoals}
                    renderItem={renderSavingsGoal}
                    keyExtractor={item => item.id}
                    style={styles.goalList}
                />

                {/* Add Savings Goal Button */}
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>Add Savings Goal</Text>
                </TouchableOpacity>

                {/* Total Savings */}
                <View style={styles.totalSavingsContainer}>
                    <Text style={styles.totalSavingsTitle}>Total Savings</Text>
                    <Text style={styles.totalSavingsAmount}>Ksh {totalSavings}</Text>
                </View>

                {/* Add Savings Goal Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Add New Savings Goal</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Goal Name"
                            value={newGoal.name}
                            onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Target Amount"
                            keyboardType="numeric"
                            value={newGoal.target}
                            onChangeText={(text) => setNewGoal({ ...newGoal, target: text })}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addSavingsGoal}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    goalList: {
        flex: 1,
    },
    goalItem: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    goalName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    progressBar: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginBottom: 5,
    },
    progressFill: {
        height: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    goalText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    goalPercentage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    totalSavingsContainer: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    totalSavingsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    totalSavingsAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    cancelButton: {
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});

export default SavingsTracker;