// main.ts

import { generateConfig } from './configHandler';
import { handlePSKTypeChange, handleGeneratePSK } from './pskHandler';
import { loadConfigurationFromHash } from './loadConfigurationFromHash';
import { copyUrlToClipboard } from './utils';

/**
 * Register the service worker in production mode.
 */
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/meshtastic-configurator/sw.js')
    .then(reg => {
      console.log('Service Worker registered!', reg);
    })
    .catch(err => {
      console.error('Service Worker registration failed:', err);
    });
}

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
