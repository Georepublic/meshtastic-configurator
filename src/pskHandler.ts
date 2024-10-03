// pskHandler.ts

import { generateConfig } from './configHandler';

/**
 * Generate a PSK (Pre-Shared Key) for the given PSK type.
 * @param pskType
 * @returns
 */
export function generatePSK(pskType: string): string {
  const pskBytes = new Uint8Array(getPskLengthFromType(pskType));

  if (pskBytes.length === 0) {
    return '';  // No encryption
  }

  window.crypto.getRandomValues(pskBytes);
  return Array.from(pskBytes).map(b => ('0' + b.toString(16)).slice(-2)).join('');
}

/**
 * Handle the change event on the PSK type select element.
 * Enable or disable the PSK input field based on the selected PSK type.
 */
export function handlePSKTypeChange(): void {
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
export function handleGeneratePSK(): void {
  const pskType = (document.getElementById('pskType') as HTMLSelectElement).value;
  const psk = generatePSK(pskType);
  (document.getElementById('psk') as HTMLInputElement).value = psk;

  // Re-generate config when PSK is generated
  generateConfig();
}

/**
 * Determine the PSK type based on the PSK length.
 * @param pskLength - The length of the PSK string.
 * @returns {string} - 'none', 'aes128', or 'aes256'
 */
export function determinePskType(pskLength: number): string {
  if (pskLength === 32) {  // AES-128 (16 bytes * 2 hex chars per byte)
    return 'aes128';
  } else if (pskLength === 64) {  // AES-256 (32 bytes * 2 hex chars per byte)
    return 'aes256';
  } else {
    return 'none';
  }
}

/**
 * Get the PSK byte length based on the PSK type.
 * @param {string} pskType - 'none', 'aes128', or 'aes256'
 * @returns {number} - The expected byte length for the PSK
 */
export function getPskLengthFromType(pskType: string): number {
  if (pskType === 'aes128') {
    return 16;  // AES-128: 16 bytes
  } else if (pskType === 'aes256') {
    return 32;  // AES-256: 32 bytes
  } else {
    return 0;  // No encryption
  }
}
