import { Task } from '../../constants';

const { States } = Task;

export const addToCart = ({
  handler,
  quantity,
  atcUri
}: {
  handler: Function;
  quantity: string;
  atcUri: string;
}) =>
  handler({
    endpoint: `/tpci-ecommweb-api/cart?type=product&format=nodatalinks`,
    options: {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      json: {
        productURI: atcUri,
        quantity: quantity || 1,
        configuration: {}
      }
    },
    message: 'Adding to cart',
    from: States.ADD_TO_CART
  });

export const clearCart = ({
  handler,
  cartUri
}: {
  handler: Function;
  cartUri: string;
}) =>
  handler({
    endpoint: `/tpci-ecommweb-api/cart?type=product&format=zoom.nodatalinks`,
    options: {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        referer: 'https://www.pokemoncenter.com/cart',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin'
      },
      json: {
        productURI: cartUri,
        quantity: 0
      }
    },
    message: 'Clearing cart',
    from: States.CLEAR_CART
  });
