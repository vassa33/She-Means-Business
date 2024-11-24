import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Switch,
    Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import { useAppContext } from '../contexts/AppContext';
import { useInternalData } from '../contexts/InternalDataContext';
import ScreenLayout from '../layouts/ScreenLayout';
import budgetTrackerstyles from '../styles/BudgetTrackerStyles';
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

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
    const formattedDate = format(transaction.date, 'dd MMM yyyy');

    return (
        <View style={transactionLogStyles.transactionItem}>
            <View style={[
                transactionLogStyles.transactionBorder,
                { borderLeftColor: transaction.type === 'income' ? '#007AFF' : '#FF0000' }
            ]} />
            <View style={transactionLogStyles.transactionInfo}>
                <Text style={transactionLogStyles.transactionDate}>{formattedDate}</Text>
                <Text style={transactionLogStyles.transactionDescription}>{transaction.description}</Text>
                <Text style={transactionLogStyles.transactionCategory}>{transaction.category}</Text>
                {transaction.savingsAllocation && (
                    <Text style={transactionLogStyles.savingsAllocation}>
                        Savings: Ksh {transaction.savingsAllocation.amount.toLocaleString()}
                        ({transaction.savingsAllocation.goalName})
                    </Text>
                )}
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
};

const TransactionModal = ({
    visible,
    transaction,
    setTransaction,
    onSubmit,
    onClose,
    isEditing,
    budgetCategories,
    incomeCategories,
    savingsGoals
}) => {
    const [showSavingsAllocation, setShowSavingsAllocation] = useState(false);
    const [savingsAmount, setSavingsAmount] = useState('');
    const [selectedSavingsGoal, setSelectedSavingsGoal] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (transaction.type === 'income') {
            setShowSavingsAllocation(!!transaction.savingsAllocation);
            setSavingsAmount(transaction.savingsAllocation?.amount?.toString() || '');
            setSelectedSavingsGoal(transaction.savingsAllocation?.goalId || '');
        }
    }, [transaction]);

    const formatDate = (date) => {
        return date ? date.toISOString().split('T')[0] : 'Select Date';
    };

    const handleSubmit = () => {
        let finalTransaction = { ...transaction };

        if (transaction.type === 'income' && showSavingsAllocation) {
            const savingsAmountNum = Number(savingsAmount);
            if (savingsAmountNum > Number(transaction.amount)) {
                Alert.alert('Invalid Input', 'Savings amount cannot exceed transaction amount');
                return;
            }

            if (savingsAmountNum > 0 && !selectedSavingsGoal) {
                Alert.alert('Invalid Input', 'Please select a savings goal');
                return;
            }

            if (savingsAmountNum > 0 && selectedSavingsGoal) {
                const selectedGoal = savingsGoals.find(goal => goal.id === selectedSavingsGoal);
                finalTransaction.savingsAllocation = {
                    amount: savingsAmountNum,
                    goalId: selectedSavingsGoal,
                    goalName: selectedGoal.name
                };
            }
        }

        onSubmit(finalTransaction);
    };

    const StyledCategoryPicker = ({ label, selectedValue, onValueChange, items }) => (
        <View style={transactionLogStyles.pickerContainer}>
            <View style={transactionLogStyles.pickerWrapper}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={transactionLogStyles.picker}
                    dropdownIconColor="#666"
                >
                    <Picker.Item
                        label={label}
                        value=""
                        style={transactionLogStyles.placeholderItem}
                        enabled={false}
                    />
                    {items.map((item) => (
                        <Picker.Item
                            key={item.id}
                            label={item.name}
                            value={item.id}
                            style={transactionLogStyles.pickerItem}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );

    return (
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
                    <View style={transactionLogStyles.datePickerContainer}>
                        <TouchableOpacity
                            style={[
                                transactionLogStyles.dateButton,
                                showDatePicker && transactionLogStyles.dateButtonFocused
                            ]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color="#666"
                                    style={transactionLogStyles.dateButtonIcon}
                                />
                                <Text style={transactionLogStyles.dateButtonText}>
                                    Date: {formatDate(transaction.date)}
                                </Text>
                            </View>
                            <Ionicons name="chevron-down-outline" size={20} color="#666" />
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={transaction.date || new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate && event.type !== 'dismissed') {
                                        setTransaction({ ...transaction, date: selectedDate });
                                    }
                                }}
                            />
                        )}
                    </View>

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
                            onPress={() => {
                                setTransaction({ ...transaction, type: 'expense', category: '' });
                                setShowSavingsAllocation(false);
                            }}
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
                        <StyledCategoryPicker
                            label="Select Expense category"
                            selectedValue={transaction.category}
                            onValueChange={(itemValue) => setTransaction({ ...transaction, category: itemValue })}
                            items={budgetCategories}
                        />
                    ) : (
                        <>
                            <StyledCategoryPicker
                                label="Select Income category"
                                selectedValue={transaction.category}
                                onValueChange={(itemValue) => setTransaction({ ...transaction, category: itemValue })}
                                items={incomeCategories}
                            />

                            <View style={transactionLogStyles.savingsContainer}>
                                <View style={transactionLogStyles.savingsToggle}>
                                    <Text>Allocate to Savings?</Text>
                                    <Switch
                                        value={showSavingsAllocation}
                                        onValueChange={setShowSavingsAllocation}
                                        trackColor={{ false: '#E0E0E0', true: '#81B0FF' }}
                                        thumbColor={showSavingsAllocation ? '#007AFF' : '#f4f3f4'}
                                    />
                                </View>

                                {showSavingsAllocation && (
                                    <>
                                        <TextInput
                                            style={transactionLogStyles.input}
                                            placeholder="Savings Amount"
                                            keyboardType="numeric"
                                            value={savingsAmount}
                                            onChangeText={setSavingsAmount}
                                        />
                                        <StyledCategoryPicker
                                            label="Select Savings goal"
                                            selectedValue={selectedSavingsGoal}
                                            onValueChange={setSelectedSavingsGoal}
                                            items={savingsGoals}
                                        />
                                    </>
                                )}
                            </View>
                        </>
                    )}

                    <View style={transactionLogStyles.buttonContainer}>
                        <TouchableOpacity
                            style={transactionLogStyles.addButton}
                            onPress={handleSubmit}
                        >
                            <Text style={transactionLogStyles.addButtonText}>
                                {isEditing ? 'Update' : 'Add'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={transactionLogStyles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={transactionLogStyles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const TransactionLog = () => {
    const { setCurrentScreen } = useAppContext();
    const {
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        budgetData,
        savingsGoals,
        getMonthKey,
        updateBudgetAmount,
    } = useInternalData();


    // State management
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showIncomeToggle, setShowIncomeToggle] = useState(true);
    const [showExpenseToggle, setShowExpenseToggle] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [newTransaction, setNewTransaction] = useState({
        date: new Date(),
        description: '',
        amount: '',
        type: 'expense',
        category: ''
    });
    const [showLogTooltip, setShowLogTooltip] = useState(false);

    // Get current month's budget categories
    const currentMonthKey = getMonthKey(currentDate);
    const budgetCategories = budgetData.monthlyBudgets[currentMonthKey]?.categories.map(category => ({
        ...category,
        name: category.name || 'Uncategorized'
    })) || [];

    // Predefined categories for consistent reporting
    const incomeCategories = [
        { id: 'store_sales', name: 'Store Sales' },
        { id: 'social_media_sales', name: 'Social Media Sales' },
        { id: 'investments', name: 'Investments' },
        { id: 'website_sales', name: 'Website Sales' },
        { id: 'discount_sales', name: 'Discount Sales' },
        { id: 'affiliate_marketing', name: 'Affiliate Marketing Sales' },
        { id: 'other_income', name: 'Other Income' }
    ];

    // Format savings goals for display
    const formattedSavingsGoals = savingsGoals.map(goal => ({
        ...goal,
        name: goal.name || 'Unnamed Goal'
    }));

    useEffect(() => {
        setCurrentScreen('Transaction Log');
    }, []);


    useEffect(() => {
        if (editingTransaction) {
            setNewTransaction({
                date: editingTransaction.date,
                description: editingTransaction.description,
                amount: Math.abs(editingTransaction.amount).toString(),
                type: editingTransaction.type,
                category: editingTransaction.category,
                savingsAllocation: editingTransaction.savingsAllocation
            });
            setModalVisible(true);
        }
    }, [editingTransaction]);


    // Filter transactions based on current month, search query, and type toggles
    useEffect(() => {
        const filtered = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const isCurrentMonth =
                transactionDate.getMonth() === currentDate.getMonth() &&
                transactionDate.getFullYear() === currentDate.getFullYear();

            const matchesSearch =
                transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                getCategoryName(transaction).toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType =
                (showIncomeToggle && transaction.type === 'income') ||
                (showExpenseToggle && transaction.type === 'expense');

            return isCurrentMonth && matchesSearch && matchesType;
        });

        // Sort transactions by date (newest first)
        const sortedTransactions = filtered.sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        setFilteredTransactions(sortedTransactions);
    }, [searchQuery, showIncomeToggle, showExpenseToggle, transactions, currentDate]);

    // Helper function to get category name
    const getCategoryName = (transaction) => {
        if (transaction.type === 'expense') {
            const category = budgetCategories.find(cat => cat.id === transaction.category);
            return category?.name || 'Uncategorized';
        } else {
            const category = incomeCategories.find(cat => cat.id === transaction.category);
            return category?.name || 'Uncategorized';
        }
    };

    // Handle transaction updates (new and edit)
    const handleAddTransaction = (transactionData) => {
        if (transactionData.date && transactionData.description && transactionData.amount && transactionData.category) {
            const amount = Number(transactionData.amount);
            const monthKey = getMonthKey(new Date(transactionData.date));

            const newTransactionObj = {
                id: editingTransaction?.id || Date.now().toString(),
                ...transactionData,
                amount: transactionData.type === 'expense' ? -amount : amount,
                timestamp: new Date().toISOString()
            };

            // If editing, first reverse the effects of the old transaction
            if (editingTransaction) {
                if (editingTransaction.type === 'expense') {
                    const oldMonthKey = getMonthKey(new Date(editingTransaction.date));
                    const oldAmount = Math.abs(editingTransaction.amount);
                    // Reverse the old transaction's effect
                    updateBudgetAmount(editingTransaction.category, -oldAmount, oldMonthKey);
                }

                // Apply the new transaction
                if (transactionData.type === 'expense') {
                    updateBudgetAmount(transactionData.category, amount, monthKey);
                }

                // Update the transaction
                updateTransaction(editingTransaction.id, newTransactionObj);
            } else {
                // Add new transaction and update budget if it's an expense
                addTransaction(newTransactionObj);
                if (transactionData.type === 'expense') {
                    updateBudgetAmount(transactionData.category, amount, monthKey);
                }
            }

            setModalVisible(false);
            setEditingTransaction(null);
            setNewTransaction({
                date: new Date(),
                description: '',
                amount: '',
                type: 'expense',
                category: ''
            });
        } else {
            Alert.alert('Invalid Input', 'Please fill in all fields');
        }
    };

    // Handle transaction deletion
    const handleDeleteTransaction = (transaction) => {
        Alert.alert(
            'Delete Transaction',
            'Are you sure you want to delete this transaction?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        try {
                            // Reverse the budget effect before deleting
                            if (transaction.type === 'expense') {
                                const monthKey = getMonthKey(new Date(transaction.date));
                                updateBudgetAmount(
                                    transaction.category,
                                    -Math.abs(transaction.amount),
                                    monthKey
                                );
                            }
                            deleteTransaction(transaction.id);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete transaction');
                        }
                    }
                }
            ],
            { cancelable: true }
        );
    };

    // Month Navigation Functions
    const formatMonthYear = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

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

    // Month on Month View
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

    // Render transaction item with category name
    const renderTransactionItem = (transaction) => (
        <TransactionItem
            key={transaction.id}
            transaction={{
                ...transaction,
                category: getCategoryName(transaction)
            }}
            onEdit={() => setEditingTransaction(transaction)}
            onDelete={() => handleDeleteTransaction(transaction)}
        />
    );

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
                    <MonthNavigation />
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

                    <ScrollView style={transactionLogStyles.listContainer}>
                        {filteredTransactions.map(renderTransactionItem)}
                    </ScrollView>

                    <View style={transactionLogStyles.bottomContainer}>
                        <TouchableOpacity
                            style={transactionLogStyles.addTransactionButton}
                            onPress={() => {
                                setEditingTransaction(null);
                                setNewTransaction({
                                    date: new Date(),
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
                        transaction={editingTransaction || newTransaction}
                        setTransaction={setNewTransaction}
                        onSubmit={handleAddTransaction}
                        onClose={() => {
                            setModalVisible(false);
                            setEditingTransaction(null);
                            setNewTransaction({
                                date: new Date(),
                                description: '',
                                amount: '',
                                type: 'expense',
                                category: ''
                            });
                        }}
                        isEditing={!!editingTransaction}
                        budgetCategories={budgetCategories}
                        incomeCategories={incomeCategories}
                        savingsGoals={savingsGoals}
                    />
                </View>
            </ScreenLayout>
        </SafeAreaView>
    );
};

export default React.memo(TransactionLog);