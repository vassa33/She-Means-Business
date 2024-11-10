// ../styles/ActionCenterStyles.js

import { StyleSheet } from 'react-native';

const actionCenterStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 15,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 6,
        marginBottom: 16,
        backgroundColor: '#F4F3F4',
        borderRadius: 8,
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        //paddingHorizontal: 4,
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
        marginRight: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginHorizontal: 5,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    tasksList: {
        flex: 1,
    },
    prioritySection: {
        marginBottom: 20,
    },
    priorityHeader: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    taskCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    taskTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    taskAmount: {
        fontSize: 14,
        color: '#007AFF',
        marginTop: 4,
    },
    taskNotes: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    taskFooter: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskDeadline: {
        fontSize: 12,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    dateButton: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        paddingHorizontal: 8,
    },
    dateButtonIcon: {
        marginRight: 8,
    },
    dateButtonFocused: {
        borderColor: '#007AFF',
        backgroundColor: '#F8F9FF',
    },
    datePickerContainer: {
        marginBottom: 15,
        width: '100%',
    },
    datePickerLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    notesInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    prioritySelector: {
        marginBottom: 15,
    },
    labelText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    priorityButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priorityButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 4,
        alignItems: 'center',
    },
    priorityButtonText: {
        color: '#666',
    },
    selectedPriorityText: {
        color: '#fff',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    modalButtonText: {
        fontSize: 16,
        color: '#666',
    },
    saveButtonText: {
        color: '#fff',
    },
});

export default actionCenterStyles;