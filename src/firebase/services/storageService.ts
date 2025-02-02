import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase';

export const storageService = {
  async uploadProfilePhoto(userId: string, file: File): Promise<string> {
    const photoRef = ref(storage, `profilePhotos/${userId}`);
    await uploadBytes(photoRef, file);
    return getDownloadURL(photoRef);
  },

  async deleteProfilePhoto(userId: string) {
    try {
      const photoRef = ref(storage, `profilePhotos/${userId}`);
      await deleteObject(photoRef);
    } catch (error) {
      console.error('Error deleting profile photo:', error);
    }
  }
};
