import { https, logger } from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

interface DeleteUserData {
  uid: string;
}

export const deleteUser = https.onCall(async (data: DeleteUserData, context) => {
  // Enable more detailed error logging
  logger.info('Delete user function called', { data, auth: context.auth });

  // Check if user is authenticated
  if (!context.auth) {
    logger.error('No auth context');
    throw new https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  try {
    const callerUid = context.auth.uid;
    const { uid } = data;

    logger.info('Processing delete request', { callerUid, targetUid: uid });

    // Basic validation
    if (!uid) {
      throw new https.HttpsError(
        'invalid-argument',
        'User ID is required'
      );
    }

    if (uid === callerUid) {
      throw new https.HttpsError(
        'failed-precondition',
        'Cannot delete your own account'
      );
    }

    // Get caller's admin status
    const callerDoc = await admin.firestore().collection('users').doc(callerUid).get();
    const callerData = callerDoc.data();

    if (!callerDoc.exists || !callerData || callerData.role !== 'admin') {
      logger.error('Permission denied', { callerData });
      throw new https.HttpsError(
        'permission-denied',
        'Only admins can delete users'
      );
    }

    // Get target user data
    const targetDoc = await admin.firestore().collection('users').doc(uid).get();
    const targetData = targetDoc.data();

    if (!targetDoc.exists || !targetData) {
      logger.error('Target user not found in Firestore');
      throw new https.HttpsError(
        'not-found',
        'User not found'
      );
    }

    if (targetData.role === 'admin') {
      logger.error('Cannot delete admin user');
      throw new https.HttpsError(
        'failed-precondition',
        'Cannot delete admin users'
      );
    }

    // Delete from Firestore first
    logger.info('Deleting user from Firestore');
    await admin.firestore().collection('users').doc(uid).delete();
    logger.info('Successfully deleted user from Firestore');

    // Then try to delete from Auth
    try {
      logger.info('Attempting to delete user from Auth');
      await admin.auth().deleteUser(uid);
      logger.info('Successfully deleted user from Auth');
    } catch (authError: any) {
      logger.error('Error deleting from Auth', { error: authError });
      
      // If user not found in Auth, that's okay - just continue
      if (authError.code === 'auth/user-not-found') {
        logger.info('User not found in Auth - skipping Auth deletion');
        return { success: true, message: 'User data deleted (not found in Auth)' };
      }
      
      // For other Auth errors, we've already deleted from Firestore, so just report the partial success
      return { 
        success: true, 
        message: 'User data deleted from Firestore, but Auth deletion failed: ' + authError.message 
      };
    }

    return { success: true, message: 'User completely deleted' };

  } catch (error: any) {
    logger.error('Function error', { error });
    
    if (error instanceof https.HttpsError) {
      throw error;
    }

    throw new https.HttpsError(
      'internal',
      error.message || 'An unknown error occurred'
    );
  }
}); 