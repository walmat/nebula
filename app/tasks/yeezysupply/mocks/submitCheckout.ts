export const submitCheckout = {
  creationDate: '2019-12-14T15:09:09.740Z',
  currency: 'USD',
  exported: false,
  orderId: null,
  paymentStatus: 'not_paid',
  pricing: {
    total: 242.05,
    baseTotal: 225,
    totalTax: 17.05,
    productTotal: 220,
    productTotalBeforeDiscounts: 220,
    productTotalBeforeOrderDiscounts: 220,
    shippingTotal: 5,
    shippingBaseTotal: 5
  },
  resourceState:
    'fda67fa12dd330ef5511886e67dbd92183c8937bf9126f49c061857429cf677d',
  status: 'new',
  taxationPolicy: 'net',
  npsSurveyURL:
    'https://survey.medallia.eu/?adidas-ecom&tr=5&lng=en&u=com&g1=M&c1=root&t1=Lifestyle',
  taxCalculationMissing: false,
  orderToken:
    'OaTFSvYsLak79PcdUZWJec2+4OR7hFIVpIU3U3218TMh/C3EOrv5iE5XAlQD3YN2Ww9NFYV5/v8FSPLGXsyKignAQg6WxWXmfi2+qZ+uewjs5WHMgw/ibvPIiFdbuTy+',
  paymentInstrumentList: [
    {
      amount: 242.05,
      id: 'da05d0a28abeee05df43636863',
      paymentMethodId: 'CREDIT_CARD',
      cardType: 'VISA',
      expirationMonth: 12,
      expirationYear: 2025,
      holder: 'Arbab Khalid',
      lastFour: '9848'
    }
  ],
  shipmentList: [
    {
      shipmentId: 'me',
      shipmentType: 'inline',
      productLineItemList: [
        {
          itemId: '0290e3f9c6f2b732684334b89e',
          productId: 'FW5191_570',
          productName: 'YEEZY BOOST 350 V2',
          canonicalProductName: 'yeezy-boost-350-v2',
          productImage:
            'https://assets.yeezysupply.com/images/w_280,h_280,f_auto,q_auto:sensitive/426f2751dcb340e1a659ab120167988e_ce49/FW5191_570_FW5191_04_standard.png.jpg',
          quantity: 1,
          pricing: {
            baseUnitPrice: 220,
            unitPrice: 220,
            basePrice: 220,
            price: 220,
            priceAfterAllDiscounts: 220,
            unitPriceWithoutTax: 220
          },
          gender: 'M',
          color: 'YEEZREEL',
          size: '6',
          allowedActions: '',
          maxQuantityAllowed: 10,
          isBonusProduct: false,
          productType: 'INLINE',
          editLinkCustomizableProduct: '',
          availableStock: 15,
          isFlashProduct: true
        }
      ],
      shippingLineItem: {
        name: 'Shipping',
        description: '3-5 Day Delivery',
        id: '2ndDay-1',
        pricing: {
          basePrice: 5,
          price: 5
        },
        carrierServiceName: 'UPS'
      }
    }
  ],
  customer: {
    customerId: 'adOWOOUa2iqyFgHms7Wn45LNbH',
    name: 'Arbab Khalid',
    email: 'azeem.majid2@gmail.com',
    encryptedEmail: 'OaTFSvYsLak79PcdUZWJeakUzZ4CI6i8dNR2sMsPVGM=',
    customerEUCI: 'Y3O1KP456M0DV56C',
    receiveSmsUpdates: false,
    isLoggedIn: false
  },
  shippingAddress: {
    address1: '19052 Oceanport Lane',
    address2: 'Unit 3',
    city: 'Huntington Beach',
    country: 'US',
    firstName: 'Arbab',
    id: '1d35d66fdbb46f6ea6ecb7e1b1',
    lastName: 'Khalid',
    phoneNumber: '7023743355',
    zipcode: '92648',
    stateCode: 'CA',
    useAsBillingAddress: true
  },
  customerOrderHistoryStatus: 3
};

export const three3dsResponse = {
  orderId: 'YS123456789',
  resourceState:
    'c409ab15775141b245159d741731b80e8ee962ed98418190093ce2ba9d3d82b7',
  paymentStatus: 'not_paid',
  status: 'created',
  authorizationType: '3ds',
  paRedirectForm: {
    formMethod: 'POST',
    formAction:
      'https://idcheck.acs.touchtechpayments.com/v1/payerAuthentication',
    formFields: {
      PaReq:
        'eNpVUstuwjAQ/JWID4gfxA6OFku0VCpSCWnh0qOx3ZIKkpBHBXx9bRJKa192Ztdj76xhs6utna+t7morYWmbRn3aIDfTURLFlBMxjoWgJOZCjCRkszd7lPBt6yYvC0lCHFJAN+iO13qnilaC0seHRSoZ5YzHgAYIB1sv5gOLMaYRiYgA1NNQqIOVyuRGNUFW7lVhgnUVXsLSbUDXLOiyK9r6LDnhgG4Aunovd21bNQlCvUBY7QF5GtD9VVnno8bJnHIj07k+p19PbHnRbLVZnNLLO1u9zvyaAvIVYFRrJcWU4IiygIgkYgklgK48qIO/X2YvaTAWIsTYNdpTUPmbZj1wOZ/6S4Gzu7aFPksxYa6PGwJ7qsrCugpn628M6P7wx2dvrm6dXxE3nEbMfGz1RFgyIXSrMDE0xmrrLb8WecXcWUQZ6SU9AORl0DBNNEzdRf9+ww+1q63e',
      EncodedData:
        '2ad0dcb537b05d6bf87709e2bac0ea67e59d0d3009362ace8450151eacb8d0eaf6e52fce097eda823172a78dd3e08813c8610d46e7d605d8e49a44ee1cc048b8c732a9607363a06f939677742f2425c32aedbbd18137d06d673cb07fca72bfb3b8480c9788f43e337a369e3311427c2080c7b7371ab6b2c1f3c481232ae1f7ba06ce823c26a0c6464f464edf3d7430fb',
      MD:
        'TnZIZVZSWGFlUnJnK3Uyelo2Zlk3UT09IQCRxuj_b5jvKCuXCoinU8gB_isYZ9WcxxjJeJnyv_VFjjl8xwc9wd1BZ9X95tQ_-8boLZh-S8yqt-vz5piVQodJGrCJHzMVLgCI1O69p2tTyv2rQDjY9iuqm7T8rkILFQNA1lqCyaoeWxEqefJGf30P5mkF1qGj7SLa-s_FVAM7ILc8ZMqa1iAanw-NL1flmh5Rln3NU0DLp1S0KZe3wgXOPgfVJ-XlUpa3UMS9DMcuKz4PiWuzDSgvSHE6RNccM1vD8DCurgN_ntcc8OucKSC6HDeF0ePDrKm_URu1zFjfYjODrenFUjZIW8ZY31G_zOmb715C4oavwVdcfrDfy7x3TixmFtZ6UP17IEw0jFMq_NrxJ0fVsPfRNSJHTTGghc-wH8Wv-SWm6PYTsNhbVXBO_t6dcN3xjwKTk6_xdaL_arugsteyUjjpnwT7kiKH-xpUPr48l05rnDo1Nl6CAomaZ0nefIp5oU33xUPNHURFhNno_im3kVWF4eFtOFGHJreHYSTIknE-u_T3FIEeoWAjJdNJjdCWoCEnv36XdUsm'
    }
  }
};
