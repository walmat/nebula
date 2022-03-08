import { Platforms } from '../constants';

export const trimFat = task => {
  const newTask = task;
  switch (newTask.platform) {
    case Platforms.Shopify: {
      delete newTask.variation;
      delete newTask.category;
      delete newTask.quicktask;
      break;
    }
    default:
      break;
  }
  return newTask;
};
