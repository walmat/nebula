import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    gridItem: {
      height: '100%'
    },
    root: {
      backgroundColor: theme.palette.primary.secondary,
      color: theme.palette.primary.color,
      height: '100%',
      marginLeft: 10,
      flexGrow: 1,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      borderRadius: 8,
      transition: theme.transitions.create(['background-color'], {
        duration: 300
      })
    },
    row: {
      flexDirection: 'row'
    },
    date: {
      fontWeight: 700,
      fontSize: 12,
      display: 'inline-flex'
    },
    messageBuffer: {
      fontWeight: 500,
      fontSize: 12,
      display: 'inline',
      fontStyle: 'italic'
    },
    message: {
      fontWeight: 500,
      fontSize: 12,
      display: 'inline',
      wordWrap: 'break-word',
      overflowWrap: 'break-word'
    },
    flexFirst: {
      // margin: 'auto 0'
    },
    newsItem: {
      margin: '4px 16px',
      width: 'calc(100% - 32px)',
      height: 'auto',
      display: 'flex'
    },
    grid: {
      width: `100%`
    },
    gridBottom: {
      overflowY: 'scroll',
      flexWrap: 'nowrap',
      height: '100%',
      display: 'flex',
      margin: '8px 0',
      flexDirection: 'column',
      '&::-webkit-scrollbar': {
        display: 'none !important'
      }
    },
    status: {
      height: 8,
      width: 8,
      margin: '0 8px 0 0',
      display: 'inline-flex',
      borderRadius: '50%'
    },
    bold: {
      fontWeight: 700,
      whiteSpace: 'pre'
    },
    colContainer: {
      justifyContent: 'center',
      textAlign: 'center'
    },
    firstCol: {
      display: 'inline-flex',
      flex: 1
    },
    header: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      marginTop: '8px',
      marginLeft: '8px',
      fontWeight: 500,
      fontSize: '16px'
    },
    welcome: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      marginTop: '8px'
    }
  };
};
