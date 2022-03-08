export const cleanseHeaderData = (headers: any) => {
  const cleansedHeaders = { ...headers };

  const excludedHeaders = [
    'content-type',
    'accept-ranges',
    'date',
    'content-encoding',
    'access-control-allow-origin',
    'access-control-allow-credentials',
    'dnt',
    'expires',
    'origin',
    'sec-ch-ua',
    'sec-ch-ua-mobile',
    'sec-fetch-dest',
    'sec-fetch-mode',
    'sec-fetch-site',
    'strict-transport-security',
    'set-cookie',
    'x-csrf-token'
  ];

  excludedHeaders.forEach(
    (headerName: string) => delete cleansedHeaders[headerName]
  );

  return cleansedHeaders;
};
