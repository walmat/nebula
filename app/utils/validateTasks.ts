import * as yup from 'yup';
import { Platforms } from '../tasks/common/constants';

const taskShopifyValidationSchema = yup.object({
  store: yup.string().required('Store is required'),
  profile: yup.string().required('Profile is required'),
  sizes: yup.string().required('Sizes are required'),
  product: yup.object({
    raw: yup.string().required('Product is required')
  }),
  mode: yup.string().required('Mode is required')
});

const taskYeezSupplyValidationSchema = yup.object({
  store: yup.string().required('Store is required'),
  profile: yup.string().required('Profile is required'),
  sizes: yup.string().required('Sizes are required'),
  product: yup.object({
    raw: yup.string().required('Product is required')
  }),
  mode: yup.string().required('Mode is required')
});

export const getValidationSchemaTask = (platform: string) => {
  const PLATFORM_VALIDATIONS = {
    [Platforms.Shopify]: taskShopifyValidationSchema,
    [Platforms.YeezySupply]: taskYeezSupplyValidationSchema
  };

  if (platform in PLATFORM_VALIDATIONS) {
    return PLATFORM_VALIDATIONS[platform];
  }

  return null;
};

export const validateTaskShopify = (task: any) => {
  if (
    !task ||
    !task?.store ||
    !task?.profile ||
    !task?.sizes ||
    !task?.product?.raw ||
    !task?.mode
  ) {
    return false;
  }

  return true;
};

export const validateTaskYeezSupply = (task: any) => {
  if (
    !task ||
    !task?.store ||
    !task?.profile ||
    !task?.sizes ||
    !task?.product?.raw ||
    !task?.mode
  ) {
    return false;
  }

  return true;
};

export const validateTask = (task: any) => {
  const PLATFORM_VALIDATIONS = {
    [Platforms.Shopify]: validateTaskShopify,
    [Platforms.YeezySupply]: validateTaskYeezSupply
  };

  const { platform } = task;
  if (platform in PLATFORM_VALIDATIONS) {
    const validateFn = PLATFORM_VALIDATIONS[platform];

    return validateFn(task);
  }

  return false;
};
