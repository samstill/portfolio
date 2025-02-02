import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const deleteUser = functions.https.onCall(async (data, context) => {
  // Enable more detailed error logging
  functions.logger.info('Delete user function called', { data, auth: context.auth });

  // Check if user is authenticated
  if (!context.auth) {
    functions.logger.error('No auth context');
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  try {
    const callerUid = context.auth.uid;
    const { uid } = data;

    functions.logger.info('Processing delete request', { callerUid, targetUid: uid });

    // Basic validation
    if (!uid) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'User ID is required'
      );
    }

    if (uid === callerUid) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Cannot delete your own account'
      );
    }

    // Get caller's admin status
    const callerDoc = await admin.firestore().collection('users').doc(callerUid).get();
    const callerData = callerDoc.data();

    if (!callerDoc.exists || !callerData || callerData.role !== 'admin') {
      functions.logger.error('Permission denied', { callerData });
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can delete users'
      );
    }

    // Get target user data
    const targetDoc = await admin.firestore().collection('users').doc(uid).get();
    const targetData = targetDoc.data();

    if (!targetDoc.exists || !targetData) {
      functions.logger.error('Target user not found in Firestore');
      throw new functions.https.HttpsError(
        'not-found',
        'User not found'
      );
    }

    if (targetData.role === 'admin') {
      functions.logger.error('Cannot delete admin user');
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Cannot delete admin users'
      );
    }

    // Delete from Firestore first
    functions.logger.info('Deleting user from Firestore');
    await admin.firestore().collection('users').doc(uid).delete();
    functions.logger.info('Successfully deleted user from Firestore');

    // Then try to delete from Auth
    try {
      functions.logger.info('Attempting to delete user from Auth');
      await admin.auth().deleteUser(uid);
      functions.logger.info('Successfully deleted user from Auth');
    } catch (authError: any) {
      functions.logger.error('Error deleting from Auth', { error: authError });
      
      // If user not found in Auth, that's okay - just continue
      if (authError.code === 'auth/user-not-found') {
        functions.logger.info('User not found in Auth - skipping Auth deletion');
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
    functions.logger.error('Function error', { error });
    
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError(
      'internal',
      error.message || 'An unknown error occurred'
    );
  }
}); 