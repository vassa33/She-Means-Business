// Profile.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Profile from '../screens/Profile';
import * as ImagePicker from 'expo-image-picker';

// Mock dependencies
jest.mock('expo-image-picker');
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

describe('Profile Component', () => {
    const mockProfileData = {
        name: 'Jane Doe',
        business: 'Tech Solutions',
        phone: '1234567890',
        businessStartDate: '2023-01-01',
        photoUrl: null
    };

    // Test 1: Initial Render
    it('renders profile information correctly', () => {
        const { getByText, getByTestId } = render(
            <Profile profileData={mockProfileData} />
        );

        expect(getByText('Jane Doe')).toBeTruthy();
        expect(getByText('Tech Solutions')).toBeTruthy();
        expect(getByText('1234567890')).toBeTruthy();
        expect(getByTestId('profile-photo')).toBeTruthy();
    });

    // Test 2: Edit Mode
    it('enables editing when edit button is pressed', () => {
        const { getByTestId, getAllByTestId } = render(
            <Profile profileData={mockProfileData} />
        );

        const editButton = getByTestId('edit-button');
        fireEvent.press(editButton);

        const inputFields = getAllByTestId('editable-field');
        expect(inputFields).toHaveLength(4); // Four editable fields
    });

    // Test 3: Photo Upload
    it('handles photo upload correctly', async () => {
        ImagePicker.launchImageLibraryAsync.mockResolvedValue({
            canceled: false,
            assets: [{ uri: 'test-uri.jpg' }]
        });

        const { getByTestId } = render(
            <Profile profileData={mockProfileData} />
        );

        const photoButton = getByTestId('photo-upload');
        fireEvent.press(photoButton);

        await waitFor(() => {
            expect(getByTestId('profile-image')).toHaveProperty('source', {
                uri: 'test-uri.jpg'
            });
        });
    });

    // Test 4: Form Validation
    it('validates required fields', async () => {
        const { getByTestId, getByText } = render(
            <Profile profileData={mockProfileData} />
        );

        // Enter edit mode
        fireEvent.press(getByTestId('edit-button'));

        // Clear required field
        const nameInput = getByTestId('name-input');
        fireEvent.changeText(nameInput, '');

        // Try to save
        const saveButton = getByTestId('save-button');
        fireEvent.press(saveButton);

        expect(getByText('Name is required')).toBeTruthy();
    });

    // Test 5: Snapshot
    it('matches snapshot', () => {
        const { toJSON } = render(
            <Profile profileData={mockProfileData} />
        );
        expect(toJSON()).toMatchSnapshot();
    });
});

