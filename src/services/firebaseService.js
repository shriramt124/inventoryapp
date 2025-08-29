import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Authentication Services
export const registerUser = async (email, password, userData) => {
  try {
    // Create user with email and password
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Add user details to Firestore - use user.uid as document ID for easier retrieval
    await firestore().collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      displayName: userData.name || '',
      ...userData,
      createdAt: new Date().toISOString(),
    });
    
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Product Group Services
export const addProductGroup = async (groupData) => {
  try {
    const docRef = await firestore().collection('productGroups').add({
      ...groupData,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProductGroups = async () => {
  try {
    const querySnapshot = await firestore().collection('productGroups').get();
    const groups = [];
    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return { success: true, groups };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Product Services
export const addProduct = async (productData) => {
  try {
    // Use a transaction to ensure data consistency
    const db = firestore();
    let productId;
    
    await db.runTransaction(async (transaction) => {
      // Create a new document reference with auto-generated ID
      const newProductRef = db.collection('products').doc();
      productId = newProductRef.id;
      
      // Set the product data within the transaction
      transaction.set(newProductRef, {
        ...productData,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
    });
    
    return { success: true, id: productId };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
};

export const getProductsByGroup = async (groupId) => {
  try {
    const querySnapshot = await firestore()
      .collection('products')
      .where('groupId', '==', groupId)
      .get();
      
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return { success: true, products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProductById = async (productId) => {
  try {
    const docSnap = await firestore().collection('products').doc(productId).get();
    
    if (docSnap.exists) {
      return { 
        success: true, 
        product: {
          id: docSnap.id,
          ...docSnap.data(),
        },
      };
    } else {
      return { success: false, error: 'Product not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// runTransaction is now imported at the top of the file

export const updateProductStock = async (productId, newStock, newCartons, userId, changeReason = '') => {
  try {
    const db = firestore();
    
    // Use a transaction to ensure data consistency across devices
    await db.runTransaction(async (transaction) => {
      // Get current product data for history tracking
      const productRef = db.collection('products').doc(productId);
      const productSnap = await transaction.get(productRef);
      
      if (!productSnap.exists) {
        throw new Error('Product not found');
      }
      
      const currentData = productSnap.data();
      const timestamp = new Date().toISOString();
      
      // Update product stock within the transaction
      transaction.update(productRef, {
        stock: newStock,
        cartons: newCartons,
        lastUpdated: timestamp,
      });
      
      // Create stock history document
      const historyData = {
        productId,
        productName: currentData.name,
        previousStock: currentData.stock,
        newStock: newStock,
        previousCartons: currentData.cartons || 0,
        newCartons: newCartons || 0,
        changeAmount: newStock - currentData.stock,
        userId,
        changeReason,
        timestamp,
      };
      
      // Add stock history record within the transaction
      const historyRef = db.collection('stockHistory').doc();
      transaction.set(historyRef, historyData);
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating stock:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const subscribeToProductGroups = (callback) => {
  const unsubscribe = firestore().collection('productGroups').onSnapshot(
    (snapshot) => {
      const groups = [];
      snapshot.forEach((doc) => {
        groups.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      callback(groups);
    },
    (error) => {
      console.error('Error subscribing to product groups:', error);
    }
  );
  
  return unsubscribe;
};

export const subscribeToProducts = (groupId, callback) => {
  const unsubscribe = firestore()
    .collection('products')
    .where('groupId', '==', groupId)
    .onSnapshot(
      (snapshot) => {
        const products = [];
        snapshot.forEach((doc) => {
          products.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        callback(products);
      },
      (error) => {
        console.error('Error subscribing to products:', error);
      }
    );
  
  return unsubscribe;
};

// User Services
export const getUserById = async (userId) => {
  try {
    const docSnap = await firestore().collection('users').doc(userId).get();
    
    if (docSnap.exists) {
      return { 
        success: true, 
        user: {
          id: docSnap.id,
          ...docSnap.data(),
        },
      };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    await firestore().collection('users').doc(userId).update({
      ...userData,
      lastUpdated: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Stock History Services
export const getStockHistoryByProduct = async (productId) => {
  try {
    const querySnapshot = await firestore()
      .collection('stockHistory')
      .where('productId', '==', productId)
      .orderBy('timestamp', 'desc')
      .get();
    
    const history = [];
    
    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, history };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time listener for a single product
export const subscribeToProductById = (productId, callback) => {
  const unsubscribe = firestore()
    .collection('products')
    .doc(productId)
    .onSnapshot(
      (docSnapshot) => {
        if (docSnapshot.exists) {
          callback({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          });
        } else {
          console.error('Product document does not exist');
        }
      },
      (error) => {
        console.error('Error subscribing to product:', error);
      }
    );
  
  return unsubscribe;
};

// Real-time listener for stock history of a product
export const subscribeToStockHistory = (productId, callback) => {
  try {
    // First try with the compound query (requires composite index)
    const unsubscribe = firestore()
      .collection('stockHistory')
      .where('productId', '==', productId)
      .orderBy('timestamp', 'desc')
      .onSnapshot(
        (snapshot) => {
          const history = [];
          snapshot.forEach((doc) => {
            history.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          callback(history);
        },
        (error) => {
          // If we get an index error, fall back to a simpler query
          if (error.code === 'firestore/failed-precondition') {
            console.warn(
              'Missing index for this query. Using fallback query without sorting.\n' +
              'To fix this permanently, create the required index using this link:\n' +
              error.message.split('https://')[1]
            );
            
            // Fallback query without orderBy (doesn't require composite index)
            const fallbackUnsubscribe = firestore()
              .collection('stockHistory')
              .where('productId', '==', productId)
              .onSnapshot(
                (fallbackSnapshot) => {
                  const fallbackHistory = [];
                  fallbackSnapshot.forEach((doc) => {
                    fallbackHistory.push({
                      id: doc.id,
                      ...doc.data(),
                    });
                  });
                  
                  // Sort manually on the client side
                  fallbackHistory.sort((a, b) => {
                    return new Date(b.timestamp) - new Date(a.timestamp);
                  });
                  
                  callback(fallbackHistory);
                },
                (fallbackError) => {
                  console.error('Error in fallback stock history query:', fallbackError);
                }
              );
            
            return fallbackUnsubscribe;
          } else {
            console.error('Error subscribing to stock history:', error);
          }
        }
      );
    
    return unsubscribe;
  } catch (error) {
    console.error('Unexpected error in subscribeToStockHistory:', error);
    return () => {}; // Return empty function as unsubscribe
  }
};