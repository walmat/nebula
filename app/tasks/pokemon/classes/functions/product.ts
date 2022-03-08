import { Task } from '../../constants';

const { States } = Task;

export const getProduct = ({
  handler,
  url,
  sku
}: {
  handler: Function;
  url: string;
  sku: string;
}) => {
  return handler({
    endpoint: `/tpci-ecommweb-api/product/${sku}?format=zoom.nodatalinks`,
    options: {
      json: true,
      headers: {
        'content-type': 'application/json',
        referer: `${url}/product/${sku}`,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      }
    },
    message: 'Visiting product',
    from: States.GET_PRODUCT
  });
};

export const getProducts = ({ handler }: { handler: Function }) =>
  handler({
    endpoint: `/tpci-ecommweb-api/search?ref_url=&rows=100&start=0&url=www.pokemoncenter.com&fl=pid&search_type=keyword`,
    options: {
      json: true,
      headers: {
        pragma: 'no-cache',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      }
    },
    message: 'Visiting products',
    from: States.GET_PRODUCTS
  });
