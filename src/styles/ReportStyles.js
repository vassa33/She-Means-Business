// ../styles/ReportStyles.js
import { StyleSheet, Platform, StatusBar } from 'react-native';

const ReportStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000000'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    chartContainer: {
        position: 'relative',
        overflow: 'visible',
    },
    scrollableInfoViewContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
    },
    scrollableInfoViewText: {
        fontSize: 14,
        color: '#7F7F7F',
    },
    chartViewButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    chartViewButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginHorizontal: 4,
    },
    chartViewButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#767577',
    },
    chartTooltipIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    chartTooltip: {
        position: 'absolute',
        top: 30,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 280,
    },
    chartTooltipText: {
        fontSize: 14,
        color: '#7F7F7F',
    },
    elevatedTooltip: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    chartTooltipTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8
    },
    summaryContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
        //fontWeight: 'bold',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666'
    },
    generateButton: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    exportContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 42,
    },
    exportButton: {
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    exportButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    expenseCategory: {
        fontSize: 16,
        color: '#7F7F7F'
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    breakdownContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    breakdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    breakdownCategory: {
        fontSize: 16,
        color: '#7F7F7F'
    },
    breakdownAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000'
    },
    breakdownPeriodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    breakdownPeriodItem: {
        alignItems: 'center',
    },
    breakdownPeriodLabel: {
        fontSize: 14,
        color: '#7F7F7F'
    },
    breakdownPeriodValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    profitMargin: {
        color: '#20B2AA' // Light Sea Green for profit margin
    }
});

export default ReportStyles;