export type ResponseMock<Data> = {
  statusCode: number;
  headers: object;
  data?: Data;
  body?: Data;
};
