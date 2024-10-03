// formHandler.ts

/**
 * Get the values from the form using FormData API.
 */
export function getFormValues() {
  const form = document.getElementById('meshtasticForm') as HTMLFormElement | null;

  if (!form) {
    throw new Error('Form element not found.');
  }

  const formData = new FormData(form);

  // Extract form values and ensure the correct types
  const channelName = formData.get('channelName') as string;
  const psk = formData.get('psk') as string;

  // FormData returns strings, so we need to parse the necessary fields
  const region = Number(formData.get('region'));
  const modemPreset = Number(formData.get('modemPreset'));
  const hopLimit = Number(formData.get('hopLimit'));

  // Checkboxes return 'on' or undefined
  const uplinkEnabled = formData.get('uplinkEnabled') === 'on';
  const downlinkEnabled = formData.get('downlinkEnabled') === 'on';
  const positionPrecision = Number(formData.get('positionPrecision'));
  const isClientMuted = formData.get('isClientMuted') === 'on';
  const configOkToMqtt = formData.get('configOkToMqtt') === 'on';
  const ignoreMqtt = formData.get('ignoreMqtt') === 'on';

  return {
    channelName,
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

/**
 * Populate the form with values from the configuration.
 * @param formValues - The object containing values to populate the form.
 */
export function populateForm(formValues: any) {
  const form = document.getElementById('meshtasticForm') as HTMLFormElement | null;
  if (!form) throw new Error('Form element not found.');

  (form.elements.namedItem('channelName') as HTMLInputElement).value = formValues.channelName || '';
  (form.elements.namedItem('psk') as HTMLInputElement).value = formValues.psk || '';
  (form.elements.namedItem('uplinkEnabled') as HTMLInputElement).checked = formValues.uplinkEnabled || false;
  (form.elements.namedItem('downlinkEnabled') as HTMLInputElement).checked = formValues.downlinkEnabled || false;
  (form.elements.namedItem('positionPrecision') as HTMLInputElement).value = String(formValues.positionPrecision || 0);
  (form.elements.namedItem('isClientMuted') as HTMLInputElement).checked = formValues.isClientMuted || false;
  (form.elements.namedItem('region') as HTMLSelectElement).value = String(formValues.region || 0);
  (form.elements.namedItem('modemPreset') as HTMLSelectElement).value = String(formValues.modemPreset || 0);
  (form.elements.namedItem('hopLimit') as HTMLInputElement).value = String(formValues.hopLimit || 3);
  (form.elements.namedItem('ignoreMqtt') as HTMLInputElement).checked = formValues.ignoreMqtt || false;
  (form.elements.namedItem('configOkToMqtt') as HTMLInputElement).checked = formValues.configOkToMqtt || false;

  // Set the pskType based on the byte length of the psk (psk.length / 2)
  let pskType = 'none';  // Default to 'none'
  if (formValues.psk && formValues.psk.length === 64) {
    pskType = 'aes256';  // AES-256
  } else if (formValues.psk && formValues.psk.length === 32) {
    pskType = 'aes128';  // AES-128
  }

  // Update the pskType dropdown
  (form.elements.namedItem('pskType') as HTMLSelectElement).value = pskType;
}
