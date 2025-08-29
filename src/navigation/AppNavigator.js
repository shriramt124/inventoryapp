import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: true, title: 'Stock Management' }}
        />
        <Stack.Screen 
          name="ProductGroup" 
          component={ProductGroupScreen} 
          options={{ headerShown: true, title: 'Product Groups' }}
        />
        <Stack.Screen 
          name="ProductList" 
          component={ProductListScreen} 
          options={{ headerShown: true, title: 'Products' }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen} 
          options={{ headerShown: true, title: 'Product Details' }}
        />
        <Stack.Screen 
          name="AddProduct" 
          component={AddProductScreen} 
          options={{ headerShown: true, title: 'Add New Product' }}
        />
        <Stack.Screen 
          name="StockUpdate" 
          component={StockUpdateScreen} 
          options={{ headerShown: true, title: 'Update Stock' }}
        />
        <Stack.Screen 
          name="StockHistory" 
          component={StockHistoryScreen} 
          options={{ headerShown: true, title: 'Stock History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;