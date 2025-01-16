// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';  // Add this import

const Stack = createNativeStackNavigator();

function Navigation() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // Auth Stack
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                title: 'Login',
                headerStyle: {
                  backgroundColor: '#2196F3',
                },
                headerTintColor: '#fff',
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                title: 'Register',
                headerStyle: {
                  backgroundColor: '#2196F3',
                },
                headerTintColor: '#fff',
              }}
            />
          </>
        ) : (
          // Main App Stack
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              title: 'Home',
              headerStyle: {
                backgroundColor: '#2196F3',
              },
              headerTintColor: '#fff',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}