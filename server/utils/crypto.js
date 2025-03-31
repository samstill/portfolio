const crypto = require('crypto');
const forge = require('node-forge');

// Generate RSA key pair for end-to-end encryption
const generateKeyPair = () => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  
  const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
  
  return { publicKey, privateKey };
};

// Server-side validation of encrypted message structure
const validateEncryptedMessage = (message) => {
  try {
    if (!message.encryptedContent || !message.iv || !message.ephemPublicKey) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateKeyPair,
  validateEncryptedMessage
}; 