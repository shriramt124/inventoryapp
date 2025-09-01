
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getProductGroups, logoutUser, subscribeToProductGroups } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const [productGroups, setProductGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadProductGroups();
    
    // Set up real-time listener
    const unsubscribe = subscribeToProductGroups((groups) => {
      setProductGroups(groups);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadProductGroups = async () => {
    setLoading(true);
    const result = await getProductGroups();
    if (result.success) {
      setProductGroups(result.groups);
    } else {
      Alert.alert('Error', 'Failed to load product groups');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            const result = await logoutUser();
            if (result.success) {
              navigation.replace('Login');
            } else {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const renderProductGroup = ({ item }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => navigation.navigate('ProductList', { groupId: item.id, groupName: item.name })}
    >
      <View style={styles.groupHeader}>
        <Icon name="category" size={24} color="#4a80f5" />
        <Text style={styles.groupName}>{item.name}</Text>
      </View>
      <Text style={styles.groupDescription}>{item.description}</Text>
      <View style={styles.groupFooter}>
        <Text style={styles.groupDate}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <Icon name="arrow-forward-ios" size={16} color="#999" />
      </View>
    </TouchableOpacity>
  );

  const isAdmin = currentUser?.role === 'admin';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a80f5" />
          <Text style={styles.loadingText}>Loading product groups...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Stock Management</Text>
          <Text style={styles.subtitle}>
            Welcome, {currentUser?.displayName || currentUser?.name || 'User'} 
            {isAdmin && <Text style={styles.adminBadge}> (Admin)</Text>}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Admin Controls */}
      {isAdmin && (
        <View style={styles.adminControls}>
          <Text style={styles.adminTitle}>Admin Controls</Text>
          <View style={styles.adminButtonsRow}>
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <Icon name="dashboard" size={20} color="#fff" />
              <Text style={styles.adminButtonText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => navigation.navigate('CreateUser')}
            >
              <Icon name="person-add" size={20} color="#fff" />
              <Text style={styles.adminButtonText}>Add User</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.adminButtonsRow}>
            <TouchableOpacity
              style={[styles.adminButton, styles.createGroupButton]}
              onPress={() => navigation.navigate('CreateProductGroup')}
            >
              <Icon name="add-circle" size={20} color="#fff" />
              <Text style={styles.adminButtonText}>Create Group</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.adminButton, styles.manageButton]}
              onPress={() => navigation.navigate('ManageGroups')}
            >
              <Icon name="settings" size={20} color="#fff" />
              <Text style={styles.adminButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Product Groups</Text>
          {isAdmin && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('CreateProductGroup')}
            >
              <Icon name="add" size={24} color="#4a80f5" />
            </TouchableOpacity>
          )}
        </View>

        {productGroups.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="inventory" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No product groups found</Text>
            {isAdmin && (
              <Text style={styles.emptySubtext}>Create your first product group to get started</Text>
            )}
          </View>
        ) : (
          <FlatList
            data={productGroups}
            keyExtractor={(item) => item.id}
            renderItem={renderProductGroup}
            contentContainerStyle={styles.groupsList}
            refreshing={loading}
            onRefresh={loadProductGroups}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  adminBadge: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  adminControls: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  adminTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  adminButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  adminButton: {
    backgroundColor: '#4a80f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 0.48,
  },
  createGroupButton: {
    backgroundColor: '#27ae60',
  },
  manageButton: {
    backgroundColor: '#f39c12',
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  groupsList: {
    paddingBottom: 20,
  },
  groupCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
});

export default HomeScreen;
