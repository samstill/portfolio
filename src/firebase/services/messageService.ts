import { addDoc, getDocs, query, orderBy, serverTimestamp, updateDoc, doc, deleteDoc, where } from 'firebase/firestore';
import { messagesCollection, db } from '../../firebase';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export const messageService = {
  async createMessage(content: string) {
    try {
      const messageData = {
        content,
        timestamp: serverTimestamp(),
        isRead: false
      };
      
      await addDoc(messagesCollection, messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  async getAllMessages(): Promise<Message[]> {
    const messagesQuery = query(messagesCollection, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    })) as Message[];
  },

  async markAsRead(messageId: string) {
    const messageRef = doc(db, 'messages', messageId);
    await updateDoc(messageRef, {
      isRead: true
    });
  },

  async deleteMessage(messageId: string) {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const unreadQuery = query(messagesCollection, where('isRead', '==', false));
      const snapshot = await getDocs(unreadQuery);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
};
