// loadConfigurationFromHash.ts

import { Protobuf } from "@meshtastic/js";
import { populateForm } from './formHandler';
import { determinePskType } from "./pskHandler";
import { fromUrlSafeBase64 } from './utils';

/**
 * Load the configuration from the hash and populate the form.
 * @param {string} hash - The URL-safe Base64 configuration string.
 */
export function loadConfigurationFromHash(hash: string): void {
  try {
    const binaryData = fromUrlSafeBase64(hash);
    const channelSet = Protobuf.AppOnly.ChannelSet.fromBinary(binaryData);

    // Extract the channel settings from the Protobuf message
    const channelSettings = channelSet.settings[0];

    // Determine PSK type based on the length of the PSK
    const pskType = determinePskType(channelSettings.psk.length);

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
