import { L } from '../../../i18next';

// required rule
export const required = { required: true, message: L('ThisFieldIsRequired') };

// not required rule
export const notRequired = { required: false};

// organizer Website links validation
export const websiteLinkValidation = [
  {
    required: true,
    pattern: /^((ftp|http|https):\/\/)?(www\.)?([A-z]+)\.([A-z]{2,})/,
    message: L('PleaseEnterValidUrl'),
  },
];
