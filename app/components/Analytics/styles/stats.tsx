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
      marginRight: 10,
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
    dropdownIcon: {
      color: theme.palette.primary.color,
      fontSize: 16,
      marginTop: 4
    },
    menuList: {
      fontSize: 10,
      padding: 0,
      backgroundColor: theme.palette.primary.background,
      color: theme.palette.primary.color
    },
    row: {
      flexDirection: 'row'
    },
    grid: {
      width: `100%`
    },
    menuItem: {
      padding: '4px 8px',
      fontSize: 10,
      textAlign: 'center'
    },
    bold: {
      fontWeight: 700,
      whiteSpace: 'pre'
    },
    colContainer: {
      width: '100%',
      justifyContent: 'center',
      textAlign: 'center'
    },
    firstCol: {
      display: 'inline-flex',
      flex: 1
    },
    secondCol: {
      display: 'inline-flex',
      justifyContent: 'center',
      textAlign: 'center',
      flex: 1
    },
    thirdCol: {
      display: 'inline-flex',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      textAlign: 'right',
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
    subtext: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      marginLeft: '8px',
      fontWeight: 400,
      fontSize: '12px'
    },
    totalText: {
      display: 'flex',
      margin: '0 auto',
      fontWeight: 700,
      fontSize: '12px',
      textAlign: 'center'
    },
    selectPeriod: {
      minWidth: 83,
      fontSize: 12,
      padding: 0,
      color: theme.palette.primary.color
    },
    subselect: {
      display: 'flex',
      margin: '5px 8px 0 auto',
      fontWeight: 700,
      fontSize: '12px',
      textAlign: 'right'
    }
  };
};
