import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

// ===========================================
// Helper Functions
// ===========================================

/**
 * Generates a unique key for the month based on a given or current date.
 */
const getMonthKey = (date = new Date()) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Initializes the budget data structure with the current month.
 */
const initializeBudgetData = () => {
    const currentMonthKey = getMonthKey();
    return {
        monthlyBudgets: {
            [currentMonthKey]: {
                categories: []
            }
        }
    };
};

// ===========================================
// Context and Provider
// ===========================================

const InternalDataContext = createContext();

/**
 * Provider component to manage and expose application data.
 */
export const InternalDataProvider = ({ children }) => {
    // ===========================================
    // State Management
    // ===========================================

    const [transactions, setTransactions] = useState([]);
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [budgetData, setBudgetData] = useState(initializeBudgetData());
    const [selectedView, setSelectedView] = useState('monthly');
    const [financialData, setFinancialData] = useState({
        profitLoss: {},
        incomeBreakdown: [],
        expensesBreakdown: [],
        mrrData: {}
    });

    // ===========================================
    // Helper Functions
    // ===========================================

    const getCategoryBudget = (categoryId, monthKey = getMonthKey()) => {
        return budgetData.monthlyBudgets[monthKey]?.categories
            .find(cat => cat.id === categoryId)?.budget || 0;
    };

    const getCategorySpent = (categoryId, monthKey = getMonthKey()) => {
        return budgetData.monthlyBudgets[monthKey]?.categories
            .find(cat => cat.id === categoryId)?.spent || 0;
    };

    const getMonthlyTransactions = (monthKey = getMonthKey()) => {
        return transactions.filter(tx =>
            getMonthKey(new Date(tx.date)) === monthKey
        );
    };

    // ===========================================
    // Memoized Calculations
    // ===========================================

    const financialMetrics = useMemo(() => {
        if (!transactions.length) return null;

        const currentMonthKey = getMonthKey();
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();

        // Monthly transactions and metrics
        const monthlyTransactions = transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear;
        });

        const incomeStats = monthlyTransactions
            .filter(tx => tx.type === 'income')
            .reduce((acc, tx) => {
                acc.total += tx.amount;
                acc.byCategoryMap[tx.category] = (acc.byCategoryMap[tx.category] || 0) + tx.amount;
                if (tx.savingsAllocation) {
                    acc.totalSaved += tx.savingsAllocation.amount;
                }
                return acc;
            }, { total: 0, byCategoryMap: {}, totalSaved: 0 });

        const expenseStats = monthlyTransactions
            .filter(tx => tx.type === 'expense')
            .reduce((acc, tx) => {
                acc.total += tx.amount;
                acc.byCategoryMap[tx.category] = (acc.byCategoryMap[tx.category] || 0) + tx.amount;
                return acc;
            }, { total: 0, byCategoryMap: {} });

        // Budget and savings progress
        const budgetComparison = budgetData.monthlyBudgets[currentMonthKey]?.categories.map(budget => {
            const actualSpending = monthlyTransactions
                .filter(tx => tx.type === 'expense' && tx.category === budget.id)
                .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

            return {
                ...budget,
                actual: actualSpending,
                remaining: budget.budget - actualSpending,
                percentage: (actualSpending / budget.budget) * 100
            };
        }) || [];

        const savingsProgress = savingsGoals.map(goal => {
            const savedAmount = transactions
                .filter(tx =>
                    tx.type === 'income' &&
                    tx.savingsAllocation?.goalId === goal.id
                )
                .reduce((sum, tx) => sum + (tx.savingsAllocation?.amount || 0), 0);

            return {
                ...goal,
                saved: savedAmount,
                remaining: goal.targetAmount - savedAmount,
                percentage: (savedAmount / goal.targetAmount) * 100
            };
        });

        return {
            currentMonth: {
                income: incomeStats,
                expenses: expenseStats,
                netCashFlow: incomeStats.total - expenseStats.total,
                savingsRate: incomeStats.total ? (incomeStats.totalSaved / incomeStats.total) * 100 : 0
            },
            budgetComparison,
            savingsProgress
        };
    }, [transactions, budgetData, savingsGoals]);

    // ===========================================
    // Budget Management
    // ===========================================

    // Helper function to ensure a month exists in budget data
    const ensureMonthExists = useCallback((monthKey, prevData) => {
        if (!prevData.monthlyBudgets[monthKey]) {
            const previousMonths = Object.keys(prevData.monthlyBudgets).sort();
            const latestMonth = previousMonths[previousMonths.length - 1];

            // Copy categories from latest month but reset budget and spent values
            return {
                categories: prevData.monthlyBudgets[latestMonth]?.categories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    budget: 0, // Reset budget for new month
                    spent: 0  // Reset spent for new month
                })) || []
            };
        }
        return prevData.monthlyBudgets[monthKey];
    }, []);


    // handle month-specific updates
    const updateBudgetAmount = useCallback((categoryId, amount, monthKey = getMonthKey()) => {
        if (!categoryId || amount === undefined) return;

        setBudgetData(prev => {
            const monthData = prev.monthlyBudgets[monthKey] || {
                categories: prev.monthlyBudgets[Object.keys(prev.monthlyBudgets)[0]]?.categories.map(cat => ({
                    ...cat,
                    budget: 0,
                    spent: 0
                })) || []
            };

            const updatedCategories = monthData.categories.map(cat => {
                if (cat.id === categoryId) {
                    return {
                        ...cat,
                        spent: Math.max(0, (parseFloat(cat.spent) || 0) + parseFloat(amount))
                    };
                }
                return cat;
            });

            return {
                ...prev,
                monthlyBudgets: {
                    ...prev.monthlyBudgets,
                    [monthKey]: {
                        ...monthData,
                        categories: updatedCategories
                    }
                }
            };
        });
    }, [getMonthKey]);

    // Update spent amount for a specific category in a specific month
    const updateCategorySpent = useCallback((categoryId, amount, transactionDate) => {
        const monthKey = getMonthKey(new Date(transactionDate));

        setBudgetData(prevData => {
            const updatedBudgets = { ...prevData.monthlyBudgets };

            // Ensure month exists with zeroed budgets
            if (!updatedBudgets[monthKey]) {
                updatedBudgets[monthKey] = ensureMonthExists(monthKey, prevData);
            }

            // Update only the specified category in the specific month
            updatedBudgets[monthKey] = {
                ...updatedBudgets[monthKey],
                categories: updatedBudgets[monthKey].categories.map(cat => {
                    if (cat.id === categoryId) {
                        const currentSpent = parseFloat(cat.spent) || 0;
                        const adjustedAmount = parseFloat(amount);
                        return {
                            ...cat,
                            spent: Math.max(0, currentSpent + adjustedAmount)
                        };
                    }
                    return cat;
                })
            };

            return {
                ...prevData,
                monthlyBudgets: updatedBudgets
            };
        });
    }, [ensureMonthExists]);

    // Budget Category Operations

    // Add a new budget category
    const addBudgetCategory = useCallback((newCategory) => {
        const categoryId = Date.now().toString();
        const currentMonthKey = getMonthKey();

        setBudgetData(prevData => {
            const updatedBudgets = { ...prevData.monthlyBudgets };

            // Add category to all months with zero budget except current month
            Object.keys(updatedBudgets).forEach(monthKey => {
                if (!updatedBudgets[monthKey]) {
                    updatedBudgets[monthKey] = { categories: [] };
                }

                updatedBudgets[monthKey].categories = [
                    ...updatedBudgets[monthKey].categories,
                    {
                        id: categoryId,
                        name: newCategory.name.trim(),
                        budget: monthKey === currentMonthKey ? parseFloat(newCategory.budget) : 0,
                        spent: 0
                    }
                ];
            });

            return {
                ...prevData,
                monthlyBudgets: updatedBudgets
            };
        });

        return categoryId;
    }, []);

    const updateBudgetCategory = (categoryId, updates, monthKey = getMonthKey()) => {
        setBudgetData(prev => {
            const monthData = prev.monthlyBudgets[monthKey] || { categories: [] };
            const updatedCategories = monthData.categories.map(cat =>
                cat.id === categoryId ? { ...cat, ...updates } : cat
            );

            return {
                ...prev,
                monthlyBudgets: {
                    ...prev.monthlyBudgets,
                    [monthKey]: { ...monthData, categories: updatedCategories }
                }
            };
        });
    };

    const deleteBudgetCategory = (categoryId) => {
        setBudgetData(prevData => {
            const updatedBudgets = { ...prevData.monthlyBudgets };

            // Remove category from all months
            Object.keys(updatedBudgets).forEach(month => {
                updatedBudgets[month].categories = updatedBudgets[month].categories
                    .filter(cat => cat.id !== categoryId);
            });

            return {
                ...prevData,
                monthlyBudgets: updatedBudgets
            };
        });
    };

    // Transaction Operations

    // Add a new transaction and update budget tracking
    const addTransaction = useCallback((newTransaction) => {
        const transaction = {
            id: Date.now().toString(),
            ...newTransaction,
            timestamp: new Date().toISOString()
        };

        if (transaction.type === 'expense') {
            updateCategorySpent(
                transaction.categoryId,
                Math.abs(transaction.amount),
                transaction.date
            );
        }

        // Handle Savings Allocation for Income Transactions
        if (transaction.type === 'income' && transaction.savingsAllocation) {
            const { amount, goalId } = transaction.savingsAllocation;

            // Update the specific savings goal
            setSavingsGoals(prevGoals =>
                prevGoals.map(goal =>
                    goal.id === goalId
                        ? {
                            ...goal,
                            currentAmount: (parseFloat(goal.currentAmount) || 0) + parseFloat(amount)
                        }
                        : goal
                )
            );
        }

        setTransactions(prev => [...prev, transaction]);
        return transaction.id;
    }, [updateCategorySpent, getMonthKey]);

    // Update an existing transaction
    const updateTransaction = useCallback((transactionId, updates) => {
        setTransactions(prev => {
            const oldTransaction = prev.find(tx => tx.id === transactionId);
            if (!oldTransaction) return prev;

            // Handle the old transaction's effect on budget
            if (oldTransaction.type === 'expense') {
                // Reverse the old transaction's effect
                updateCategorySpent(
                    oldTransaction.categoryId,
                    -Math.abs(oldTransaction.amount),
                    oldTransaction.date
                );
            }

            // Handle the updated transaction's effect on budget
            if (updates.type === 'expense') {
                // Apply the new transaction's effect
                updateCategorySpent(
                    updates.categoryId || oldTransaction.categoryId,
                    Math.abs(updates.amount),
                    updates.date || oldTransaction.date
                );
            }

            // Update the transaction in the list
            return prev.map(tx =>
                tx.id === transactionId
                    ? { ...tx, ...updates, timestamp: new Date().toISOString() }
                    : tx
            );
        });
    }, [updateCategorySpent]);

    // Delete a transaction
    const deleteTransaction = useCallback((transactionId) => {
        setTransactions(prev => {
            const transaction = prev.find(tx => tx.id === transactionId);
            if (transaction?.type === 'expense') {
                // Reverse the effect of the deleted transaction
                updateCategorySpent(
                    transaction.categoryId,
                    -Math.abs(transaction.amount),
                    transaction.date
                );
            }
            return prev.filter(tx => tx.id !== transactionId);
        });
    }, [updateCategorySpent]);

    // Savings Goal Operations
    const addSavingsGoal = (newGoal) => {
        setSavingsGoals(prev => [...prev, {
            id: Date.now().toString(),
            ...newGoal,
            currentAmount: 0,
            timestamp: new Date().toISOString()
        }]);
    };

    const updateSavingsGoal = (goalId, updates) => {
        setSavingsGoals(prev =>
            prev.map(goal => goal.id === goalId ? { ...goal, ...updates } : goal)
        );
    };

    const deleteSavingsGoal = (goalId) => {
        setSavingsGoals(prev => prev.filter(goal => goal.id !== goalId));
    };

    // Income Category Management
    const addIncomeCategory = (category) => {
        setIncomeCategories(prev => [...prev, {
            id: Date.now().toString(),
            name: category,
            timestamp: new Date().toISOString()
        }]);
    };

    // Task Operations
    const addTask = (newTask) => {
        setTasks(prev => [...prev, {
            id: Date.now().toString(),
            ...newTask,
            timestamp: new Date().toISOString()
        }]);
    };

    const updateTask = (taskId, updates) => {
        setTasks(prev =>
            prev.map(task => task.id === taskId ? { ...task, ...updates } : task)
        );
    };

    const deleteTask = (taskId) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    };

    // Analytics and Reports
    const fetchFinancialData = async () => {
        const mockData = {
            profitLoss: {
                daily: {
                    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    datasets: [
                        {
                            data: [1000, 1200, 900, 300, 300, 1000, 850],
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Profit (blue)
                            strokeWidth: 2
                        },
                        {
                            data: [700, 200, 600, 750, 900, 700, 550],
                            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Loss (red)
                            strokeWidth: 2
                        }
                    ]
                },
                weekly: {
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                    datasets: [
                        {
                            data: [4500, 5000, 1300, 5200],
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Profit (blue)
                            strokeWidth: 2
                        },
                        {
                            data: [1500, 6000, 3200, 3600],
                            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Loss (red)
                            strokeWidth: 2
                        }
                    ]
                },
                monthly: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [
                        {
                            data: [12000, 14000, 3000, 15000, 14500, 7000, 15000, 15000, 16000, 18000, 17000, 19000],
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Profit (blue)
                            strokeWidth: 2
                        },
                        {
                            data: [8000, 9000, 8500, 9500, 15000, 10000, 12500, 11000, 10000, 12000, 15000, 13000],
                            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Loss (red)
                            strokeWidth: 2
                        }
                    ]
                },
                yearly: {
                    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
                    datasets: [
                        {
                            data: [120000, 150000, 70000, 200000, 100000, 200000],
                            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Profit (blue)
                            strokeWidth: 2
                        },
                        {
                            data: [80000, 100000, 120000, 100000, 160000, 140000],
                            color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Loss (red)
                            strokeWidth: 2
                        }
                    ]
                }
            },
            incomeBreakdown: [[
                { category: 'Subscriptions', amount: 150000, weekly: 30000, monthly: 50000, yearly: 150000 },
                { category: 'One-time Sales', amount: 50000, weekly: 10000, monthly: 20000, yearly: 50000 },
                { category: 'Consulting', amount: 25000, weekly: 5000, monthly: 10000, yearly: 25000 },
                { category: 'Other', amount: 10000, weekly: 2000, monthly: 5000, yearly: 10000 }
            ]],
            expensesBreakdown: [[
                { category: 'Rent', amount: 20000, weekly: 4000, monthly: 6666.67, yearly: 20000 },
                { category: 'Payroll', amount: 50000, weekly: 10000, monthly: 16666.67, yearly: 50000 },
                { category: 'Utilities', amount: 10000, weekly: 2000, monthly: 3333.33, yearly: 10000 },
                { category: 'Marketing', amount: 15000, weekly: 3000, monthly: 5000, yearly: 15000 },
                { category: 'Other', amount: 45000, weekly: 9000, monthly: 15000, yearly: 45000 }
            ]],
            mrrData: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [
                    {
                        data: [3000, 7000, 5000, 10000, 13500, 16000, 15000, 7000, 20000, 18000, 22000, 20000],
                        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // MRR (blue)
                        strokeWidth: 2
                    }
                ]
            },
        };
        setFinancialData(mockData);
    };

    useEffect(() => {
        fetchFinancialData();
    }, [selectedView]);


    const value = {
        // Core Data
        transactions,
        budgetData,
        tasks,
        savingsGoals,
        incomeCategories,
        financialMetrics,

        // Helper Functions
        getMonthKey,
        getCategoryBudget,
        getCategorySpent,
        getMonthlyTransactions,

        // Transaction Operations
        addTransaction,
        updateTransaction,
        deleteTransaction,
        setTransactions,
        updateCategorySpent,

        // Task Operations
        addTask,
        updateTask,
        deleteTask,

        // Budget Operations
        addBudgetCategory,
        updateBudgetCategory,
        deleteBudgetCategory,
        updateBudgetAmount,
        setBudgetData,

        // Savings Operations
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,

        // Income Category Operations
        addIncomeCategory,

        // Analytics
        selectedView,
        setSelectedView,
        financialData,
        fetchFinancialData
    };

    return (
        <InternalDataContext.Provider value={value}>
            {children}
        </InternalDataContext.Provider>
    );
};

// Custom hook for using the internal data
export const useInternalData = () => {
    const context = useContext(InternalDataContext);
    if (!context) {
        throw new Error('useInternalData must be used within an InternalDataProvider');
    }
    return context;
};

// Transaction validation helper
export const validateTransaction = (transaction) => {
    const errors = [];

    if (!transaction.type) errors.push('Transaction type is required');
    if (!transaction.amount || transaction.amount <= 0) errors.push('Valid amount is required');
    if (!transaction.date) errors.push('Date is required');
    if (!transaction.category) errors.push('Category is required');

    if (transaction.type === 'income' && transaction.savingsAllocation) {
        if (transaction.savingsAllocation.amount > transaction.amount) {
            errors.push('Savings allocation cannot exceed income amount');
        }
        if (!transaction.savingsAllocation.goalId) {
            errors.push('Savings goal must be selected for allocation');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};