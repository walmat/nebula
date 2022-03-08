import { imgsrc } from './imgsrc';

export const imageForCard = (type: string) => {
  switch (type) {
    case 'visa':
    case 'VISA':
      return imgsrc('visa.png', false);
    case 'mastercard':
    case 'MASTERCARD':
      return imgsrc('mastercard.png', false);
    case 'amex':
    case 'american-express':
    case 'AMEX':
      return imgsrc('american-express.png', false);
    case 'discover':
      return imgsrc('discover.png', false);
    default:
      return imgsrc('visa.png', false);
  }
};
