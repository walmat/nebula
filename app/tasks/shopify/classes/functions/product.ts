import {
  Task as TaskConstants,
  Monitor as MonitorConstants
} from '../../constants';

const { States: TaskStates } = TaskConstants;
const { States: MonitorStates } = MonitorConstants;

const getRandomNumber = (digit: number) =>
  Math.random().toFixed(digit).split('.')[1];

export const getPreloadProduct = ({ handler }: { handler: Function }) => {
  return handler({
    endpoint: `/products.json?limit=250&order=${getRandomNumber(7)}`,
    options: {
      json: true
    },
    timeout: 12500,
    from: TaskStates.GET_PRODUCT,
    message: 'Preloading product'
  });
};

export const getProducts = ({
  handler,
  message
}: {
  handler: Function;
  message: string;
}) => {
  return handler({
    endpoint: `/products.json?limit=100&order=${getRandomNumber(7)}`,
    options: {
      json: true
    },
    timeout: 12500,
    from: MonitorStates.GET_PRODUCTS,
    message
  });
};

export const getProduct = ({
  handler,
  message,
  url
}: {
  handler: Function;
  message: string;
  url: string;
}) => {
  const [endpoint] = url.split('?');

  return handler({
    endpoint: `${endpoint}?order=${getRandomNumber(7)}`,
    from: MonitorStates.GET_PRODUCT,
    timeout: 12500,
    message
  });
};

export const getDetails = ({
  handler,
  url,
  message
}: {
  handler: Function;
  url: string;
  message: string;
}) => {
  const [base] = url.split('?');
  const endpoint = `${base}?format=js`;

  return handler({
    endpoint,
    from: MonitorStates.GET_PRODUCT,
    options: {
      json: true
    },
    timeout: 12500,
    message
  });
};

export const getProductUrl = ({
  handler,
  url
}: {
  handler: Function;
  url: string;
}) => {
  const [endpoint] = url.split('?');

  return handler({
    endpoint,
    from: MonitorStates.GET_PRODUCT,
    timeout: 12500,
    message: 'Parsing product'
  });
};
