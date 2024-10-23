import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './context/AppContext';

// Import screens
import Login from './screens/Login';
import CreateAccount from './screens/CreateAccount';
import Dashboard from './screens/Dashboard';
import TransactionLog from './screens/TransactionLog';
import CashFlow from './screens/CashFlow';
import BudgetTracker from './screens/BudgetTracker';
import SavingsTracker from './screens/SavingsTracker';
import Reports from './screens/Reports';
import Profile from './screens/Profile';
import About from './screens/About';


// Create the stack navigator
const Stack = createStackNavigator();

// Define the main App component
function App() {
    return (
        <AppProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false // This will hide the default header for all screens
                    }}
                    initialRouteName="Dashboard">
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="CreateAccount" component={CreateAccount} />
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                    <Stack.Screen name="TransactionLog" component={TransactionLog} />
                    <Stack.Screen name="CashFlow" component={CashFlow} />
                    <Stack.Screen name="BudgetTracker" component={BudgetTracker} />
                    <Stack.Screen name="SavingsTracker" component={SavingsTracker} />
                    <Stack.Screen name="Reports" component={Reports} />
                    <Stack.Screen name="Profile" component={Profile} />
                    <Stack.Screen name="About" component={About} />
                </Stack.Navigator>
            </NavigationContainer>
        </AppProvider>
    );
}

// Register the root component
registerRootComponent(App);

export default App;