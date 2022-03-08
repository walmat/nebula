export const customerInfo = (shipping: any, billing: any, rate: any) => {
  const {
    name: shippingName,
    address: shippingAddress,
    apt: shippingApt,
    city: shippingCity,
    province: shippingProvince,
    zip: shippingZip,
    phone: shippingPhone
  } = shipping;

  const {
    name: billingName,
    email,
    address: billingAddress,
    apt: billingApt,
    city: billingCity,
    province: billingProvince,
    zip: billingZip,
    phone: billingPhone
  } = billing;

  const { id, shipmentId } = rate;
  const [shippingFirstName, shippingLastName] = shippingName.split(' ');
  const [billingFirstName, billingLastName] = billingName.split(' ');

  return {
    customer: {
      email,
      receiveSmsUpdates: true
    },
    shippingAddress: {
      country: 'US',
      firstName: shippingFirstName,
      lastName: shippingLastName,
      address1: shippingAddress,
      address2: shippingApt,
      city: shippingCity,
      stateCode: shippingProvince.value,
      zipcode: shippingZip,
      phoneNumber: shippingPhone
    },
    billingAddress: {
      country: 'US',
      firstName: billingFirstName,
      lastName: billingLastName,
      address1: billingAddress,
      address2: billingApt,
      city: billingCity,
      stateCode: billingProvince.value,
      zipcode: billingZip,
      phoneNumber: billingPhone
    },
    methodList: [
      {
        id,
        shipmentId,
        collectionPeriod: '',
        deliveryPeriod: ''
      }
    ],
    newsletterSubscription: false
  };
};
