import { mixins } from '../../../styles/js';

export const styles = () => {
  return {
    root: {
      width: `calc(100% - 110px)`,
      height: 32,
      position: `fixed`,
      zIndex: 999,
      ...mixins().appDragEnable
    }
  };
};
