
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import CreateProductGroupScreen from '../screens/CreateProductGroupScreen';
import ManageGroupsScreen from '../screens/ManageGroupsScreen';
import ProductGroupScreen from '../screens/ProductGroupScreen';
import ProductListScreen from '../screens/ProductListScreen';
import AddProductScreen from '../screens/AddProductScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import StockUpdateScreen from '../screens/StockUpdateScreen';
import StockHistoryScreen from '../screens/StockHistoryScreen';
import CreateUserScreen from '../screens/CreateUserScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, userRole } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          // Authentication screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main app screens
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            {userRole === 'admin' && (
              <>
                <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                <Stack.Screen name="CreateProductGroup" component={CreateProductGroupScreen} />
                <Stack.Screen name="ManageGroups" component={ManageGroupsScreen} />
                <Stack.Screen name="CreateUser" component={CreateUserScreen} />
              </>
            )}
            <Stack.Screen name="ProductGroup" component={ProductGroupScreen} />
            <Stack.Screen name="ProductList" component={ProductListScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="StockUpdate" component={StockUpdateScreen} />
            <Stack.Screen name="StockHistory" component={StockHistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
