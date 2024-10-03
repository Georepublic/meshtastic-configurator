import { generateChannelId } from "./utils";

/**
 * Get the values from the form using FormData API.
 */
export function getFormValues() {
  const form = document.getElementById('meshtasticForm') as HTMLFormElement | null;

  if (!form) {
    throw new Error('Form element not found.');
  }

  const formData = new FormData(form);  // Pass the form to FormData

  // Extract form values and ensure the correct types
  const channelName = formData.get('channelName') as string;
  const pskType = formData.get('pskType') as string;
  const psk = formData.get('psk') as string;

  // FormData returns strings, so we need to parse the necessary fields
  const region = Number(formData.get('region'));
  const modemPreset = Number(formData.get('modemPreset'));
  const hopLimit = Number(formData.get('hopLimit'));

  const uplinkEnabled = formData.get('uplinkEnabled') === 'on';  // Checkbox returns 'on' or undefined
  const downlinkEnabled = formData.get('downlinkEnabled') === 'on';
  const positionPrecision = Number(formData.get('positionPrecision'));
  const isClientMuted = formData.get('isClientMuted') === 'on';

  const configOkToMqtt = formData.get('configOkToMqtt') === 'on';
  const ignoreMqtt = formData.get('ignoreMqtt') === 'on';

  return {
    channelName,
    pskType,
    psk,
    region,
    modemPreset,
    hopLimit,
    uplinkEnabled,
    downlinkEnabled,
    positionPrecision,
    isClientMuted,
    configOkToMqtt,
    ignoreMqtt,
  };
}
