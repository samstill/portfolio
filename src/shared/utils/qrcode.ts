import QRCode from 'qrcode';
import logger from './logger';

export const generateQR = async (text: string): Promise<string> => {
  try {
    // Generate QR code as data URL with enhanced options
    const url = await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H', // Highest error correction level
      color: {
        dark: '#000000',  // QR code color
        light: '#ffffff'  // Background color
      },
      rendererOpts: {
        quality: 1
      }
    });
    
    if (!url.startsWith('data:image/png;base64,')) {
      throw new Error('Invalid QR code generation result');
    }
    
    return url;
  } catch (err) {
    logger.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
};
