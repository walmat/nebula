import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    cardCell: {
      flexBasis: 'calc(100% / 3)',
      float: 'left'
    },
    root: {
      margin: 10,
      backgroundColor: theme.palette.primary.card,
      height: 200,
      flexGrow: 1,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: 12,
      transition: theme.transitions.create(['background-color'], {
        duration: 300
      }),
      '&:hover': {
        cursor: 'pointer',
        transition: theme.transitions.create(['background-color'], {
          duration: 300
        }),
        backgroundColor: 'rgba(131,119,244,1)'
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
    background: {
      height: '100%',
      width: '100%'
    },
    gridContainer: {
      margin: 24,
      width: 'calc(100% - 48px)'
    },
    gridContainerMid: {
      margin: '24px 24px 0 24px',
      width: 'calc(100% - 48px)'
    },
    gridContainerEnd: {
      margin: '0 24px 24px 24px',
      width: 'calc(100% - 48px)',
      justifyContent: 'flex-end'
    },
    cardHolder: {
      display: 'flex',
      flex: 1,
      color: '#fff',
      fontSize: 16,
      fontWeight: 500
    },
    cardName: {
      display: 'flex',
      flex: 1,
      color: '#fff',
      fontSize: 14,
      fontWeight: 400
    },
    dots: {
      display: 'flex',
      color: '#fff',
      fontSize: 16,
      fontWeight: 400,
      marginRight: 8
    },
    cardNumber: {
      display: 'flex',
      flex: 1,
      color: '#fff',
      fontSize: 16,
      fontWeight: 400
    },
    actionIconWrapper: {
      display: 'flex',
      padding: 0,
      alignSelf: 'flex-start',
      '&:hover': {
        background: 'transparent',
        backgroundColor: 'transparent'
      }
    },
    cardTypeImg: {
      height: 50,
      width: 50,
      objectFit: 'scale-down'
    },
    actionIcon: {
      color: '#fff',
      '&:hover': {
        opacity: 0.5
      }
    }
  };
};
