
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext.native';
import { Text, View } from 'react-native';
import Dashboard from './pages/Dashboard.native';
import WeightTracker from './pages/WeightTracker.native';
import Settings from './pages/Settings.native';
import Auth from './pages/Auth.native';
import CreateWorkout from './pages/CreateWorkout.native';
import EditWorkout from './pages/EditWorkout.native';
import ExecuteWorkout from './pages/ExecuteWorkout.native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Weight" component={WeightTracker} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AuthProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Auth" component={Auth} />
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen name="CreateWorkout" component={CreateWorkout} />
              <Stack.Screen name="EditWorkout" component={EditWorkout} />
              <Stack.Screen name="ExecuteWorkout" component={ExecuteWorkout} />
            </Stack.Navigator>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
