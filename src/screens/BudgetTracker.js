import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../layouts/ScreenLayout';

const BudgetTracker = () => {
    const [budgetCategories, setBudgetCategories] = useState([
        { id: '1', name: 'Food', budget: 5000, spent: 3500 },
        { id: '2', name: 'Transportation', budget: 3000, spent: 2000 },
        { id: '3', name: 'Utilities', budget: 2000, spent: 1800 },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', budget: '' });

    const renderCategoryItem = ({ item }) => (
        <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <View style={styles.budgetBar}>
                <View style={[styles.spentBar, { width: `${(item.spent / item.budget) * 100}%` }]} />
            </View>
            <Text style={styles.budgetText}>
                Spent: Ksh {item.spent} / Budget: Ksh {item.budget}
            </Text>
        </View>
    );

    const addCategory = () => {
        if (newCategory.name && newCategory.budget) {
            setBudgetCategories([
                ...budgetCategories,
                {
                    id: Date.now().toString(),
                    name: newCategory.name,
                    budget: parseFloat(newCategory.budget),
                    spent: 0,
                },
            ]);
            setModalVisible(false);
            setNewCategory({ name: '', budget: '' });
        }
    };

    const screenHeaderProps = {
        title: "Budget Tracker"
    };

    return (
        <ScreenLayout headerProps={screenHeaderProps}>
            <View style={styles.container}>
                {/* Budget Overview */}
                <View style={styles.overviewContainer}>
                    <Text style={styles.overviewTitle}>Budget Overview</Text>
                    <Text style={styles.overviewText}>
                        Total Budget: Ksh {budgetCategories.reduce((sum, cat) => sum + cat.budget, 0)}
                    </Text>
                    <Text style={styles.overviewText}>
                        Total Spent: Ksh {budgetCategories.reduce((sum, cat) => sum + cat.spent, 0)}
                    </Text>
                </View>

                {/* Budget Categories */}
                <FlatList
                    data={budgetCategories}
                    renderItem={renderCategoryItem}
                    keyExtractor={item => item.id}
                    style={styles.categoryList}
                />

                {/* Add Category Button */}
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>Add Category</Text>
                </TouchableOpacity>

                {/* Add Category Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Add New Category</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Category Name"
                            value={newCategory.name}
                            onChangeText={(text) => setNewCategory({ ...newCategory, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Budget Amount"
                            keyboardType="numeric"
                            value={newCategory.budget}
                            onChangeText={(text) => setNewCategory({ ...newCategory, budget: text })}
                        />
                        <TouchableOpacity style={styles.addButton} onPress={addCategory}>
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
    overviewContainer: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    overviewTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    overviewText: {
        fontSize: 14,
        marginBottom: 5,
    },
    categoryList: {
        flex: 1,
    },
    categoryItem: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    budgetBar: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginBottom: 5,
    },
    spentBar: {
        height: 10,
        backgroundColor: '#4CAF50',
        borderRadius: 5,
    },
    budgetText: {
        fontSize: 14,
        color: '#666',
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

export default BudgetTracker;