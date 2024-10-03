// qrCodeGenerator.ts

import QRCode from 'qrcode';

/**
 * Generate a QR code from the provided Meshtastic URL string.
 * @param meshtasticUrl - The Meshtastic URL to encode in the QR code.
 */
export async function generateQRCode(meshtasticUrl: string): Promise<void> {
  const qrCodeElement = document.getElementById('qrcode') as HTMLCanvasElement;
  qrCodeElement.innerHTML = "";  // Clear previous QR code

  try {
    await QRCode.toCanvas(qrCodeElement, meshtasticUrl);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      alert('QR Code generation failed: ' + error.message);
    } else {
      console.error('An unknown error occurred:', error);
      alert('An unknown error occurred');
    }
  }
}
