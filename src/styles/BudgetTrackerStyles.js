import { StyleSheet } from 'react-native';

//Budget Tracker styles
const budgetTrackerstyles = StyleSheet.create({
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
        //paddingVertical: 2,
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
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
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
    categoryItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginTop: 8,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    spentAmount: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    editButton: {
        padding: 8,
    },
    percentageText: {
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    budgetAmount: {
        fontSize: 14,
        color: '#666',
    },
    educationalTip: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tipText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        flex: 1,
    },
    tipCloseButton: {
        padding: 4,
    },
    tipCloseText: {
        fontSize: 16,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 24,
        alignItems: "stretch",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#333',
    },
    modalTip: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalAddButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginBottom: 12,
    },
    modalAddButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
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
    editModalButtons: {
        marginTop: 8,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    },
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
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 12,
        padding: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
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

export default budgetTrackerstyles;