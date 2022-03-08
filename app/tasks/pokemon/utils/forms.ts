import formatter from 'phone-formatter';

export const information = (matches: boolean, shipping: any, billing: any) => {
  const {
    name: sName,
    country: sCountry,
    address: sAddress,
    city: sCity,
    phone: sPhone,
    province: sProvince,
    zip: sZip
  } = shipping;
  const {
    name: bName,
    country: bCountry,
    address: bAddress,
    city: bCity,
    phone: bPhone,
    province: bProvince,
    zip: bZip
  } = billing;

  const [sFirstName, sLastName] = sName.split(' ');
  const [bFirstName, bLastName] = bName.split(' ');

  if (matches) {
    return {
      billing: {
        familyName: sLastName,
        givenName: sFirstName,
        countryName: sCountry.value,
        locality: sCity,
        phoneNumber: formatter.format(sPhone, '(NNN) NNN-NNNN'),
        postalCode: sZip,
        region: sProvince ? sProvince.value : '',
        streetAddress: sAddress
      },
      shipping: {
        familyName: sLastName,
        givenName: sFirstName,
        countryName: sCountry.value,
        locality: sCity,
        phoneNumber: formatter.format(sPhone, '(NNN) NNN-NNNN'),
        postalCode: sZip,
        region: sProvince ? sProvince.value : '',
        streetAddress: sAddress
      }
    };
  }

  return {
    billing: {
      familyName: bLastName,
      givenName: bFirstName,
      countryName: bCountry.value,
      locality: bCity,
      phoneNumber: formatter.format(bPhone, '(NNN) NNN-NNNN'),
      postalCode: bZip,
      region: bProvince ? bProvince.value : '',
      streetAddress: bAddress
    },
    shipping: {
      familyName: sLastName,
      givenName: sFirstName,
      countryName: sCountry.value,
      locality: sCity,
      phoneNumber: formatter.format(sPhone, '(NNN) NNN-NNNN'),
      postalCode: sZip,
      region: sProvince ? sProvince.value : '',
      streetAddress: sAddress
    }
  };
};

export const email = ({ email }: any) => ({ email });
