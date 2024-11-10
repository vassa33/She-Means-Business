import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
    Alert,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenLayout from '../layouts/ScreenLayout';
import { useAppContext } from '../context/AppContext';
import actionCenterStyles from '../styles/ActionCenterStyles';

const ActionCenter = () => {
    const { setCurrentScreen } = useAppContext();
    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showHighPriority, setShowHighPriority] = useState(true);
    const [showMediumPriority, setShowMediumPriority] = useState(true);
    const [showLowPriority, setShowLowPriority] = useState(true);

    const [newTask, setNewTask] = useState({
        title: '',
        priority: 'medium',
        deadline: new Date(),
        notes: '',
        category: 'business',
        completed: false
    });

    useEffect(() => {
        setCurrentScreen('Action Center');
    }, []);

    // Load initial tasks
    useEffect(() => {
        setTasks([
            {
                id: '1',
                title: 'Review Q4 Budget',
                priority: 'high',
                deadline: new Date('2024-11-20'),
                category: 'finance',
                notes: 'Focus on marketing spend allocation',
                completed: false
            },
            {
                id: '2',
                title: 'Supplier Payment - Fresh Goods',
                priority: 'high',
                deadline: new Date('2024-11-15'),
                category: 'payment',
                amount: 'Ksh 50,000',
                completed: false
            },
        ]);
    }, []);

    const handleAddTask = () => {
        if (!newTask.title.trim()) {
            Alert.alert('Error', 'Please enter a task title');
            return;
        }

        const taskToAdd = {
            ...newTask,
            id: Date.now().toString(),
        };

        setTasks(prevTasks => [...prevTasks, taskToAdd]);
        setModalVisible(false);
        resetNewTask();
    };

    const handleEditTask = () => {
        if (!editingTask.title.trim()) {
            Alert.alert('Error', 'Please enter a task title');
            return;
        }

        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === editingTask.id ? editingTask : task
            )
        );
        setModalVisible(false);
        setEditingTask(null);
    };

    const handleDeleteTask = (taskId) => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
                    }
                }
            ]
        );
    };

    const toggleTaskCompletion = (taskId) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    const resetNewTask = () => {
        setNewTask({
            title: '',
            priority: 'medium',
            deadline: new Date(),
            notes: '',
            category: 'business',
            completed: false
        });
    };

    const startEditTask = (task) => {
        setEditingTask(task);
        setModalVisible(true);
    };

    const toggleFilter = (priority) => {
        setActiveFilters(prev =>
            prev.includes(priority)
                ? prev.filter(p => p !== priority)
                : [...prev, priority]
        );
    };

    // Update filtered tasks logic
    const filteredTasks = tasks.filter(task => {
        if (task.priority === 'high' && showHighPriority) return true;
        if (task.priority === 'medium' && showMediumPriority) return true;
        if (task.priority === 'low' && showLowPriority) return true;
        return false;
    });

    const priorityGroups = {
        high: filteredTasks.filter(task => task.priority === 'high' && !task.completed),
        medium: filteredTasks.filter(task => task.priority === 'medium' && !task.completed),
        low: filteredTasks.filter(task => task.priority === 'low' && !task.completed),
        completed: tasks.filter(task => task.completed)
    };

    const renderTaskModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
                setEditingTask(null);
                resetNewTask();
            }}
        >
            <View style={actionCenterStyles.modalContainer}>
                <View style={actionCenterStyles.modalContent}>
                    <Text style={actionCenterStyles.modalTitle}>
                        {editingTask ? 'Edit Task' : 'Add New Task'}
                    </Text>

                    <TextInput
                        style={actionCenterStyles.input}
                        placeholder="Task Title"
                        value={editingTask ? editingTask.title : newTask.title}
                        onChangeText={(text) =>
                            editingTask
                                ? setEditingTask({ ...editingTask, title: text })
                                : setNewTask({ ...newTask, title: text })
                        }
                    />

                    <View style={actionCenterStyles.prioritySelector}>
                        <Text style={actionCenterStyles.labelText}>Priority:</Text>
                        <View style={actionCenterStyles.priorityButtons}>
                            {['high', 'medium', 'low'].map((priority) => (
                                <TouchableOpacity
                                    key={priority}
                                    style={[
                                        actionCenterStyles.priorityButton,
                                        (editingTask ? editingTask.priority : newTask.priority) === priority && {
                                            backgroundColor: getPriorityColor(priority)
                                        }
                                    ]}
                                    onPress={() =>
                                        editingTask
                                            ? setEditingTask({ ...editingTask, priority })
                                            : setNewTask({ ...newTask, priority })
                                    }
                                >
                                    <Text style={[
                                        actionCenterStyles.priorityButtonText,
                                        (editingTask ? editingTask.priority : newTask.priority) === priority &&
                                        actionCenterStyles.selectedPriorityText
                                    ]}>
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={actionCenterStyles.datePickerContainer}>
                        {/* <Text style={actionCenterStyles.datePickerLabel}>Deadline:</Text> */}
                        <TouchableOpacity
                            style={[
                                actionCenterStyles.dateButton,
                                showDatePicker && actionCenterStyles.dateButtonFocused
                            ]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color="#666"
                                    style={actionCenterStyles.dateButtonIcon}
                                />
                                <Text style={actionCenterStyles.dateButtonText}>
                                    Due Date: {formatDate(editingTask ? editingTask.deadline : newTask.deadline)}
                                </Text>
                            </View>
                            <Ionicons name="chevron-down-outline" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={editingTask ? editingTask.deadline : newTask.deadline}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    if (editingTask) {
                                        setEditingTask({ ...editingTask, deadline: selectedDate });
                                    } else {
                                        setNewTask({ ...newTask, deadline: selectedDate });
                                    }
                                }
                            }}
                        />
                    )}

                    <TextInput
                        style={[actionCenterStyles.input, actionCenterStyles.notesInput]}
                        placeholder="Add notes (optional)"
                        multiline
                        value={editingTask ? editingTask.notes : newTask.notes}
                        onChangeText={(text) =>
                            editingTask
                                ? setEditingTask({ ...editingTask, notes: text })
                                : setNewTask({ ...newTask, notes: text })
                        }
                    />

                    <View style={actionCenterStyles.modalButtons}>
                        {editingTask && (
                            <TouchableOpacity
                                style={[actionCenterStyles.modalButton, actionCenterStyles.deleteButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    handleDeleteTask(editingTask.id);
                                }}
                            >
                                <Text style={[actionCenterStyles.modalButtonText, actionCenterStyles.deleteButtonText]}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[actionCenterStyles.modalButton, actionCenterStyles.cancelButton]}
                            onPress={() => {
                                setModalVisible(false);
                                setEditingTask(null);
                                resetNewTask();
                            }}
                        >
                            <Text style={actionCenterStyles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[actionCenterStyles.modalButton, actionCenterStyles.saveButton]}
                            onPress={editingTask ? handleEditTask : handleAddTask}
                        >
                            <Text style={[actionCenterStyles.modalButtonText, actionCenterStyles.saveButtonText]}>
                                {editingTask ? 'Update' : 'Save'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={actionCenterStyles.safeArea}>
            <ScreenLayout headerProps={{ title: "Action Center" }}>
                <View style={actionCenterStyles.container}>
                    {/* Priority Filters */}
                    <View style={actionCenterStyles.toggleContainer}>
                        <View style={actionCenterStyles.toggleItem}>
                            <Text style={actionCenterStyles.toggleLabel}>High</Text>
                            <Switch
                                value={showHighPriority}
                                onValueChange={setShowHighPriority}
                                trackColor={{ false: '#E0E0E0', true: '#ff6b6b80' }}
                                thumbColor={showHighPriority ? '#ff6b6b' : '#f4f3f4'}
                            />
                        </View>
                        <View style={actionCenterStyles.toggleSeparator} />
                        <View style={actionCenterStyles.toggleItem}>
                            <Text style={actionCenterStyles.toggleLabel}>Medium</Text>
                            <Switch
                                value={showMediumPriority}
                                onValueChange={setShowMediumPriority}
                                trackColor={{ false: '#E0E0E0', true: '#fd7e1480' }}
                                thumbColor={showMediumPriority ? '#fd7e14' : '#f4f3f4'}
                            />
                        </View>
                        <View style={actionCenterStyles.toggleSeparator} />
                        <View style={actionCenterStyles.toggleItem}>
                            <Text style={actionCenterStyles.toggleLabel}>Low</Text>
                            <Switch
                                value={showLowPriority}
                                onValueChange={setShowLowPriority}
                                trackColor={{ false: '#E0E0E0', true: '#37b24d80' }}
                                thumbColor={showLowPriority ? '#37b24d' : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    {/* Quick Stats */}
                    <View style={actionCenterStyles.statsContainer}>
                        <View style={actionCenterStyles.statItem}>
                            <Text style={actionCenterStyles.statNumber}>
                                {tasks.filter(t => !t.completed).length}
                            </Text>
                            <Text style={actionCenterStyles.statLabel}>Active</Text>
                        </View>
                        <View style={actionCenterStyles.statItem}>
                            <Text style={actionCenterStyles.statNumber}>
                                {tasks.filter(t => t.priority === 'high' && !t.completed).length}
                            </Text>
                            <Text style={actionCenterStyles.statLabel}>High Priority</Text>
                        </View>
                        <View style={actionCenterStyles.statItem}>
                            <Text style={actionCenterStyles.statNumber}>
                                {tasks.filter(t => t.completed).length}
                            </Text>
                            <Text style={actionCenterStyles.statLabel}>Completed</Text>
                        </View>
                    </View>

                    {/* Add Task Button */}
                    <TouchableOpacity
                        style={actionCenterStyles.addButton}
                        onPress={() => {
                            resetNewTask();
                            setModalVisible(true);
                        }}
                    >
                        <Ionicons name="add-circle-outline" size={24} color="#fff" />
                        <Text style={actionCenterStyles.addButtonText}>Add New Task</Text>
                    </TouchableOpacity>

                    {/* Tasks List */}
                    <ScrollView style={actionCenterStyles.tasksList}>
                        {Object.entries(priorityGroups).map(([priority, tasks]) => (
                            tasks.length > 0 && (
                                <View key={priority} style={actionCenterStyles.prioritySection}>
                                    <Text style={actionCenterStyles.priorityHeader}>
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        {' '}({tasks.length})
                                    </Text>
                                    {tasks.map((task) => (
                                        <TouchableOpacity
                                            key={task.id}
                                            style={[
                                                actionCenterStyles.taskCard,
                                                { borderLeftColor: getPriorityColor(task.priority) }
                                            ]}
                                            onPress={() => startEditTask(task)}
                                        >
                                            <View style={actionCenterStyles.taskHeader}>
                                                <View style={actionCenterStyles.taskTitleContainer}>
                                                    <Ionicons
                                                        name={getCategoryIcon(task.category)}
                                                        size={20}
                                                        color="#666"
                                                    />
                                                    <Text style={[
                                                        actionCenterStyles.taskTitle,
                                                        task.completed && actionCenterStyles.completedTaskTitle
                                                    ]}>
                                                        {task.title}
                                                    </Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => toggleTaskCompletion(task.id)}
                                                >
                                                    <Ionicons
                                                        name={task.completed ? "checkmark-circle" : "checkmark-circle-outline"}
                                                        size={24}
                                                        color={task.completed ? "#37b24d" : "#ccc"}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            {task.amount && (
                                                <Text style={actionCenterStyles.taskAmount}>{task.amount}</Text>
                                            )}

                                            {task.notes && (
                                                <Text style={actionCenterStyles.taskNotes}>{task.notes}</Text>
                                            )}

                                            <View style={actionCenterStyles.taskFooter}>
                                                <Text style={actionCenterStyles.taskDeadline}>
                                                    Due: {formatDate(task.deadline)}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )
                        ))}
                    </ScrollView>

                    {renderTaskModal()}
                </View>
            </ScreenLayout>
        </SafeAreaView>
    );
};

// Existing helper functions
const getPriorityColor = (priority) => {
    const colors = {
        high: '#ff6b6b',
        medium: '#fd7e14',
        low: '#37b24d',
        completed: '#868e96'
    };
    return colors[priority] || colors.medium;
};

const getCategoryIcon = (category) => {
    const icons = {
        finance: 'cash-outline',
        payment: 'card-outline',
        team: 'people-outline',
        business: 'briefcase-outline',
        tax: 'document-text-outline'
    };
    return icons[category] || 'list-outline';
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export default ActionCenter;