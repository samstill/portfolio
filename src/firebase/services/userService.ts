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
  deleteDoc,
  where
} from 'firebase/firestore';
import { UserData, UserRole } from '../../shared/types/user';
import { db, functions, auth, storage } from '../../firebase';
import { httpsCallable } from 'firebase/functions';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ref, deleteObject } from 'firebase/storage';
import { ticketService } from './ticketService';

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

  async deleteUser(uid: string): Promise<{ success: boolean; partialDeletion: boolean; message: string }> {
    try {
      if (!uid) {
        throw new Error('User ID is required');
      }

      // First check if user exists and get their data
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data();

      // Check if user is admin
      if (userData.role === 'admin') {
        throw new Error('Cannot delete admin users');
      }

      // 1. First check if the user has any active tickets
      let userTickets: any[] = [];
      try {
        userTickets = await ticketService.getTicketsByUserId(uid);
        if (userTickets.length > 0) {
          const activeTickets = userTickets.filter(ticket => 
            ticket.status === 'valid' || ticket.status === 'partially_used'
          );
          if (activeTickets.length > 0) {
            throw new Error('Cannot delete user with active tickets. Please cancel or validate all tickets first.');
          }
        }
      } catch (error) {
        console.warn('Error checking user tickets:', error);
      }

      // 2. Attempt to delete the auth user via Cloud Function
      const deleteUserFunction = httpsCallable(functions, 'deleteUser');
      let authDeletionSuccess = false;
      let retryCount = 0;
      const maxRetries = 3;
      let lastError: any = null;
      
      while (!authDeletionSuccess && retryCount < maxRetries) {
        try {
          console.log(`Attempting to delete auth user (attempt ${retryCount + 1}/${maxRetries})...`);
          const result = await deleteUserFunction({ uid });
          const { data } = result as { data: { success: boolean, message: string } };
          
          if (data.success) {
            authDeletionSuccess = true;
            console.log('Successfully deleted auth user');
          } else {
            throw new Error(data.message || 'Failed to delete auth user');
          }
        } catch (functionError: any) {
          retryCount++;
          lastError = functionError;
          console.error(`Auth deletion attempt ${retryCount} failed:`, functionError);
          
          // For internal errors, we'll proceed with data deletion
          if (functionError.code === 'functions/internal') {
            console.warn('Internal error in auth deletion, proceeding with data deletion...');
            break;
          }
          
          if (retryCount < maxRetries) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, retryCount), 10000)));
          }
        }
      }

      // If auth deletion failed after all retries, check if we can proceed
      if (!authDeletionSuccess) {
        const errorCode = lastError?.code;
        const canProceedWithDataDeletion = 
          errorCode === 'functions/internal' || // Internal error, likely permissions
          errorCode === 'functions/not-found' || // User doesn't exist in auth
          errorCode === 'functions/already-exists' || // User already deleted
          errorCode === 'functions/permission-denied'; // User might be deleted but we don't have permission to verify

        if (!canProceedWithDataDeletion) {
          throw new Error('Failed to delete user authentication. Please try again later or contact support.');
        }
        console.warn('Auth deletion failed but proceeding with data deletion due to error type:', errorCode);
      }

      // 3. Delete user's profile photo from storage if it exists
      if (userData.photoURL) {
        try {
          const photoRef = ref(storage, `profilePhotos/${uid}`);
          await deleteObject(photoRef);
          console.log('Successfully deleted user profile photo');
        } catch (error) {
          console.warn('No profile photo found or error deleting it:', error);
        }
      }

      // 4. Delete all user's tickets (even if inactive)
      try {
        await Promise.all(userTickets.map(ticket => deleteDoc(doc(db, 'tickets', ticket.id))));
        console.log(`Successfully deleted ${userTickets.length} tickets`);
      } catch (error) {
        console.warn('Error deleting user tickets:', error);
      }

      // 5. Delete user's messages if any
      try {
        const messagesQuery = query(collection(db, 'messages'), where('userId', '==', uid));
        const messagesDocs = await getDocs(messagesQuery);
        await Promise.all(messagesDocs.docs.map(doc => deleteDoc(doc.ref)));
        console.log(`Successfully deleted ${messagesDocs.size} messages`);
      } catch (error) {
        console.warn('Error deleting user messages:', error);
      }

      // 6. Finally delete the user document from Firestore
      await deleteDoc(userRef);
      console.log('Successfully deleted user document from Firestore');

      // Return appropriate status based on the situation
      if (authDeletionSuccess) {
        return {
          success: true,
          partialDeletion: false,
          message: 'User and all associated data successfully deleted'
        };
      } else if (lastError?.code === 'functions/internal') {
        return {
          success: true,
          partialDeletion: true,
          message: 'User data has been deleted. The authentication record will be cleaned up automatically within 24 hours.'
        };
      } else {
        return {
          success: true,
          partialDeletion: true,
          message: 'User data deleted but there might be issues with authentication. The user may need to be removed from authentication separately.'
        };
      }

    } catch (error: any) {
      console.error('Error deleting user:', {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: error.stack
      });

      // If it's a Firestore error
      if (error.name === 'FirebaseError' && error.code.startsWith('firestore/')) {
        throw new Error('Failed to delete user data. Please try again.');
      }

      // If it's already a handled error with a message, just rethrow it
      if (error instanceof Error) {
        throw error;
      }

      // For any other unhandled errors
      throw new Error('An unexpected error occurred while deleting the user');
    }
  },

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  },

  async getUserById(uid: string): Promise<UserData | null> {
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
      console.error('Error getting user by ID:', error);
      throw new Error('Failed to get user data');
    }
  }
};

// Helper function to map error codes to user-friendly messages
function mapErrorMessage(code: string): string {
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

  return errorMessages[code] || 'An error occurred while processing your request';
} 