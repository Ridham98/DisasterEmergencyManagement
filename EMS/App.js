// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/AuthContext';
import Login from './src/Login';
import Signup from './src/Signup';
import Home from './src/Home';
import WeatherInfo from './src/WeatherInfo';
import EMSUser from './src/EMSUser';
import Profile from './src/Profile';
import EMSAdmin from './src/EMSAdmin';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator
   screenOptions={{
      headerStyle: { backgroundColor: '#126180' }, // Background color of the header
      headerTintColor: '#fff', // Title color
      headerTitleStyle: { fontWeight: 'bold', fontSize: 24 }, // Title style
    }}
    >
    <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    <Stack.Screen name="WeatherInfo" component={WeatherInfo} options={{ title: 'Weather Info' }} />
    <Stack.Screen name="EMSUser" component={EMSUser} options={{ title: 'EMS User' }} />
    <Stack.Screen name="EMSAdmin" component={EMSAdmin} options={{ title: 'EMS Admin' }} />
    <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
