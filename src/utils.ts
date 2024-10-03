import { fromByteArray } from "base64-js";

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
 * Generate a random Channel ID.
 * @returns
 */
export function generateChannelId(): string {
  return Math.floor(Math.random() * 0xFFFFFFFF).toString(16).toUpperCase();
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
