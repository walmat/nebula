import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    container: {
      maxHeight: '100%'
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
    table: {
      display: 'table',
      tableLayout: 'fixed',
      width: '100%'
    },
    tableRow: {
      display: 'table-row'
    },
    margin: {
      width: '100%',
      height: 24,
      display: 'flex'
    },
    gridTop: {
      marginBottom: 8
    },
    gridBottom: {
      overflowY: 'scroll',
      height: '100%',
      marginBottom: 8,
      '&::-webkit-scrollbar': {
        display: 'none !important'
      }
    },
    grid: {
      width: `100%`
    },
    store: {
      display: 'table-cell',
      whiteSpace: 'nowrap',
      alignSelf: 'center',
      fontSize: 10,
      margin: 'auto 8px auto 16px',
      width: '20%',
      overflow: 'hidden'
    },
    product: {
      display: 'table-cell',
      whiteSpace: 'nowrap',
      alignSelf: 'center',
      fontSize: 10,
      margin: 'auto 8px',
      width: '100%',
      overflow: 'hidden'
    },
    card: {
      display: 'table-cell',
      alignSelf: 'center',
      fontSize: 10,
      margin: 'auto 8px'
    },
    icon: {
      background: '#FFEDDC',
      width: 40,
      height: 40,
      borderRadius: '50%',
      margin: '16px 8px 0 8px'
    },
    iconSvg: {
      display: 'block',
      margin: 'auto',
      marginTop: 8,
      color: '#FFB15E'
    },
    bold: {
      fontWeight: 700,
      whiteSpace: 'pre'
    },
    welcome: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      marginTop: '8px'
    }
  };
};
