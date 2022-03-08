// import { CoreOptions, Request } from 'request';
// import { debugConsole } from '../../test/debug';

// const requestPromise = jest.requireActual('request-promise');

// const mockRequest = async (
//   uri: string,
//   options: CoreOptions
// ): Promise<Request> => {
//   // eslint-disable-next-line
//   debugConsole({
//     mockRequest: true,
//     uri,
//     method: options.method,
//     headers: options.headers,
//     json: options.json,
//     body: options.body
//   });

//   return requestPromise(uri, options);
// };

// const mockJar = () => {
//   return {
//     setCookie: jest.fn(),
//     getCookiesString: jest.fn(() => 'cookies'),
//     getCookies: jest.fn(() => [])
//   };
// };

// const request = jest.fn(mockRequest);
// request.jar = jest.fn(mockJar);

// const mockResponseOnce = fn => request.mockImplementationOnce(fn);

// request.mockResponseOnce = mockResponseOnce;
// request.jar.mockJarOnce = fn => request.jar.mockImplementation(fn);

// export default request;
