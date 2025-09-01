import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductGroupScreen from '../screens/ProductGroupScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import AddProductScreen from '../screens/AddProductScreen';
import StockUpdateScreen from '../screens/StockUpdateScreen';
import StockHistoryScreen from '../screens/StockHistoryScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import CreateUserScreen from '../screens/CreateUserScreen';
import CreateProductGroupScreen from '../screens/CreateProductGroupScreen';
import ManageGroupsScreen from '../screens/ManageGroupsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { currentUser } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animationEnabled: true,
          gestureEnabled: true,
        }}
      >
        {currentUser ? (
          // User is signed in
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ProductGroup" component={ProductGroupScreen} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="StockUpdate" component={StockUpdateScreen} />
            <Stack.Screen name="StockHistory" component={StockHistoryScreen} />

            {/* Admin screens */}
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="CreateUser" component={CreateUserScreen} />
            <Stack.Screen name="CreateProductGroup" component={CreateProductGroupScreen} />
            <Stack.Screen name="ManageGroups" component={ManageGroupsScreen} />
          </>
        ) : (
          // User is signed out
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;