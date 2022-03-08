import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      margin: 35,
      marginTop: 75,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: 'calc(100% - 100px)'
    },
    row: {
      height: '100%'
    },
    grid: {
      margin: '10px 10px 10px 0',
      height: '30%'
    }
  };
};
