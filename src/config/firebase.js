import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Firebase is already initialized through the native modules
// No need to initialize it again here

export { firestore, auth };
export default { firestore, auth };