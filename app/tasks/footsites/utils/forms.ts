import uuid from 'uuid';

export const customerInfoEU = (
  shipping: any,
  billing: any,
  payerId = uuid(),
  nonce = uuid()
) => {
  const {
    name: sName,
    address: sAddress,
    apt: sApt,
    city: sCity,
    zip: sZip,
    country: { value: sCountry }
  } = shipping;
  const {
    name: bName,
    email,
    address: bAddress,
    apt: bApt,
    city: bCity,
    zip: bZip,
    phone,
    country: { value: bCountry }
  } = billing;

  const holderParts = bName.split(' ');

  const [bFirstName] = holderParts;
  const bLastName = holderParts[holderParts.length - 1];

  const checkoutType = 'CREDIT_CARD';
  const type = 'CreditCard';

  return {
    checkoutType,
    nonce,
    details: {
      email,
      firstName: bFirstName,
      lastName: bLastName,
      payerId,
      shippingAddress: {
        recipientName: sName,
        line1: sAddress,
        line2: sApt,
        extendedAddress: sApt,
        streetAddress: sApt,
        city: sCity,
        postalCode: sZip,
        countryCode: sCountry,
        countryCodeAlpha2: sCountry,
        locality: sCity
      },
      phone,
      countryCode: sCountry,
      billingAddress: {
        recipientName: bName,
        line1: bAddress,
        line2: bApt,
        extendedAddress: bApt,
        streetAddress: bApt,
        city: bCity,
        postalCode: bZip,
        countryCode: bCountry,
        countryCodeAlpha2: bCountry,
        locality: bCity
      }
    },
    type
  };
};

export const customerInfo = (
  shipping: any,
  billing: any,
  payerId = uuid(),
  nonce = uuid()
) => {
  const {
    name: sName,
    address: sAddress,
    apt: sApt,
    city: sCity,
    province: sProvince,
    zip: sZip,
    country: { value: sCountry }
  } = shipping;
  const {
    name: bName,
    email,
    address: bAddress,
    apt: bApt,
    city: bCity,
    province: bProvince,
    zip: bZip,
    phone,
    country: { value: bCountry }
  } = billing;
  const holderParts = bName.split(' ');

  const [bFirstName] = holderParts;
  const bLastName = holderParts[holderParts.length - 1];

  const checkoutType = 'CREDIT_CARD';
  const type = 'CreditCard';

  return {
    checkoutType,
    nonce,
    details: {
      email,
      firstName: bFirstName,
      lastName: bLastName,
      payerId,
      shippingAddress: {
        recipientName: sName,
        line1: sAddress,
        line2: sApt,
        extendedAddress: sApt,
        streetAddress: sApt,
        city: sCity,
        state: sProvince?.value || '',
        postalCode: sZip,
        countryCode: sCountry,
        countryCodeAlpha2: sCountry,
        locality: sCity,
        region: sProvince?.value || ''
      },
      phone,
      countryCode: sCountry,
      billingAddress: {
        recipientName: bName,
        line1: bAddress,
        line2: bApt,
        extendedAddress: bApt,
        streetAddress: bApt,
        city: bCity,
        state: bProvince?.value || '',
        postalCode: bZip,
        countryCode: bCountry,
        countryCodeAlpha2: bCountry,
        locality: bCity,
        region: bProvince?.value || ''
      }
    },
    type
  };
};

export const shippingInfoEU = (shipping: any) => {
  const { name, address, apt, phone, city, zip, country, province } = shipping;

  const shippingName = name.split(' ');
  const [firstName] = shippingName;
  const lastName = shippingName[shippingName.length - 1];

  const base: any = {
    shippingAddress: {
      setAsDefaultBilling: false,
      setAsDefaultShipping: false,
      firstName,
      lastName,
      email: false,
      phone,
      country: {
        isocode: country.value,
        name: country.label
      },
      id: null,
      setAsBilling: true,
      saveInAddressBook: false,
      type: 'default',
      LoqateSearch: '',
      town: city,
      line1: address,
      line2: apt,
      postalCode: zip,
      shippingAddress: true
    }
  };

  if (province) {
    base.shippingAddress.region = {
      countryIso: country.value,
      isocode: `${country.value}-${province.value}`,
      isocodeShort: province.value,
      name: province.label
    };
  }

  return base;
};

export const shippingInfo = (shipping: any) => {
  const { name, address, apt, phone, city, zip, country, province } = shipping;

  const shippingName = name.split(' ');
  const [firstName] = shippingName;
  const lastName = shippingName[shippingName.length - 1];

  const base: any = {
    shippingAddress: {
      line1: address,
      phone,
      firstName,
      country: {
        isocode: country.value,
        name: country.label
      },
      isFPO: false,
      line2: apt,
      town: city,
      postalCode: zip,
      lastName
    }
  };

  if (province) {
    base.shippingAddress.region = {
      countryIso: country.value,
      isocode: `${country.value}-${province.value}`,
      isocodeShort: province.value,
      name: province.label
    };
  }

  return base;
};

export const billingInfoEU = (billing: any) => {
  const { name, address, apt, phone, city, zip, country } = billing;

  const billingName = name.split(' ');
  const [firstName] = billingName;
  const lastName = billingName[billingName.length - 1];

  return {
    setAsDefaultBilling: false,
    setAsDefaultShipping: false,
    firstName,
    lastName,
    email: false,
    phone,
    country: {
      isocode: country.value,
      name: country.label
    },
    id: null,
    setAsBilling: false,
    saveInAddressBook: false,
    type: 'default',
    LoqateSearch: '',
    town: city,
    line1: address,
    line2: apt,
    postalCode: zip,
    shippingAddress: true
  };
};

export const billingInfo = (billing: any) => {
  const { name, address, apt, phone, city, zip, country, province } = billing;

  const billingName = name.split(' ');
  const [firstName] = billingName;
  const lastName = billingName[billingName.length - 1];

  const base: any = {
    setAsDefaultBilling: false,
    setAsDefaultShipping: false,
    postalCode: zip,
    email: false,
    line2: apt,
    shippingAddress: true,
    firstName,
    defaultAddress: false,
    id: null,
    billingAddress: false,
    line1: address,
    lastName,
    phone,
    visibleInAddressBook: false,
    isFPO: false,
    formattedAddress: `${address}, ${apt}, ${city}, ${zip}`,
    setAsBilling: false,
    town: city,
    country: {
      isocode: country.value,
      name: country.label
    }
  };

  if (province) {
    base.formattedAddress = `${address}, ${apt}, ${province.value}, ${city}, ${zip}`;
    base.region = {
      countryIso: country.value,
      isocode: `${country.value}-${province.value}`,
      isocodeShort: province.value,
      name: province.label
    };
  }

  return base;
};
