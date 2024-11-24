import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './contexts/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, View, Text, StyleSheet, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';

// Import screens
import Login from './screens/Authentication/Login';
import CreateAccount from './screens/Authentication/CreateAccount';
import Dashboard from './screens/Dashboard';
import TransactionLog from './screens/TransactionLog';
import CashFlow from './screens/CashFlow';
import BudgetTracker from './screens/BudgetTracker';
import SavingsTracker from './screens/SavingsTracker';
import Reports from './screens/Reports';
import Profile from './screens/Profile';
import About from './screens/About';
import ActionCenter from './screens/ActionCenter';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';
import { DataProvider } from './contexts/DataContext';
import { AppProvider } from './contexts/AppContext';
import { InternalDataProvider } from './contexts/InternalDataContext';

// Create the stack navigator
const Stack = createStackNavigator();

// SVG content as a string constant
const logoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <circle cx="200" cy="200" r="190" fill="#FFF5F7" />
  <path d="M200 20c99.411 0 180 80.589 180 180s-80.589 180-180 180S20 299.411 20 200 100.589 20 200 20" 
        fill="none" 
        stroke="#FF6B97" 
        stroke-width="4"
        stroke-dasharray="20,10" />
  <path d="M200 120
           c-20 0 -36 16 -36 36
           c0 20 16 36 36 36
           c20 0 36-16 36-36
           c0-20 -16-36 -36-36"
        fill="#FF6B97" />
  <path d="M200 192
           l-40 80
           h80
           z"
        fill="#FF6B97" />
  <path d="M100 300
           Q150 280 200 260
           Q250 240 300 200"
        fill="none"
        stroke="#4A90E2"
        stroke-width="4"
        stroke-linecap="round" />
  <text x="120" y="240" 
        font-family="Arial" 
        font-size="24" 
        fill="#4A90E2">$</text>
  <text x="280" y="240" 
        font-family="Arial" 
        font-size="24" 
        fill="#4A90E2">$</text>
  <circle cx="140" cy="160" r="15" fill="#4A90E2" opacity="0.3" />
  <circle cx="260" cy="160" r="15" fill="#4A90E2" opacity="0.3" />
  <text x="200" y="350" 
        font-family="Arial" 
        font-weight="bold"
        font-size="32" 
        fill="#333333" 
        text-anchor="middle">SMB</text>
</svg>
`;

// Define the main App component
function App() {
    const [fontsLoaded] = useFonts({
        ...Ionicons.font
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <SvgXml
                    xml={logoSvg}
                    width={200}
                    height={200}
                    style={styles.animation}
                />
                <Text style={styles.loadingText}>
                    Loading SMB Financial Manager...
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent={true}
            />
            <NavigationContainer ref={navigationRef}>
                <UIProvider>
                    <AuthProvider>
                        <InternalDataProvider>
                            <DataProvider>
                                <AppProvider>
                                    <Stack.Navigator
                                        screenOptions={{
                                            headerShown: false,
                                        }}
                                        initialRouteName="Login">
                                        <Stack.Screen name="Login" component={Login} />
                                        <Stack.Screen name="CreateAccount" component={CreateAccount} />
                                        <Stack.Screen name="Dashboard" component={Dashboard} />
                                        <Stack.Screen name="ActionCenter" component={ActionCenter} />
                                        <Stack.Screen name="TransactionLog" component={TransactionLog} />
                                        <Stack.Screen name="CashFlow" component={CashFlow} />
                                        <Stack.Screen name="BudgetTracker" component={BudgetTracker} />
                                        <Stack.Screen name="SavingsTracker" component={SavingsTracker} />
                                        <Stack.Screen name="Reports" component={Reports} />
                                        <Stack.Screen name="Profile" component={Profile} />
                                        <Stack.Screen name="About" component={About} />
                                    </Stack.Navigator>
                                </AppProvider>
                            </DataProvider>
                        </InternalDataProvider>
                    </AuthProvider>
                </UIProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF5F7',
    },
    animation: {
        width: 200,
        height: 200,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#FF6B97',
        marginTop: 20,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto'
    }
});

// Register the root component
registerRootComponent(App);

export default App;