import QRCode from 'qrcode';

export interface QRCodeOptions {
  color?: {
    dark?: string;
    light?: string;
  };
  width?: number;
  margin?: number;
}

export async function generateQRCode(text: string, options: QRCodeOptions = {}): Promise<string> {
  try {
    const { color, width = 400, margin = 2 } = options;
    return await QRCode.toDataURL(text, {
      width,
      margin,
      color: {
        dark: color?.dark || '#000000',
        light: color?.light || '#ffffff',
      },
    });
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate QR code');
  }
}
