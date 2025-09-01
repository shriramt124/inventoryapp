
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Product Groups
export const createProductGroup = async (groupData) => {
  try {
    const docRef = await firestore()
      .collection('productGroups')
      .add({
        ...groupData,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    return docRef.id;
  } catch (error) {
    console.error('Error creating product group:', error);
    throw error;
  }
};

export const getProductGroups = async () => {
  try {
    const snapshot = await firestore()
      .collection('productGroups')
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching product groups:', error);
    throw error;
  }
};

export const updateProductGroup = async (groupId, updateData) => {
  try {
    await firestore()
      .collection('productGroups')
      .doc(groupId)
      .update({
        ...updateData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Error updating product group:', error);
    throw error;
  }
};

export const deleteProductGroup = async (groupId) => {
  try {
    await firestore()
      .collection('productGroups')
      .doc(groupId)
      .delete();
  } catch (error) {
    console.error('Error deleting product group:', error);
    throw error;
  }
};

// Products
export const addProduct = async (productData) => {
  try {
    const docRef = await firestore()
      .collection('products')
      .add({
        ...productData,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const getProductsByGroup = async (groupId) => {
  try {
    const snapshot = await firestore()
      .collection('products')
      .where('groupId', '==', groupId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const updateProduct = async (productId, updateData) => {
  try {
    await firestore()
      .collection('products')
      .doc(productId)
      .update({
        ...updateData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await firestore()
      .collection('products')
      .doc(productId)
      .delete();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Stock History
export const addStockHistory = async (historyData) => {
  try {
    await firestore()
      .collection('stockHistory')
      .add({
        ...historyData,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Error adding stock history:', error);
    throw error;
  }
};

export const getStockHistory = async (productId) => {
  try {
    const snapshot = await firestore()
      .collection('stockHistory')
      .where('productId', '==', productId)
      .orderBy('timestamp', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching stock history:', error);
    throw error;
  }
};

// Users
export const createUser = async (userData) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );
    
    await firestore()
      .collection('users')
      .doc(userCredential.user.uid)
      .set({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    
    return userCredential.user.uid;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUser = async (userId, updateData) => {
  try {
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        ...updateData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await firestore()
      .collection('users')
      .doc(userId)
      .delete();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
