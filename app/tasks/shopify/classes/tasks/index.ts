import { ShopifyContext } from '../../../common/contexts';

import { SafeTask } from './safe';
import { PreloadTask } from './preload';
import { FastTask } from './fast';
import { PfutileTask } from './pfutile';

import { Task as TaskConstants } from '../../constants';

const { Modes } = TaskConstants;

export const chooseShopifyTask = (type: string) => {
  switch (type) {
    case Modes.RESTOCK:
      return (context: ShopifyContext) => new FastTask(context);
    case Modes.FAST:
      return (context: ShopifyContext) => new FastTask(context);
    case Modes.PRELOAD:
      return (context: ShopifyContext) => new PreloadTask(context);
    case Modes.PFUTILE:
      return (context: ShopifyContext) => new PfutileTask(context);
    case Modes.SAFE:
      return (context: ShopifyContext) => new SafeTask(context);
    default:
      return (context: ShopifyContext) => new SafeTask(context);
  }
};
