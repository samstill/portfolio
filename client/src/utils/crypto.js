// Using the Web Crypto API for client-side cryptography
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Generate an AES key for symmetric encryption
export const generateAESKey = async () => {
  const key = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256
    },
    true,
    ["encrypt", "decrypt"]
  );
  
  // Export key to raw format for storage
  const rawKey = await window.crypto.subtle.exportKey("raw", key);
  return Array.from(new Uint8Array(rawKey));
};

// AES encryption
export const aesEncrypt = async (message, keyArray) => {
  // Convert key array back to ArrayBuffer
  const keyData = new Uint8Array(keyArray);
  
  // Import the key
  const key = await window.crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt"]
  );
  
  // Generate a random IV
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  // Encrypt the message
  const encodedMessage = encoder.encode(JSON.stringify(message));
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    encodedMessage
  );
  
  // Combine IV and encrypted data
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const result = {
    iv: Array.from(iv),
    encryptedData: Array.from(encryptedArray)
  };
  
  return result;
};

// AES decryption
export const aesDecrypt = async (encryptedObj, keyArray) => {
  // Convert key array back to ArrayBuffer
  const keyData = new Uint8Array(keyArray);
  
  // Import the key
  const key = await window.crypto.subtle.importKey(
    "raw",
    keyData,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["decrypt"]
  );
  
  // Extract IV and encrypted data
  const iv = new Uint8Array(encryptedObj.iv);
  const encryptedData = new Uint8Array(encryptedObj.encryptedData);
  
  // Decrypt the message
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    encryptedData
  );
  
  // Decode and parse the decrypted message
  const decryptedString = decoder.decode(decryptedBuffer);
  return JSON.parse(decryptedString);
};

// RSA encryption using recipient's public key
export const rsaEncrypt = async (data, publicKeyPEM) => {
  // Convert PEM to a format Web Crypto can use
  const publicKey = await importRSAPublicKey(publicKeyPEM);
  
  // Encode data
  const encodedData = encoder.encode(JSON.stringify(data));
  
  // Encrypt with RSA-OAEP
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP"
    },
    publicKey,
    encodedData
  );
  
  return Array.from(new Uint8Array(encryptedBuffer));
};

// RSA decryption using user's private key
export const rsaDecrypt = async (encryptedData, privateKeyPEM) => {
  // Convert PEM to a format Web Crypto can use
  const privateKey = await importRSAPrivateKey(privateKeyPEM);
  
  // Convert encryptedData array to ArrayBuffer
  const encryptedBuffer = new Uint8Array(encryptedData);
  
  // Decrypt with RSA-OAEP
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP"
    },
    privateKey,
    encryptedBuffer
  );
  
  // Decode and parse
  const decryptedString = decoder.decode(decryptedBuffer);
  return JSON.parse(decryptedString);
};

// Utility functions to handle key conversions
async function importRSAPublicKey(pem) {
  // Strip headers and parse base64
  const pemContents = pem
    .replace('-----BEGIN PUBLIC KEY-----', '')
    .replace('-----END PUBLIC KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryDer = window.atob(pemContents);
  const derBuffer = new Uint8Array(binaryDer.length);
  
  for (let i = 0; i < binaryDer.length; i++) {
    derBuffer[i] = binaryDer.charCodeAt(i);
  }
  
  return window.crypto.subtle.importKey(
    'spki',
    derBuffer,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' }
    },
    false,
    ['encrypt']
  );
}

async function importRSAPrivateKey(pem) {
  // Strip headers and parse base64
  const pemContents = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');
  
  const binaryDer = window.atob(pemContents);
  const derBuffer = new Uint8Array(binaryDer.length);
  
  for (let i = 0; i < binaryDer.length; i++) {
    derBuffer[i] = binaryDer.charCodeAt(i);
  }
  
  return window.crypto.subtle.importKey(
    'pkcs8',
    derBuffer,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-256' }
    },
    false,
    ['decrypt']
  );
} 