import { StyleSheet, Platform, StatusBar } from 'react-native';

const profileStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
    },
    profilePicContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    changePhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderRadius: 20,
        gap: 5,
    },
    changePhotoText: {
        color: '#007AFF',
        fontSize: 14,
    },
    infoContainer: {
        padding: 20,
    },
    infoItem: {
        marginBottom: 20,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        gap: 5,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        gap: 10,
    },
    saveButton: {
        backgroundColor: '#34C759',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    versionText: {
        textAlign: 'center',
        color: '#888',
        marginBottom: 20,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        paddingTop: 8,
    },

    dateInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 8,
        marginLeft: 10,
    },
});

export default profileStyles;