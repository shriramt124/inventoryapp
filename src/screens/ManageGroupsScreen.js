
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getProductGroups, getProductsByGroup } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

const ManageGroupsScreen = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupStats, setGroupStats] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    loadGroupsAndStats();
  }, []);

  const loadGroupsAndStats = async () => {
    setLoading(true);
    try {
      const result = await getProductGroups();
      if (result.success) {
        setGroups(result.groups);
        
        // Load product counts for each group
        const stats = {};
        for (const group of result.groups) {
          const productResult = await getProductsByGroup(group.id);
          stats[group.id] = productResult.success ? productResult.products.length : 0;
        }
        setGroupStats(stats);
      } else {
        Alert.alert('Error', 'Failed to load groups');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = (group) => {
    const productCount = groupStats[group.id] || 0;
    
    if (productCount > 0) {
      Alert.alert(
        'Cannot Delete',
        `This group contains ${productCount} product(s). Please remove all products before deleting the group.`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${group.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDeleteGroup(group.id),
        },
      ]
    );
  };

  const confirmDeleteGroup = async (groupId) => {
    // Note: You'll need to implement deleteProductGroup in firebaseService
    Alert.alert('Info', 'Group deletion feature will be implemented in firebaseService');
  };

  const renderGroupItem = ({ item }) => {
    const productCount = groupStats[item.id] || 0;
    
    return (
      <View style={styles.groupItem}>
        <View style={styles.groupHeader}>
          <Icon name="category" size={24} color="#4a80f5" />
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
        
        <View style={styles.groupStats}>
          <View style={styles.statItem}>
            <Icon name="inventory-2" size={16} color="#27ae60" />
            <Text style={styles.statText}>{productCount} products</Text>
          </View>
          <Text style={styles.groupDate}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.groupActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ProductList', { 
              groupId: item.id, 
              groupName: item.name 
            })}
          >
            <Icon name="visibility" size={18} color="#4a80f5" />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddProduct', { 
              groupId: item.id, 
              groupName: item.name 
            })}
          >
            <Icon name="add" size={18} color="#27ae60" />
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteGroup(item)}
          >
            <Icon name="delete" size={18} color="#e74c3c" />
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a80f5" />
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Groups</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateProductGroup')}
        >
          <Icon name="add" size={24} color="#4a80f5" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{groups.length}</Text>
          <Text style={styles.statLabel}>Total Groups</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {Object.values(groupStats).reduce((sum, count) => sum + count, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupItem}
        contentContainerStyle={styles.groupList}
        refreshing={loading}
        onRefresh={loadGroupsAndStats}
        showsVerticalScrollIndicator={false}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a80f5',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  groupList: {
    padding: 20,
  },
  groupItem: {
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
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  groupInfo: {
    flex: 1,
    marginLeft: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  groupStats: {
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statText: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
    marginLeft: 5,
  },
  groupDate: {
    fontSize: 12,
    color: '#999',
  },
  groupActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a80f5',
    marginLeft: 4,
  },
  deleteText: {
    color: '#e74c3c',
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

export default ManageGroupsScreen;
