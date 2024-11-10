import { StyleSheet } from 'react-native';

//Savings Tracker styles
const savingsTrackerStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    monthNavigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        //paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    monthNavigationButton: {
        padding: 8,
    },
    currentMonthText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    // Overview Section
    overviewContainer: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
    },
    overviewTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    overviewAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    overviewSubtext: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    overviewDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
    },
    overviewItem: {
        flex: 1,
        alignItems: 'center',
    },
    overviewLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    overviewDivider: {
        width: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 16,
    },

    // Chart Section
    chartContainer: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
    },
    chartControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toggleLabel: {
        marginRight: 8,
        fontSize: 14,
        color: '#666',
    },
    chartWrapper: {
        alignItems: 'center',
    },
    chartFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    chartViewButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginHorizontal: 6,
    },
    activeChartViewButton: {
        backgroundColor: '#81b0ff',
    },
    chartViewButtonText: {
        fontSize: 14,
        color: '#666',
    },
    activeChartViewButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },

    // Goals List
    goalItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
    },
    goalText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    goalPercentage: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressBar: {
        height: 12,
        backgroundColor: '#f0f0f0',
        borderRadius: 6,
        marginVertical: 8,
    },
    progressFill: {
        height: 12,
        borderRadius: 6,
    },

    // Floating Add Button
    floatingAddButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#444',
    },
    modalCloseButton: {
        padding: 5,
    },
    modalTip: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    modalAddButton: {
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    modalAddButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    editModalButtons: {
        width: '100%',
        gap: 10,
    },
    modalDeleteButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FF6B6B',
    },
    modalDeleteButtonText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyChartContainer: {
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginVertical: 10,
        padding: 20,
    },
    emptyChartText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyChartSubtext: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    }
});

export default savingsTrackerStyles;