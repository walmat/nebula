import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    container: {
      maxHeight: '100%'
    },
    cardType: {
      filter: `contrast(${theme.palette.primary.contrast})`
    },
    root: {
      backgroundColor: theme.palette.primary.secondary,
      color: theme.palette.primary.color,
      height: '100%',
      margin: '0 10px',
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
      height: '100%',
      overflowY: 'scroll',
      marginBottom: 8,
      '&::-webkit-scrollbar': {
        display: 'none !important'
      }
    },
    paperRoot: {
      backgroundColor: theme.palette.primary.background,
      color: theme.palette.primary.color
    },
    confirmBtn: {
      width: 105,
      height: 35,
      background:
        'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
      color: '#fff'
    },
    cancelBtn: {
      width: 105,
      height: 35,
      background: theme.palette.primary.secondary,
      color: theme.palette.primary.color,
      '&:hover': {
        opacity: 0.5,
        background: theme.palette.primary.secondary,
        color: theme.palette.primary.color
      }
    },
    activeIcon: {
      color: '#4BB543 !important',
      transition: theme.transitions.create(['color'], {
        duration: 300
      }),
      '&:hover': {
        opacity: 0.5,
        transition: theme.transitions.create(['color'], {
          duration: 300
        }),
        color: '#B33A3A !important'
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
      background: '#EEEDFC',
      width: 40,
      height: 40,
      borderRadius: '50%',
      margin: '16px 8px 0 8px'
    },
    iconSvg: {
      display: 'block',
      margin: 'auto',
      marginTop: 8,
      color: '#8377F4',
      cursor: 'pointer'
    },
    bold: {
      fontWeight: 700,
      whiteSpace: 'pre'
    },
    welcome: {
      color: theme.palette.primary.color,
      display: 'flex',
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      marginTop: '8px'
    }
  };
};
