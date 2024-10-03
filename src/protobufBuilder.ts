import { Protobuf } from "@meshtastic/js";

/**
 * Build a Protobuf message for a channel.
 * @param channelName - The name of the channel.
 * @param psk - The pre-shared key for the channel.
 * @param pskType - The type of pre-shared key.
 * @param region - The region for the channel.
 * @param modemPreset - The modem preset for the channel.
 * @param hopLimit - The hop limit for the channel.
 * @param uplinkEnabled - Whether uplink is enabled.
 * @param downlinkEnabled - Whether downlink is enabled.
 * @param positionPrecision - The position precision for the channel.
 * @param isClientMuted - Whether the client is muted.
 * @param ignoreMqtt - Whether to ignore MQTT.
 * @param configOkToMqtt - Whether the configuration is OK to MQTT.
 * @returns The Protobuf message for the channel.
 */
export function buildProtobuf({
  channelName,
  psk,
  pskType,
  region,
  modemPreset,
  hopLimit,
  uplinkEnabled,
  downlinkEnabled,
  positionPrecision,
  isClientMuted,
  ignoreMqtt,
  configOkToMqtt,
}: {
  channelName: string;
  psk: string;
  pskType: string;
  region: number;
  modemPreset: number;
  hopLimit: number;
  uplinkEnabled: boolean;
  downlinkEnabled: boolean;
  positionPrecision: number;
  isClientMuted: boolean;
  ignoreMqtt: boolean;
  configOkToMqtt: boolean;
}) {
  const loraConfig = new Protobuf.Config.Config_LoRaConfig({
    region: region || 5,
    usePreset: true,
    modemPreset: modemPreset || 0, // LONG_FAST as fallback
    hopLimit: hopLimit || 3,
    ignoreMqtt: ignoreMqtt || false,
    configOkToMqtt: configOkToMqtt || false,
  });

  const moduleSettings = new Protobuf.Channel.ModuleSettings({
    positionPrecision: positionPrecision || 0,
    isClientMuted: isClientMuted || false,
  });

  const channelSettings = new Protobuf.Channel.ChannelSettings({
    psk: pskType === 'none' ? new Uint8Array() : new TextEncoder().encode(psk),
    name: channelName,
    uplinkEnabled: uplinkEnabled || false,
    downlinkEnabled: downlinkEnabled || false,
    moduleSettings: moduleSettings
  });

  const channelSet = new Protobuf.AppOnly.ChannelSet({
    settings: [channelSettings],
    loraConfig,
  });

  console.log('Generated Protobuf message:', channelSet);

  return channelSet;
}
