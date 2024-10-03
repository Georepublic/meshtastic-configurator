// utils.ts

import { fromByteArray, toByteArray } from "base64-js";

/**
 * Utility function to calculate the byte length of a string.
 * This function uses the TextEncoder API to encode the string as UTF-8 and count the bytes.
 * @param {string} str - The input string.
 * @returns {number} - The byte length of the string.
 */
export function getByteLength(str: string): number {
  return new TextEncoder().encode(str).length;
}

/**
 * Convert binary data to a URL-safe Base64 string.
 * @param binaryData - The binary data to encode.
 * @returns URL-safe Base64 string
 */
export function toUrlSafeBase64(binaryData: Uint8Array): string {
  return fromByteArray(binaryData)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Convert a URL-safe Base64 string back to binary data.
 * @param base64String - The URL-safe Base64 string to decode.
 * @returns {Uint8Array} - The decoded binary data.
 */
export function fromUrlSafeBase64(base64String: string): Uint8Array {
  // Replace URL-safe characters with standard Base64 characters
  const paddedBase64 = base64String
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    // Re-add padding if necessary (Base64 strings must be divisible by 4)
    .padEnd(base64String.length + (4 - (base64String.length % 4)) % 4, "=");

  return toByteArray(paddedBase64);
}

/**
 * Copy the generated URL to the clipboard.
 * @returns void
 */
export function copyUrlToClipboard(): void {
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
export function showCopyNotification(): void {
  const notification = document.getElementById('copyNotification');

  if (notification) {
    notification.classList.add('show');

    // Hide the notification after 2 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }
}
