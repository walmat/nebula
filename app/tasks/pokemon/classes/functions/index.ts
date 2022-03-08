import { getCookie } from './datadome';
import { getSession } from './session';
import { getProduct, getProducts } from './product';
import { addToCart, clearCart } from './cart';
import { submitEmail } from './email';
import { submitInformation } from './information';
import { createEncryption } from './encrypt';
import { getKeyId, submitPayment } from './payment';
import { submitCheckout } from './checkout';
import { submitCaptcha } from './captcha';

export {
  getCookie,
  getSession,
  getProduct,
  getProducts,
  addToCart,
  submitEmail,
  submitInformation,
  clearCart,
  getKeyId,
  createEncryption,
  submitPayment,
  submitCheckout,
  submitCaptcha
};
