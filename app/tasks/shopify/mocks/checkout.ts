import { ResponseMock } from './responseTypes';

export const checkout = (): Promise<ResponseMock<string>> => {
  return {
    statusCode: 302,
    headers: {
      location:
        'https://kith.com/942252/checkouts/00cedd8a0c1fda98b0e6ff320620e3e1'
    },
    data:
      '<html><body>You are being <a href="https://kith.com/942252/checkouts/00cedd8a0c1fda98b0e6ff320620e3e1">redirected</a>.</body></html>'
  };
};
