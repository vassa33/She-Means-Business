import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    SafeAreaView,
    StatusBar,
    Switch,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAppContext } from '../context/AppContext';
import ScreenLayout from '../layouts/ScreenLayout';
import transactionLogStyles from '../styles/TransactionLogStyles';

const SearchBar = ({ searchQuery, setSearchQuery }) => (
    <View style={transactionLogStyles.searchContainer}>
        <Ionicons name="search" size={24} color="#7F7F7F" style={transactionLogStyles.searchIcon} />
        <TextInput
            style={transactionLogStyles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
        />
    </View>
);

const TransactionItem = ({ transaction, onEdit, onDelete }) => (
    <View style={transactionLogStyles.transactionItem}>
        <View style={[
            transactionLogStyles.transactionBorder,
            { borderLeftColor: transaction.type === 'income' ? '#007AFF' : '#FF0000' }
        ]} />
        <View style={transactionLogStyles.transactionInfo}>
            <Text style={transactionLogStyles.transactionDate}>{transaction.date}</Text>
            <Text style={transactionLogStyles.transactionDescription}>{transaction.description}</Text>
            <Text style={transactionLogStyles.transactionCategory}>{transaction.category}</Text>
        </View>
        <View style={transactionLogStyles.rightContainer}>
            <Text style={[
                transactionLogStyles.transactionAmountText,
                { color: transaction.type === 'income' ? '#007AFF' : '#FF0000' }
            ]}>
                {transaction.type === 'income' ? '+' : '-'} Ksh {Math.abs(transaction.amount).toLocaleString()}
            </Text>
            <View style={transactionLogStyles.actionButtons}>
                <TouchableOpacity
                    style={transactionLogStyles.actionButton}
                    onPress={() => onEdit(transaction)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="pencil" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={transactionLogStyles.actionButton}
                    onPress={() => onDelete(transaction)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="trash" size={20} color="#FF0000" />
                </TouchableOpacity>
            </View>
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
    expenseCategories
}) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={transactionLogStyles.modalOverlay}>
            <View style={transactionLogStyles.modalView}>
                <Text style={transactionLogStyles.modalTitle}>
                    {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
                </Text>
                <TextInput
                    style={transactionLogStyles.input}
                    placeholder="Date (YYYY-MM-DD)"
                    value={transaction.date}
                    onChangeText={(text) => setTransaction({ ...transaction, date: text })}
                />
                <TextInput
                    style={transactionLogStyles.input}
                    placeholder="Description"
                    value={transaction.description}
                    onChangeText={(text) => setTransaction({ ...transaction, description: text })}
                />
                <TextInput
                    style={transactionLogStyles.input}
                    placeholder="Amount"
                    keyboardType="numeric"
                    value={transaction.amount}
                    onChangeText={(text) => setTransaction({ ...transaction, amount: text })}
                />
                <View style={transactionLogStyles.typeSelection}>
                    <TouchableOpacity
                        style={[
                            transactionLogStyles.typeButton,
                            transaction.type === 'expense' && transactionLogStyles.selectedType
                        ]}
                        onPress={() => setTransaction({ ...transaction, type: 'expense', category: '' })}
                    >
                        <Text style={transaction.type === 'expense' ? transactionLogStyles.selectedTypeText : null}>
                            Expense
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            transactionLogStyles.typeButton,
                            transaction.type === 'income' && transactionLogStyles.selectedType
                        ]}
                        onPress={() => setTransaction({ ...transaction, type: 'income', category: '' })}
                    >
                        <Text style={transaction.type === 'income' ? transactionLogStyles.selectedTypeText : null}>
                            Income
                        </Text>
                    </TouchableOpacity>
                </View>
                {transaction.type === 'expense' ? (
                    <Picker
                        selectedValue={transaction.category}
                        style={transactionLogStyles.input}
                        onValueChange={(itemValue) => setTransaction({ ...transaction, category: itemValue })}
                    >
                        <Picker.Item label="Select a category" value="" />
                        {expenseCategories.map((category) => (
                            <Picker.Item key={category} label={category} value={category} />
                        ))}
                    </Picker>
                ) : (
                    <TextInput
                        style={transactionLogStyles.input}
                        placeholder="Income Category"
                        value={transaction.category}
                        onChangeText={(text) => setTransaction({ ...transaction, category: text })}
                    />
                )}
                <View style={transactionLogStyles.buttonContainer}>
                    <TouchableOpacity style={transactionLogStyles.addButton} onPress={onSubmit}>
                        <Text style={transactionLogStyles.addButtonText}>{isEditing ? 'Update' : 'Add'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={transactionLogStyles.cancelButton} onPress={onClose}>
                        <Text style={transactionLogStyles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
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
        { id: '4', date: '2023-10-11', description: 'Rent payment', amount: -3000, type: 'expense', category: 'Rent' },
        { id: '5', date: '2023-10-10', description: 'Salary for employees', amount: -15000, type: 'expense', category: 'Salaries' },
        { id: '6', date: '2023-10-09', description: 'Online ad campaign', amount: -1000, type: 'expense', category: 'Marketing' },
        { id: '7', date: '2023-10-08', description: 'Cash deposit', amount: 10000, type: 'income', category: 'Sales' },
        { id: '8', date: '2023-10-07', description: 'Office supplies', amount: -500, type: 'expense', category: 'Not Budgeted' },
    ]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showIncomeToggle, setShowIncomeToggle] = useState(true);
    const [showExpenseToggle, setShowExpenseToggle] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [newTransaction, setNewTransaction] = useState({
        date: '',
        description: '',
        amount: '',
        type: 'expense',
        category: ''
    });
    const [showLogTooltip, setShowLogTooltip] = useState(false);


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
        if (editingTransaction) {
            setNewTransaction({
                date: editingTransaction.date,
                description: editingTransaction.description,
                amount: Math.abs(editingTransaction.amount).toString(),
                type: editingTransaction.type,
                category: editingTransaction.category
            });
            setModalVisible(true);
        }
    }, [editingTransaction]);

    useEffect(() => {
        const filtered = transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = (showIncomeToggle && transaction.type === 'income') ||
                (showExpenseToggle && transaction.type === 'expense');
            return matchesSearch && matchesType;
        });
        setFilteredTransactions(filtered);
    }, [searchQuery, showIncomeToggle, showExpenseToggle, transactions]);

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
        } else {
            Alert.alert('Invalid Input', 'Please fill in all fields');
        }
    };

    const handleDeleteTransaction = (transaction) => {
        Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: () => {
                        setTransactions(prev => prev.filter(t => t.id !== transaction.id));
                    }
                }
            ],
            { cancelable: true }
        );
    };

    const screenHeaderProps = {
        title: "Transaction Log",
        tooltipContent: `Your Transaction Log is the financial heartbeat of your business:

• Financial Tracking: Record every shilling coming in (income) and going out (expenses) to understand your cash flow

• Budget Management: Compare actual spending against your budget to stay on track

• Saving Goals: Monitor progress towards your business saving targets

• Decision Making: Use transaction history to:
  
  - Identify cost-cutting opportunities
  - Spot seasonal trends
  - Make informed pricing decisions
  - Plan for future investments

• Tax Preparation: Keep accurate records in preparation for tax filing

Regular transaction logging helps you make data-driven decisions for business growth.`,
        showTooltip: showLogTooltip,
        setShowTooltip: setShowLogTooltip
    };

    return (
        <SafeAreaView style={transactionLogStyles.safeArea}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <ScreenLayout headerProps={screenHeaderProps}>
                <View style={transactionLogStyles.contentContainer}>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    <View style={transactionLogStyles.toggleContainer}>
                        <View style={transactionLogStyles.toggleItem}>
                            <Text style={transactionLogStyles.toggleLabel}>Income</Text>
                            <Switch
                                value={showIncomeToggle}
                                onValueChange={setShowIncomeToggle}
                                trackColor={{ false: '#E0E0E0', true: '#81B0FF' }}
                                thumbColor={showIncomeToggle ? '#007AFF' : '#f4f3f4'}
                            />
                        </View>
                        <View style={transactionLogStyles.toggleSeparator} />
                        <View style={transactionLogStyles.toggleItem}>
                            <Text style={transactionLogStyles.toggleLabel}>Expense</Text>
                            <Switch
                                value={showExpenseToggle}
                                onValueChange={setShowExpenseToggle}
                                trackColor={{ false: '#E0E0E0', true: '#81B0FF' }}
                                thumbColor={showExpenseToggle ? '#007AFF' : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    <View style={transactionLogStyles.listContainer}>
                        <FlatList
                            data={filteredTransactions}
                            renderItem={({ item }) => (
                                <TransactionItem
                                    transaction={item}
                                    onEdit={setEditingTransaction}
                                    onDelete={handleDeleteTransaction}
                                />
                            )}
                            keyExtractor={item => item.id}
                            style={transactionLogStyles.list}
                            contentContainerStyle={transactionLogStyles.listContent}
                        />
                    </View>

                    <View style={transactionLogStyles.bottomContainer}>
                        <TouchableOpacity
                            style={transactionLogStyles.addTransactionButton}
                            onPress={() => {
                                setEditingTransaction(null);
                                setNewTransaction({
                                    date: '',
                                    description: '',
                                    amount: '',
                                    type: 'expense',
                                    category: ''
                                });
                                setModalVisible(true);
                            }}
                        >
                            <Ionicons name="add" size={24} color="#FFFFFF" />
                            <Text style={transactionLogStyles.addButtonText}>Add Transaction</Text>
                        </TouchableOpacity>
                    </View>

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
                    />
                </View>
            </ScreenLayout>
        </SafeAreaView>
    );
};

export default React.memo(TransactionLog);