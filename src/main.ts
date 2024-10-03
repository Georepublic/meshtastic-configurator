// main.ts

import { getFormValues, populateForm } from './formHandler';
import { generatePSK } from './pskGenerator';
import { buildProtobuf } from './protobufBuilder';
import { generateQRCode } from './qrCodeGenerator';
import { getByteLength, toUrlSafeBase64, fromUrlSafeBase64 } from './utils';
import { Protobuf } from "@meshtastic/js";

/**
 * Handle the DOMContentLoaded event.
 * Add event listeners to the buttons and form fields.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check if there is a configuration in the URL hash and load it
  const urlHash = window.location.hash.substring(1);  // Remove the "#" character
  if (urlHash) {
    loadConfigurationFromHash(urlHash);
  }

  // Generate QR code for the default form values
  generateConfig();

  // Listen for changes on all form inputs and selects
  document.querySelectorAll('#meshtasticForm input, #meshtasticForm select').forEach(element => {
    element.addEventListener('input', generateConfig);
  });

  // Add a click listener for generating the PSK
  document.getElementById('generatePSK')?.addEventListener('click', handleGeneratePSK);

  // Add change listener for PSK type
  document.getElementById('pskType')?.addEventListener('change', handlePSKTypeChange);

  // Add click listener for copying the URL
  document.getElementById('copyUrlButton')?.addEventListener('click', copyUrlToClipboard);
});

/**
 * Load the configuration from the hash and populate the form.
 * @param {string} hash - The URL-safe Base64 configuration string.
 */
function loadConfigurationFromHash(hash: string): void {
  try {
    const binaryData = fromUrlSafeBase64(hash);
    const channelSet = Protobuf.AppOnly.ChannelSet.fromBinary(binaryData);

    // Extract the channel settings from the Protobuf message
    const channelSettings = channelSet.settings[0];

    // Determine PSK type based on the length of the PSK
    const pskLength = channelSettings.psk.length;
    let pskType = 'none';
    if (pskLength === 16) {
      pskType = 'aes128';
    } else if (pskLength === 32) {
      pskType = 'aes256';
    }

    const formValues = {
      channelName: channelSettings.name,
      pskType: pskType,  // Derived from PSK length
      psk: new TextDecoder().decode(channelSettings.psk),
      uplinkEnabled: channelSettings.uplinkEnabled,
      downlinkEnabled: channelSettings.downlinkEnabled,
      positionPrecision: channelSettings.moduleSettings?.positionPrecision || 0,
      isClientMuted: channelSettings.moduleSettings?.isClientMuted || false,
      region: channelSet.loraConfig.region,
      modemPreset: channelSet.loraConfig.modemPreset,
      hopLimit: channelSet.loraConfig.hopLimit,
      ignoreMqtt: channelSet.loraConfig.ignoreMqtt,
      configOkToMqtt: channelSet.loraConfig.configOkToMqtt,
    };

    // Populate the form with these values using formHandler
    populateForm(formValues);
  } catch (error) {
    console.error("Error loading configuration from URL hash:", error);
  }
}

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

  // Re-generate config when PSK type changes
  generateConfig();
}

/**
 * Handle the click event on the "Generate PSK" button.
 * Generate a PSK based on the selected PSK type and set the value in the input field.
 */
function handleGeneratePSK(): void {
  const pskType = (document.getElementById('pskType') as HTMLSelectElement).value;
  const psk = generatePSK(pskType);
  (document.getElementById('psk') as HTMLInputElement).value = psk;

  // Re-generate config when PSK is generated
  generateConfig();
}

/**
 * Generate a QR code and URL based on the form values.
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

/**
 * Copy the generated URL to the clipboard.
 * @returns void
 */
function copyUrlToClipboard(): void {
  const urlField = document.getElementById('generatedUrl') as HTMLInputElement;

  navigator.clipboard.writeText(urlField.value)
    .then(() => {
      showCopyNotification();
    })
    .catch(err => {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy URL');
    });
}

/**
 * Show the "URL copied" notification with animation
 */
function showCopyNotification(): void {
  const notification = document.getElementById('copyNotification');

  if (notification) {
    notification.classList.add('show');

    // Hide the notification after 2 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }
}

