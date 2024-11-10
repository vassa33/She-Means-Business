// ../styles/DashboardStyles.js
import { StyleSheet } from 'react-native';

const dashboardStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
    },
    welcomeSection: {
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    welcomeText: {
        fontSize: 16,
        color: '#666',
    },
    businessName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    alertsSection: {
        padding: 15,
    },
    alertItem: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    alertUrgent: {
        backgroundColor: '#fff5f5',
    },
    alertNormal: {
        backgroundColor: '#f8f9fa',
    },
    alertContent: {
        marginLeft: 15,
        flex: 1,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    alertDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    alertAmount: {
        fontSize: 14,
        color: '#007AFF',
        marginTop: 4,
    },
    insightsContainer: {
        padding: 15,
    },
    insightCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: '#007AFF15',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    actionText: {
        color: '#007AFF',
        fontSize: 14,
    },
    healthIndicator: {
        alignItems: 'center',
    },
    healthText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    healthSubtext: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});

export default dashboardStyles;