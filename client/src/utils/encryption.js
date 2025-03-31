import { aesEncrypt, aesDecrypt, generateAESKey, rsaEncrypt, rsaDecrypt } from './crypto';

// Generate session keys for each conversation
export const initializeConversation = async (recipientPublicKey) => {
  // Generate a random AES key for this conversation
  const aesKey = await generateAESKey();
  
  // Encrypt the AES key with recipient's public key
  const encryptedKey = await rsaEncrypt(aesKey, recipientPublicKey);
  
  return {
    aesKey,      // Store locally for this session
    encryptedKey // Send to recipient
  };
};

// Encrypt a message for sending
export const encryptMessage = async (message, aesKey) => {
  const encryptedContent = await aesEncrypt(message, aesKey);
  return encryptedContent;
};

// Decrypt a received message
export const decryptMessage = async (encryptedContent, aesKey) => {
  const decryptedMessage = await aesDecrypt(encryptedContent, aesKey);
  return decryptedMessage;
};

// Process an incoming message with encrypted AES key
export const processInitialMessage = async (encryptedKey, privateKey) => {
  // Decrypt the AES key using our private key
  const aesKey = await rsaDecrypt(encryptedKey, privateKey);
  return aesKey;
}; 