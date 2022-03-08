import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      width: '100%',
      margin: 35,
      marginTop: 85,
      display: 'flex',
      flexDirection: 'column'
    },
    grid: {
      height: '100%',
      width: `100%`
    },
    table: {
      height: `100%`,
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    },
    paper: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    toolbar: {
      paddingLeft: '64px',
      paddingRight: '32px'
    },
    title: {
      flex: '0 0 auto'
    },
    spacer: {
      flex: '1 1 100%'
    }
  };
};
