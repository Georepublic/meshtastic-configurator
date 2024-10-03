// configHandler.ts

import { getFormValues } from './formHandler';
import { buildProtobuf } from './protobufBuilder';
import { generateQRCode } from './qrCodeGenerator';
import { toUrlSafeBase64 } from './utils';

/**
 * Generate a QR code and URL based on the form values.
 */
export async function generateConfig(): Promise<void> {
  const formValues = getFormValues();

  // Validate channel name length
  const byteLength = new TextEncoder().encode(formValues.channelName).length;
  if (byteLength > 12) {
    alert(`Channel name must be less than or equal to 12 bytes (current byte length: ${byteLength}).`);
    return;
  }

  // Generate the protobuf binary data for the form values
  const channelSet = buildProtobuf(formValues);
  const binaryData = channelSet.toBinary();  // Binary data from Protobuf

  // Convert to URL-safe Base64 string
  const base64 = toUrlSafeBase64(binaryData);

  // Update the URL hash with the generated configuration
  window.location.hash = `#${base64}`;

  // Create the Meshtastic URL
  const meshtasticUrl = `https://meshtastic.org/e/#${base64}`;
  console.log("Generated Meshtastic URL:", meshtasticUrl);

  // Update the generated URL in the input field
  const urlField = document.getElementById('generatedUrl') as HTMLInputElement;
  urlField.value = meshtasticUrl;

  // Generate the QR code from the URL
  await generateQRCode(meshtasticUrl);
}
