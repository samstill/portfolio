"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const v1_1 = require("firebase-functions/v1");
const admin = require("firebase-admin");
// Initialize Firebase Admin
admin.initializeApp();
exports.deleteUser = v1_1.https.onCall(async (data, context) => {
    // Enable more detailed error logging
    v1_1.logger.info('Delete user function called', { data, auth: context.auth });
    // Check if user is authenticated
    if (!context.auth) {
        v1_1.logger.error('No auth context');
        throw new v1_1.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    try {
        const callerUid = context.auth.uid;
        const { uid } = data;
        v1_1.logger.info('Processing delete request', { callerUid, targetUid: uid });
        // Basic validation
        if (!uid) {
            throw new v1_1.https.HttpsError('invalid-argument', 'User ID is required');
        }
        if (uid === callerUid) {
            throw new v1_1.https.HttpsError('failed-precondition', 'Cannot delete your own account');
        }
        // Get caller's admin status
        const callerDoc = await admin.firestore().collection('users').doc(callerUid).get();
        const callerData = callerDoc.data();
        if (!callerDoc.exists || !callerData || callerData.role !== 'admin') {
            v1_1.logger.error('Permission denied', { callerData });
            throw new v1_1.https.HttpsError('permission-denied', 'Only admins can delete users');
        }
        // Get target user data
        const targetDoc = await admin.firestore().collection('users').doc(uid).get();
        const targetData = targetDoc.data();
        if (!targetDoc.exists || !targetData) {
            v1_1.logger.error('Target user not found in Firestore');
            throw new v1_1.https.HttpsError('not-found', 'User not found');
        }
        if (targetData.role === 'admin') {
            v1_1.logger.error('Cannot delete admin user');
            throw new v1_1.https.HttpsError('failed-precondition', 'Cannot delete admin users');
        }
        // Delete from Firestore first
        v1_1.logger.info('Deleting user from Firestore');
        await admin.firestore().collection('users').doc(uid).delete();
        v1_1.logger.info('Successfully deleted user from Firestore');
        // Then try to delete from Auth
        try {
            v1_1.logger.info('Attempting to delete user from Auth');
            await admin.auth().deleteUser(uid);
            v1_1.logger.info('Successfully deleted user from Auth');
        }
        catch (authError) {
            v1_1.logger.error('Error deleting from Auth', { error: authError });
            // If user not found in Auth, that's okay - just continue
            if (authError.code === 'auth/user-not-found') {
                v1_1.logger.info('User not found in Auth - skipping Auth deletion');
                return { success: true, message: 'User data deleted (not found in Auth)' };
            }
            // For other Auth errors, we've already deleted from Firestore, so just report the partial success
            return {
                success: true,
                message: 'User data deleted from Firestore, but Auth deletion failed: ' + authError.message
            };
        }
        return { success: true, message: 'User completely deleted' };
    }
    catch (error) {
        v1_1.logger.error('Function error', { error });
        if (error instanceof v1_1.https.HttpsError) {
            throw error;
        }
        throw new v1_1.https.HttpsError('internal', error.message || 'An unknown error occurred');
    }
});
//# sourceMappingURL=index.js.map