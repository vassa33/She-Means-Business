// Dashboard.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Dashboard from '../screens/Dashboard';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

describe('Dashboard Component', () => {
    const mockProfileData = {
        ownerName: 'Jane Doe',
        business: 'Test Business'
    };

    // Test 1: Component Renders
    it('renders correctly', () => {
        const { getByText, toJSON } = render(
            <NavigationContainer>
                <Dashboard profileData={mockProfileData} />
            </NavigationContainer>
        );

        expect(getByText('Test Business')).toBeTruthy();
        expect(toJSON()).toMatchSnapshot();
    });

    // Test 2: Welcome Message
    it('displays correct greeting based on time', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Dashboard profileData={mockProfileData} />
            </NavigationContainer>
        );

        const welcomeText = getByText(/Good (Morning|Afternoon|Evening)/);
        expect(welcomeText).toBeTruthy();
    });

    // Test 3: Upcoming Items
    it('displays upcoming items correctly', () => {
        const { getByText } = render(
            <NavigationContainer>
                <Dashboard profileData={mockProfileData} />
            </NavigationContainer>
        );

        expect(getByText('File Tax Returns')).toBeTruthy();
        expect(getByText('Supplier Payment')).toBeTruthy();
        expect(getByText('Ksh 50,000')).toBeTruthy();
    });

    // Test 4: Navigation Handler
    it('handles action press correctly', () => {
        const { getByTestId } = render(
            <NavigationContainer>
                <Dashboard profileData={mockProfileData} />
            </NavigationContainer>
        );

        const actionButton = getByTestId('action-button');
        fireEvent.press(actionButton);

        // Verify navigation was called
        expect(navigation.navigate).toHaveBeenCalled();
    });
});
