import { 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  deleteDoc, 
  where,
  collection,
  getDoc
} from 'firebase/firestore';
import { db } from '../../firebase';
import { auth } from '../../firebase';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export const messageService = {
  async createMessage(content: string) {
    try {
      const messageData = {
        content,
        timestamp: serverTimestamp(),
        isRead: false,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'anonymous_messages'), messageData);
      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async getAllMessages(): Promise<Message[]> {
    try {
      // Check if user is admin
      const user = auth.currentUser;
      if (!user) {
        throw new UnauthorizedError('User must be authenticated');
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
        throw new UnauthorizedError('Only admin users can view messages');
      }

      const messagesQuery = query(
        collection(db, 'anonymous_messages'), 
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(messagesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      })) as Message[];
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new Error('Failed to fetch messages');
    }
  },

  async markAsRead(messageId: string) {
    try {
      // Check if user is admin
      const user = auth.currentUser;
      if (!user) {
        throw new UnauthorizedError('User must be authenticated');
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
        throw new UnauthorizedError('Only admin users can mark messages as read');
      }

      const messageRef = doc(db, 'anonymous_messages', messageId);
      await updateDoc(messageRef, {
        isRead: true
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new Error('Failed to mark message as read');
    }
  },

  async deleteMessage(messageId: string) {
    try {
      // Check if user is admin
      const user = auth.currentUser;
      if (!user) {
        throw new UnauthorizedError('User must be authenticated');
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
        throw new UnauthorizedError('Only admin users can delete messages');
      }

      const messageRef = doc(db, 'anonymous_messages', messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Error deleting message:', error);
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new Error('Failed to delete message');
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      // Check if user is admin
      const user = auth.currentUser;
      if (!user) {
        throw new UnauthorizedError('User must be authenticated');
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || userDoc.data()?.role !== 'admin') {
        throw new UnauthorizedError('Only admin users can view message counts');
      }

      const unreadQuery = query(
        collection(db, 'anonymous_messages'), 
        where('isRead', '==', false)
      );
      const snapshot = await getDocs(unreadQuery);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      return 0;
    }
  }
};
