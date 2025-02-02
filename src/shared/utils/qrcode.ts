import QRCode from 'qrcode';

export const generateQR = async (text: string): Promise<string> => {
  try {
    // Generate QR code as data URL
    const url = await QRCode.toDataURL(text, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',  // QR code color
        light: '#ffffff'  // Background color
      }
    });
    return url;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
};
