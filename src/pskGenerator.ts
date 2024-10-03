// pskGenerator.ts

/**
 * Generate a PSK (Pre-Shared Key) for the given PSK type.
 * @param pskType
 * @returns
 */
export function generatePSK(pskType: string): string {
  let pskBytes: Uint8Array;

  if (pskType === 'aes128') {
    pskBytes = new Uint8Array(16);
  } else if (pskType === 'aes256') {
    pskBytes = new Uint8Array(32);
  } else {
    return ''; // No encryption
  }

  window.crypto.getRandomValues(pskBytes);
  return Array.from(pskBytes).map(b => ('0' + b.toString(16)).slice(-2)).join('');
}
