import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  getDocs,
  getFirestore,
  enableNetwork,
  disableNetwork,
  deleteDoc
} from 'firebase/firestore';
import { UserData, UserRole } from '../../shared/types/user';
import { db, functions, auth } from '../../firebase';
import { httpsCallable } from 'firebase/functions';
import { sendPasswordResetEmail } from 'firebase/auth';

export const userService = {
  // Network status management
  async goOnline() {
    try {
      await enableNetwork(db);
    } catch (error) {
      console.error('Error enabling network:', error);
    }
  },

  async goOffline() {
    try {
      await disableNetwork(db);
    } catch (error) {
      console.error('Error disabling network:', error);
    }
  },

  // Create or update user data
  async createUserData(uid: string, email: string): Promise<UserData> {
    try {
      const userData: UserData = {
        uid,
        email: email || '',
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, userData, { merge: true });
      return userData;
    } catch (error) {
      console.error('Error creating user data:', error);
      // Store locally if offline
      if (error instanceof Error && error.message.includes('offline')) {
        localStorage.setItem(`userData_${uid}`, JSON.stringify(userData));
        return userData;
      }
      throw error;
    }
  },

  // Get user data with offline support
  async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data() as UserData;
        return {
          ...data,
          uid: userSnap.id
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      // Return null instead of throwing on network errors
      if (error instanceof Error && error.message.includes('offline')) {
        const cachedData = localStorage.getItem(`userData_${uid}`);
        return cachedData ? JSON.parse(cachedData) : null;
      }
      return null;
    }
  },

  // Update user role
  async updateUserRole(uid: string, newRole: UserRole): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { 
        role: newRole,
        lastLogin: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw new Error('Failed to update user role');
    }
  },

  // Get all users (admin only)
  async getAllUsers(): Promise<UserData[]> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id
      })) as UserData[];
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Failed to get users');
    }
  },

  // Update last login
  async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        lastLogin: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw new Error('Failed to update last login');
    }
  },

  async deleteUser(uid: string): Promise<void> {
    try {
      if (!uid) {
        throw new Error('User ID is required');
      }

      console.log('Attempting to delete user:', uid);
      
      // Delete user using Cloud Function
      const deleteUserFunction = httpsCallable(functions, 'deleteUser');
      const result = await deleteUserFunction({ uid });
      
      console.log('Delete user function response:', result);
      
      const { data } = result as { data: { success: boolean, message: string } };
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to delete user');
      }

      // If we got a success response but with a warning message, show it as a toast
      if (data.message.includes('but Auth deletion failed')) {
        console.warn('Partial success:', data.message);
        // You might want to show this as a warning toast to the admin
      }

    } catch (error: any) {
      console.error('Error deleting user:', {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: error.stack
      });

      // Map error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        'functions/cancelled': 'Operation was cancelled',
        'functions/unknown': 'An unknown error occurred',
        'functions/invalid-argument': 'Invalid user ID provided',
        'functions/deadline-exceeded': 'Operation timed out',
        'functions/not-found': 'User not found',
        'functions/already-exists': 'Operation already in progress',
        'functions/permission-denied': 'You do not have permission to delete users',
        'functions/resource-exhausted': 'Too many requests, please try again later',
        'functions/failed-precondition': 'Cannot delete this user',
        'functions/aborted': 'Operation was aborted',
        'functions/out-of-range': 'Operation out of valid range',
        'functions/unimplemented': 'Operation not implemented',
        'functions/internal': 'Internal server error',
        'functions/unavailable': 'Service temporarily unavailable',
        'functions/data-loss': 'Unrecoverable data loss or corruption',
        'functions/unauthenticated': 'You must be logged in to perform this action',
      };

      const errorMessage = errorMessages[error.code] || error.message || 'Failed to delete user';
      throw new Error(errorMessage);
    }
  },

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
}; 