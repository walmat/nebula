import { YeezySupplyTask } from './base';

import { YeezySupplyContext } from '../../../common/contexts';

export const chooseYeezySupplyTask = () => {
  return (context: YeezySupplyContext) => new YeezySupplyTask(context);
};
