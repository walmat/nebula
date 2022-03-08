import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      margin: 10,
      backgroundColor: theme.palette.primary.card,
      height: 250,
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
    input: {
      borderRadius: 5,
      fontSize: 12,
      paddingLeft: 8,
      paddingRight: 8,
      fontWeight: 400,
      backgroundColor: theme.palette.primary.background,
      color: theme.palette.primary.color,
      border: `1px solid ${theme.palette.primary.border}`,
      width: '100%'
    },
    inputShortOne: {
      borderRadius: 5,
      fontSize: 12,
      paddingLeft: 8,
      paddingRight: 8,
      marginRight: 8,
      fontWeight: 400,
      backgroundColor: theme.palette.primary.background,
      color: theme.palette.primary.color,
      border: `1px solid ${theme.palette.primary.border}`,
      width: '45%'
    },
    inputShortTwo: {
      borderRadius: 5,
      fontSize: 12,
      paddingLeft: 8,
      paddingRight: 8,
      marginLeft: 8,
      fontWeight: 400,
      backgroundColor: theme.palette.primary.background,
      color: theme.palette.primary.color,
      border: `1px solid ${theme.palette.primary.border}`,
      width: '45%'
    },
    dropdownIcon: {
      color: theme.palette.primary.color,
      fontSize: 16,
      marginTop: 4,
      marginRight: 4
    },
    confirmBtn: {
      width: 105,
      height: 35,
      background:
        'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
      color: '#fff'
    },
    menuList: {
      fontSize: 10,
      padding: 0,
      backgroundColor: theme.palette.primary.background,
      color: theme.palette.primary.color
    },
    menuItem: {
      padding: '4px 8px',
      fontSize: 10,
      textAlign: 'center'
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
    flexFillOne: {
      flex: 1,
      marginRight: 8
    },
    flexFillTwo: {
      flex: 1,
      marginLeft: 8
    },
    proxyInput: {
      background: theme.palette.primary.background,
      padding: '0 8px',
      borderRadius: 4,
      color: theme.palette.primary.color
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
      justifyContent: 'space-around'
    },
    cardHolder: {
      display: 'flex',
      flex: 1,
      color: '#fff',
      fontSize: '1.5em',
      fontWeight: 500,
      '&:hover': {
        opacity: 0.5,
        cursor: 'pointer'
      }
    },
    cardName: {
      display: 'flex',
      flex: 1,
      color: '#fff',
      fontSize: 14,
      fontWeight: 400
    },
    textHolder: {
      margin: '0 auto 0 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    },
    imgHolder: {
      width: '20%',
      margin: 'auto 0'
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
    youtubeIconWrapper: {
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
    },
    youtubeIcon: {
      color: '#fff',
      '&:hover': {
        opacity: 0.5
      },
      width: '1.5em',
      height: '1.5em'
    }
  };
};
