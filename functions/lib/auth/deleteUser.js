"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
exports.deleteUser = functions.https.onCall(async (data, context) => {
    // Check if the request is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    try {
        // Get the calling user's data to check permissions
        const callerUid = context.auth.uid;
        const callerRef = admin.firestore().collection('users').doc(callerUid);
        const callerDoc = await callerRef.get();
        if (!callerDoc.exists) {
            throw new functions.https.HttpsError('permission-denied', 'Caller user data not found.');
        }
        const callerData = callerDoc.data();
        // Check if the caller is an admin
        if ((callerData === null || callerData === void 0 ? void 0 : callerData.role) !== 'admin') {
            throw new functions.https.HttpsError('permission-denied', 'Only admin users can delete other users.');
        }
        // Get the target user's data
        const targetUid = data.uid;
        const targetRef = admin.firestore().collection('users').doc(targetUid);
        const targetDoc = await targetRef.get();
        if (!targetDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Target user not found.');
        }
        const targetData = targetDoc.data();
        // Prevent deletion of admin users
        if ((targetData === null || targetData === void 0 ? void 0 : targetData.role) === 'admin') {
            throw new functions.https.HttpsError('failed-precondition', 'Cannot delete admin users.');
        }
        // Delete the user from Authentication
        await admin.auth().deleteUser(targetUid);
        return {
            success: true,
            message: 'User authentication successfully deleted'
        };
    }
    catch (error) {
        console.error('Error in deleteUser function:', error);
        // Map Firebase Admin errors to appropriate HTTP errors
        if (error.code === 'auth/user-not-found') {
            throw new functions.https.HttpsError('not-found', 'User not found in authentication.');
        }
        if (error.code === 'auth/invalid-uid') {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid user ID provided.');
        }
        // If it's already a HttpsError, rethrow it
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        // For any other errors, throw an internal error
        throw new functions.https.HttpsError('internal', 'An internal error occurred while deleting the user.');
    }
});
//# sourceMappingURL=deleteUser.js.map