import { ResponseMock } from './responseTypes';

type Data = {
  id: string;
};
export const sessions = async (): Promise<ResponseMock<Data>> => {
  return {
    statusCode: 200,
    headers: {},
    body: {
      id: 'east-64ffa574062898a8bdb50f4461b575d5'
    }
  };
};
