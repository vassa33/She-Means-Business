import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Tooltip from 'react-native-walkthrough-tooltip';
import { useAppContext } from '../context/AppContext';
import ScreenLayout from '../layouts/ScreenLayout';

// SearchFilter and TransactionModal components remain the same
const SearchFilter = ({ searchQuery, setSearchQuery, filterType, setFilterType }) => (
    <View style={styles.searchFilterContainer}>
        <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
        />
        <View style={styles.filterContainer}>
            <Text>Filter: </Text>
            <Picker
                selectedValue={filterType}
                style={styles.filterPicker}
                onValueChange={setFilterType}
            >
                <Picker.Item label="All" value="all" />
                <Picker.Item label="Income" value="income" />
                <Picker.Item label="Expense" value="expense" />
            </Picker>
        </View>
    </View>
);

const TransactionModal = ({
    visible,
    transaction,
    setTransaction,
    onSubmit,
    onClose,
    isEditing,
    expenseCategories,
    showCategoryTooltip,
    setShowCategoryTooltip
}) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>
                    {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Date (YYYY-MM-DD)"
                    value={transaction.date}
                    onChangeText={(text) => setTransaction({ ...transaction, date: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={transaction.description}
                    onChangeText={(text) => setTransaction({ ...transaction, description: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={transaction.amount}
                    onChangeText={(text) => setTransaction({ ...transaction, amount: text })}
                />
                <View style={styles.typeSelection}>
                    <TouchableOpacity
                        style={[styles.typeButton, transaction.type === 'expense' && styles.selectedType]}
                        onPress={() => setTransaction({ ...transaction, type: 'expense', category: '' })}
                    >
                        <Text style={transaction.type === 'expense' ? styles.selectedTypeText : null}>
                            Expense
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, transaction.type === 'income' && styles.selectedType]}
                        onPress={() => setTransaction({ ...transaction, type: 'income', category: '' })}
                    >
                        <Text style={transaction.type === 'income' ? styles.selectedTypeText : null}>
                            Income
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.categoryContainer}>
                    <Text style={styles.categoryLabel}>
                        Category
                    </Text>
                    <Tooltip
                        isVisible={showCategoryTooltip}
                        content={
                            <Text style={styles.tooltipContent}>
                                Categories help you organize your transactions. Expense categories are linked to your budget,
                                while income categories help you track different sources of money coming into your business.
                            </Text>
                        }
                        placement="top"
                        onClose={() => setShowCategoryTooltip(false)}
                        contentStyle={styles.tooltip}
                    >
                        <TouchableOpacity onPress={() => setShowCategoryTooltip(true)}>
                            <Ionicons
                                name="information-circle-outline"
                                size={24}
                                color="black"
                            />
                        </TouchableOpacity>
                    </Tooltip>
                </View>

                {transaction.type === 'expense' ? (
                    <Picker
                        selectedValue={transaction.category}
                        style={styles.input}
                        onValueChange={(itemValue) => setTransaction({ ...transaction, category: itemValue })}
                    >
                        <Picker.Item label="Select a category" value="" />
                        {expenseCategories.map((category) => (
                            <Picker.Item key={category} label={category} value={category} />
                        ))}
                    </Picker>
                ) : (
                    <TextInput
                        style={styles.input}
                        placeholder="Income Category"
                        value={transaction.category}
                        onChangeText={(text) => setTransaction({ ...transaction, category: text })}
                    />
                )}

                <TouchableOpacity style={styles.addButton} onPress={onSubmit}>
                    <Text style={styles.addButtonText}>{isEditing ? 'Update' : 'Add'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

const TransactionLog = () => {
    const { setCurrentScreen } = useAppContext();

    // State management
    const [transactions, setTransactions] = useState([
        { id: '1', date: '2023-10-14', description: 'Sale of products', amount: 5000, type: 'income', category: 'Sales' },
        { id: '2', date: '2023-10-13', description: 'Purchase of materials', amount: -2000, type: 'expense', category: 'Inventory' },
        { id: '3', date: '2023-10-12', description: 'Utility bill', amount: -500, type: 'expense', category: 'Utilities' },
    ]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showLogTooltip, setShowLogTooltip] = useState(false);
    const [showCategoryTooltip, setShowCategoryTooltip] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [newTransaction, setNewTransaction] = useState({
        date: '',
        description: '',
        amount: '',
        type: 'expense',
        category: ''
    });

    const expenseCategories = [
        'Inventory',
        'Utilities',
        'Rent',
        'Salaries',
        'Marketing',
        'Not Budgeted'
    ];

    useEffect(() => {
        setCurrentScreen('Transaction Log');
        setFilteredTransactions(transactions);
    }, []);

    useEffect(() => {
        const filtered = transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'all' ? true : transaction.type === filterType;
            return matchesSearch && matchesType;
        });
        setFilteredTransactions(filtered);
    }, [searchQuery, filterType, transactions]);

    const handleAddTransaction = () => {
        if (newTransaction.date && newTransaction.description && newTransaction.amount && newTransaction.category) {
            const transactionToAdd = {
                id: editingTransaction?.id || Date.now().toString(),
                ...newTransaction,
                amount: newTransaction.type === 'expense' ? -Number(newTransaction.amount) : Number(newTransaction.amount)
            };

            setTransactions(prev =>
                editingTransaction
                    ? prev.map(t => t.id === editingTransaction.id ? transactionToAdd : t)
                    : [...prev, transactionToAdd]
            );

            setModalVisible(false);
            setEditingTransaction(null);
            setNewTransaction({
                date: '',
                description: '',
                amount: '',
                type: 'expense',
                category: ''
            });
        }
    };

    const renderTransactionItem = ({ item }) => (
        <View style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
                <Text style={styles.transactionDate}>{item.date}</Text>
                <Text style={styles.transactionDescription}>{item.description}</Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
            </View>
            <View style={styles.transactionDetails}>
                <Text style={[
                    styles.transactionAmount,
                    { color: item.type === 'income' ? 'green' : 'red' }
                ]}>
                    {item.type === 'income' ? '+' : '-'} Ksh {Math.abs(item.amount)}
                </Text>
                <View style={styles.actionButtons}>
                    <TouchableOpacity onPress={() => {
                        setEditingTransaction(item);
                        setNewTransaction({
                            ...item,
                            amount: Math.abs(item.amount).toString()
                        });
                        setModalVisible(true);
                    }}>
                        <Ionicons name="pencil" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setTransactions(prev => prev.filter(t => t.id !== item.id));
                    }}>
                        <Ionicons name="trash" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const screenHeaderProps = {
        title: "Transaction Log",
        tooltipContent: "A Transaction Log helps you keep track of all money coming in and going out of your business.",
        showTooltip: showLogTooltip,
        setShowTooltip: setShowLogTooltip
    };

    return (
        <ScreenLayout headerProps={screenHeaderProps}>
            <SafeAreaView style={styles.contentContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>Add Transaction</Text>
                </TouchableOpacity>

                <SearchFilter
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterType={filterType}
                    setFilterType={setFilterType}
                />

                <FlatList
                    data={filteredTransactions}
                    renderItem={renderTransactionItem}
                    keyExtractor={item => item.id}
                    style={styles.list}
                />

                <TransactionModal
                    visible={modalVisible}
                    transaction={newTransaction}
                    setTransaction={setNewTransaction}
                    onSubmit={handleAddTransaction}
                    onClose={() => {
                        setModalVisible(false);
                        setEditingTransaction(null);
                        setNewTransaction({
                            date: '',
                            description: '',
                            amount: '',
                            type: 'expense',
                            category: ''
                        });
                    }}
                    isEditing={!!editingTransaction}
                    expenseCategories={expenseCategories}
                    showCategoryTooltip={showCategoryTooltip}
                    setShowCategoryTooltip={setShowCategoryTooltip}
                />
            </SafeAreaView>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    tooltip: {
        maxWidth: 250,
    },
    tooltipContent: {
        fontSize: 14,
    },
    searchFilterContainer: {
        marginBottom: 20,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterPicker: {
        flex: 1,
        height: 40,
    },
    list: {
        flex: 1,
        paddingHorizontal: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    transactionInfo: {
        flex: 1,
    },
    transactionDetails: {
        alignItems: 'flex-end',
    },
    transactionDate: {
        fontSize: 14,
        color: '#666',
    },
    transactionDescription: {
        fontSize: 16,
        fontWeight: '500',
    },
    transactionCategory: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60,
        marginTop: 5,
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
    typeSelection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    typeButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    selectedType: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 10,
    },
    categoryLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 10,
    },
    cancelButton: {
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});

export default React.memo(TransactionLog);