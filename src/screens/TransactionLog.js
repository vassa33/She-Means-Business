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
    StatusBar,
    Switch,
    Alert,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAppContext } from '../context/AppContext';
import ScreenLayout from '../layouts/ScreenLayout';

const CHART_COLORS = [
    '#FF69B4', '#DDA0DD', '#DA70D6', '#FF8C00', '#20B2AA',
    '#9370DB', '#FF1493', '#FFB6C1', '#DB7093', '#F08080'
];

const SearchBar = ({ searchQuery, setSearchQuery }) => (
    <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#7F7F7F" style={styles.searchIcon} />
        <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
        />
    </View>
);

const TransactionItem = ({ transaction, onEdit, onDelete }) => (
    <View style={styles.transactionItem}>
        <View style={[
            styles.transactionBorder,
            { borderLeftColor: transaction.type === 'income' ? '#007AFF' : '#FF0000' }
        ]} />
        <View style={styles.transactionInfo}>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
            <Text style={styles.transactionDescription}>{transaction.description}</Text>
            <Text style={styles.transactionCategory}>{transaction.category}</Text>
        </View>
        <View style={styles.rightContainer}>
            <Text style={[
                styles.transactionAmountText,
                { color: transaction.type === 'income' ? '#007AFF' : '#FF0000' }
            ]}>
                {transaction.type === 'income' ? '+' : '-'} Ksh {Math.abs(transaction.amount).toLocaleString()}
            </Text>
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onEdit(transaction)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="pencil" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
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
                        style={[
                            styles.typeButton,
                            transaction.type === 'expense' && styles.selectedType
                        ]}
                        onPress={() => setTransaction({ ...transaction, type: 'expense', category: '' })}
                    >
                        <Text style={transaction.type === 'expense' ? styles.selectedTypeText : null}>
                            Expense
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            transaction.type === 'income' && styles.selectedType
                        ]}
                        onPress={() => setTransaction({ ...transaction, type: 'income', category: '' })}
                    >
                        <Text style={transaction.type === 'income' ? styles.selectedTypeText : null}>
                            Income
                        </Text>
                    </TouchableOpacity>
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
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={onSubmit}>
                        <Text style={styles.addButtonText}>{isEditing ? 'Update' : 'Add'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <ScreenLayout headerProps={screenHeaderProps}>
                <View style={styles.contentContainer}>
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    <View style={styles.toggleContainer}>
                        <View style={styles.toggleItem}>
                            <Text style={styles.toggleLabel}>Income</Text>
                            <Switch
                                value={showIncomeToggle}
                                onValueChange={setShowIncomeToggle}
                                trackColor={{ false: '#E0E0E0', true: '#81B0FF' }}
                                thumbColor={showIncomeToggle ? '#007AFF' : '#f4f3f4'}
                            />
                        </View>
                        <View style={styles.toggleSeparator} />
                        <View style={styles.toggleItem}>
                            <Text style={styles.toggleLabel}>Expense</Text>
                            <Switch
                                value={showExpenseToggle}
                                onValueChange={setShowExpenseToggle}
                                trackColor={{ false: '#E0E0E0', true: '#81B0FF' }}
                                thumbColor={showExpenseToggle ? '#007AFF' : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    <View style={styles.listContainer}>
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
                            style={styles.list}
                            contentContainerStyle={styles.listContent}
                        />
                    </View>

                    <View style={styles.bottomContainer}>
                        <TouchableOpacity
                            style={styles.addTransactionButton}
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
                            <Text style={styles.addButtonText}>Add Transaction</Text>
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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    listContainer: {
        flex: 1,
        marginBottom: 80, // Space for fixed button
    },

    list: {
        flex: 1,
    },

    listContent: {
        paddingBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F3F4',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
    },
    searchInput: {
        // fontSize: 16,
        color: '#000000',
        marginLeft: 20,
    },
    searchIcon: {
        marginLeft: 6,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 16,
        backgroundColor: '#F4F3F4',
        borderRadius: 8,
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    toggleSeparator: {
        width: 1,
        height: '80%',
        backgroundColor: '#E0E0E0',
        marginHorizontal: 16,
    },
    toggleLabel: {
        fontSize: 16,
        color: '#7F7F7F',
        marginRight: 8,
    },
    transactionItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },

    transactionInfo: {
        flex: 1,
        marginLeft: 12,
        marginRight: 16,
    },

    rightContainer: {
        alignItems: 'flex-end',
        minWidth: 120,
    },

    transactionAmountText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'right',
    },

    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },

    actionButton: {
        padding: 4,
    },

    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },

    addTransactionButton: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    addButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#007AFF',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000000',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#81B0FF',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#000000',
    },
    typeSelection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 12,
    },
    typeButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#81B0FF',
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    selectedType: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    selectedTypeText: {
        color: '#FFFFFF',
    },
    categoryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 12,
    },
    categoryLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 10,
        color: '#000000',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 12,
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginRight: 8,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    cancelButton: {
        backgroundColor: '#F4F3F4',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    }
});

export default React.memo(TransactionLog);