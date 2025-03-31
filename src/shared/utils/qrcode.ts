import QRCode from 'qrcode';

export const generateQR = async (text: string): Promise<string> => {
  // Validate input format
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid QR code content');
  }
  
  // Enforce minimum content length
  if (text.length < 10) {
    throw new Error('QR code content too short');
  }

  try {
    // Generate QR code as data URL with enhanced options
    const url = await QRCode.toDataURL(text, {
      width: 800,  // Larger size
      margin: 6,     // Increased margin
      errorCorrectionLevel: 'H',
      color: {
        dark: '#000000FF', // Solid black with full opacity
        light: '#FFFFFFFF' // Solid white with full opacity
      },
      rendererOpts: {
        quality: 1 // Maximum quality
      }
    });
    
    if (!url.startsWith('data:image/png;base64,')) {
      throw new Error('Invalid QR code generation result');
    }
    
    return url;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
};
