import { Protobuf } from "@meshtastic/js";
import QRCode from "qrcode";
import { fromByteArray } from "base64-js";

/**
 * Entry point for the application.
 * This function is called when the DOM is fully loaded.
 * @returns void
 */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('generateQRCode')?.addEventListener('click', generateQRCode);
  document.getElementById('generatePSK')?.addEventListener('click', generatePSK);
  document.getElementById('copyUrlButton')?.addEventListener('click', copyUrlToClipboard);
});

/**
 * Generate a random PSK and set it in the PSK input field.
 * The PSK is a 32-character hexadecimal string.
 * @returns void
 */
function generatePSK(): void {
  const pskField = document.getElementById('psk') as HTMLInputElement;
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  let psk = '';
  for (let i = 0; i < randomBytes.length; i++) {
    psk += ('0' + randomBytes[i].toString(16)).slice(-2);
  }
  pskField.value = psk;
}

/**
 * Generate a QR code for the given channel name, PSK, and region.
 * The QR code contains a Meshtastic URL that can be used to configure a Meshtastic device.
 * @returns void
 */
async function generateQRCode(): Promise<void> {
  const channelName = (document.getElementById('channelName') as HTMLInputElement).value;
  const psk = (document.getElementById('psk') as HTMLInputElement).value;
  const region = (document.getElementById('region') as HTMLSelectElement).value;

  if (psk.length !== 32) {
    alert("PSK must be exactly 32 characters long.");
    return;
  }

  const loraConfig = new Protobuf.Config.Config_LoRaConfig({
    region: Protobuf.Config.Config_LoRaConfig_RegionCode[region as keyof typeof Protobuf.Config.Config_LoRaConfig_RegionCode]
  });

  const channel = new Protobuf.Channel.ChannelSettings({
    name: channelName,
    psk: new TextEncoder().encode(psk)
  });

  const channelSet = new Protobuf.AppOnly.ChannelSet({
    loraConfig,
    settings: [channel]
  });

  const encoded = channelSet.toBinary();
  const base64 = fromByteArray(encoded)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const meshtasticUrl = `https://meshtastic.org/e/#${base64}`;

  const urlField = document.getElementById('generatedUrl') as HTMLInputElement;
  urlField.value = meshtasticUrl;

  console.log("Generated Meshtastic URL:", meshtasticUrl);

  const qrCodeElement = document.getElementById('qrcode') as HTMLCanvasElement;
  qrCodeElement.innerHTML = "";  // Clear previous QR code
  try {
    await QRCode.toCanvas(qrCodeElement, meshtasticUrl);
    console.log('QR code generated successfully!');
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

/**
 * Copy the generated URL to the clipboard.
 * @returns void
 */
function copyUrlToClipboard(): void {
  const urlField = document.getElementById('generatedUrl') as HTMLInputElement;
  urlField.select();
  document.execCommand('copy');
  alert('URL copied to clipboard!');
}
