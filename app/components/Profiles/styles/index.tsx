import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      margin: 25,
      marginTop: 75,
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignContent: 'flex-start',
      width: '100%',
      height: 'calc(100% - 100px)',
      overflow: 'scroll',
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }
  };
};
