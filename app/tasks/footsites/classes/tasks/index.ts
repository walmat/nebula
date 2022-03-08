import { BaseFootsiteTask } from './base';

import { FootsiteContext } from '../../../common/contexts';

export const chooseFootsiteTask = () => {
  return (context: FootsiteContext) => new BaseFootsiteTask(context);
};
