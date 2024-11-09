// ../styles/CashFlowStyles.js
import { StyleSheet, Platform } from 'react-native';
import Colors from '../constants/Colors';

const platformShadow = Platform.select({
    ios: {
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    android: {
        elevation: 3,
    },
});

const CashFlowStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flexGrow: 1,  // Changed from flex: 1
        padding: 20,
    },
    periodSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: Colors.lightGray,
        borderRadius: 10,
        paddingVertical: 4,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    periodButtonActive: {
        backgroundColor: Colors.background,
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    periodButtonText: {
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    periodButtonTextActive: {
        color: Colors.text,
        fontWeight: '600',
    },
    summaryContainer: {
        backgroundColor: Colors.lightGray,
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    summaryAmount: {
        fontSize: 32,
        fontWeight: '700',
        marginVertical: 10,
    },
    helpButton: {
        padding: 6,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    statusText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    componentsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 10, // Add gap for better spacing when wrapped
    },
    componentItem: {
        flex: 1,
        minWidth: 150, // Ensure minimum width
        maxWidth: '48%',
        padding: 15,
        borderRadius: 12,
    },
    componentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 12, // Add more padding for better touch targets
    },
    componentLabel: {
        fontSize: 14,
        marginLeft: 6,
        color: Colors.text,
        fontWeight: '500',
        letterSpacing: 0.25, // Improve readability
    },
    componentValue: {
        fontSize: 20,
        fontWeight: '600',
        includeFontPadding: false, // Better vertical alignment
    },
    chartTypeSelector: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        flexWrap: 'wrap', // Better responsive layout
    },
    chartTypeButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 5,
        marginVertical: 4, // Account for wrap
        borderRadius: 20,
        backgroundColor: Colors.lightGray,
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    chartTypeButtonActive: {
        backgroundColor: Colors.primary,
        elevation: 4,
        shadowOpacity: 0.3,
    },
    chartTypeText: {
        color: Colors.textSecondary,
        fontWeight: '500',
        textAlign: 'center',
        minWidth: 60, // Ensure consistent button widths
    },
    chartTypeTextActive: {
        color: Colors.background,
        fontWeight: '600', // Slightly bolder when active
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    projectionModalContainer: {
        backgroundColor: Colors.background,
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    projectionModalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text,
    },
    inputLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.lightGray,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    projectionModalButton: {
        backgroundColor: Colors.primary,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    projectionModalButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
    tooltipOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    tooltipContainer: {
        backgroundColor: Colors.background,
        padding: 20,
        borderRadius: 15,
        width: '90%',
        maxWidth: 400,
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    tooltipTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 10,
    },
    tooltipDescription: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 15,
        lineHeight: 20,
    },
    tooltipTipsContainer: {
        backgroundColor: Colors.lightGray,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    tooltipTipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 10,
    },
    tooltipTipItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    tooltipTipText: {
        marginLeft: 8,
        fontSize: 14,
        color: Colors.text,
        flex: 1,
    },
    tooltipCloseButton: {
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    tooltipCloseText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '600',
    },
    graphContainer: {
        marginBottom: 25,
        backgroundColor: Colors.background,
        borderRadius: 15,
        padding: 15,
        ...platformShadow,
    },
    graphTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    graphTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    forecastButton: {
        backgroundColor: Colors.primary,
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    forecastButtonContent: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    forecastButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    insightsContainer: {
        backgroundColor: Colors.lightGray,
        padding: 20,
        borderRadius: 15,
        marginBottom: 20,
    },
    insightsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 15,
    },
    insightItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    insightLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    insightValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    }
});

export default CashFlowStyles;