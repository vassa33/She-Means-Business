// Data Models
// models/types.ts
export interface Transaction {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: Date;
    userId: string;
    budgetCategory?: string;
}

export interface Budget {
    id: string;
    category: string;
    budgetAmount: number;
    spent: number;
    period: 'monthly';
    userId: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    saved: number;
    period: 'monthly';
    userId: string;
}

export interface Reminder {
    id: string;
    title: string;
    description?: string;
    dueDate: Date;
    completed: boolean;
    userId: string;
    // relatedTransactionId?: string;
}
