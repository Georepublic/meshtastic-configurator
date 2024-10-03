import { getFormValues } from './formHandler';
import { generatePSK } from './pskGenerator';
import { buildProtobuf } from './protobufBuilder';
import { generateQRCode } from './qrCodeGenerator';
import { getByteLength, toUrlSafeBase64 } from './utils';

/**
 * Handle the DOMContentLoaded event.
 * Add event listeners to the buttons.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateConfig')?.addEventListener('click', generateConfig);
  document.getElementById('generatePSK')?.addEventListener('click', handleGeneratePSK);
  document.getElementById('pskType')?.addEventListener('change', handlePSKTypeChange);
  document.getElementById('copyUrlButton')?.addEventListener('click', copyUrlToClipboard);
});

/**
 * Handle the change event on the PSK type select element.
 * Enable or disable the PSK input field based on the selected PSK type.
 */
function handlePSKTypeChange(): void {
  const pskType = (document.getElementById('pskType') as HTMLSelectElement).value;
  const pskField = document.getElementById('psk') as HTMLInputElement;

  if (pskType === 'none') {
    pskField.value = '';
    pskField.disabled = true;
  } else {
    pskField.disabled = false;
    handleGeneratePSK();
  }
}

/**
 * Handle the click event on the "Generate PSK" button.
 * Generate a PSK based on the selected PSK type and set the value in the input field.
 */
function handleGeneratePSK(): void {
  const pskType = (document.getElementById('pskType') as HTMLSelectElement).value;
  const psk = generatePSK(pskType);
  (document.getElementById('psk') as HTMLInputElement).value = psk;
}

/**
 * Generate a QR code based on the form values.
 */
async function generateConfig(): Promise<void> {
  const formValues = getFormValues();

  // Validate channel name length
  const byteLength = getByteLength(formValues.channelName);
  if (byteLength > 12) {
    alert(`Channel name must be less than or equal to 12 bytes (current byte length: ${byteLength}).`);
    return;
  }

  // Generate the protobuf binary data for the form values
  const channelSet = buildProtobuf(formValues);
  const binaryData = channelSet.toBinary();  // Binary data from Protobuf

  // Convert to URL-safe Base64 string
  const base64 = toUrlSafeBase64(binaryData);

  // Create the Meshtastic URL
  const meshtasticUrl = `https://meshtastic.org/e/#${base64}`;
  console.log("Generated Meshtastic URL:", meshtasticUrl);

  // Update the generated URL in the input field
  const urlField = document.getElementById('generatedUrl') as HTMLInputElement;
  urlField.value = meshtasticUrl;

  // Generate the QR code from the URL
  await generateQRCode(meshtasticUrl);
}

/**
 * Copy the generated URL to the clipboard.
 * @returns void
 */
function copyUrlToClipboard(): void {
  const urlField = document.getElementById('generatedUrl') as HTMLInputElement;

  // Use the Clipboard API to copy the URL
  navigator.clipboard.writeText(urlField.value)
      .then(() => {
          alert('URL copied to clipboard!');
      })
      .catch(err => {
          console.error('Failed to copy text: ', err);
          alert('Failed to copy URL');
      });
}
