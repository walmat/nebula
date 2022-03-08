import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    loadingSpinner: {
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '50%',
      marginTop: '10%'
    },
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
    hide: {
      display: 'none'
    },
    row: {
      flexDirection: 'row'
    },
    text: {
      fontSize: 10,
      textAlign: 'center',
      color: theme.palette.primary.color,
      margin: 'auto 0',
      '& > *': {
        textAlign: 'center'
      }
    },
    addBtn: {
      height: 21,
      width: 21,
      backgroundColor: '#8E83F4',
      borderRadius: '50%',
      color: '#fff',
      fontSize: 10,
      '&:hover': {
        backgroundColor: 'rgba(142 ,131, 244, 0.555)'
      }
    },
    searchRoot: {
      border: `1px solid ${theme.palette.primary.border}`,
      backgroundColor: theme.palette.primary.background,
      boxShadow: 'none'
    },
    grid: {
      width: `100%`
    },
    statusWaiting: {
      backgroundColor: '#FFB15E',
      borderRadius: '50%',
      height: 8,
      width: 8,
      margin: '0 8px 0 0'
    },
    statusDelivered: {
      backgroundColor: '#58d67d',
      borderRadius: '50%',
      height: 8,
      width: 8,
      margin: '0 8px 0 0'
    },
    statusPill: {
      backgroundColor: '#FFB15E',
      borderRadius: 11,
      height: 17,
      width: 90,
      margin: '-5px 0 6px auto',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    store: {
      fontWeight: 700,
      fontSize: 10,
      margin: '0 0 4px 0'
    },
    ordered: {
      lineHeight: 1.43,
      fontWeight: 700,
      fontSize: 8,
      color: '#fff'
    },
    storeSubtext: {
      textTransform: 'capitalize',
      fontSize: 10
    },
    locationIcon: {
      margin: 'auto',
      height: 10,
      width: 10,
      marginRight: 4
    },
    locationText: {
      fontSize: 10
    },
    gridBottom: {
      overflowY: 'scroll',
      height: '100%',
      marginBottom: 8,
      '&::-webkit-scrollbar': {
        display: 'none !important'
      }
    },
    searchContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% - 32px)',
      height: '100%'
    },
    shipmentItem: {
      margin: '4px 16px',
      width: '100%',
      height: 45,
      display: 'flex'
    },
    flexBottom: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    firstCol: {
      display: 'inline-flex',
      flex: 1
    },
    flexFirst: {
      margin: 'auto 0'
    },
    adjustML: {
      marginLeft: '-15px !important'
    },
    flexEnd: {
      margin: 'auto auto 5px auto',
      display: 'flex',
      flexWrap: 'wrap'
    },
    bold: {
      fontWeight: 700,
      whiteSpace: 'pre'
    },
    colContainer: {
      justifyContent: 'center',
      textAlign: 'center'
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
