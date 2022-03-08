import { mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    gridItem: {
      height: '100%'
    },
    root: {
      background:
        'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
      height: '100%',
      marginRight: 10,
      flexGrow: 1,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: 8,
      transition: theme.transitions.create(['background-color'], {
        duration: 300
      })
    },
    row: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bold: {
      fontWeight: 700,
      whiteSpace: 'pre'
    },
    welcome: {
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignSelf: 'center',
      margin: '0 0 16px 0',
      fontWeight: 300
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
    unbindBtn: {
      fontSize: '12px',
      justifyContent: 'center',
      alignSelf: 'center',
      fontWeight: 400,
      marginRight: '12px',
      padding: '6px 16px',
      transition: theme.transitions.create(['opacity'], { duration: 300 }),
      ...mixins().btnNegative
    },
    joinDiscordBtn: {
      opacity: 0.5,
      fontSize: '12px',
      justifyContent: 'center',
      alignSelf: 'center',
      fontWeight: 400,
      padding: '6px 16px',
      transition: theme.transitions.create(['opacity'], { duration: 300 }),
      ...mixins().btnNegative
    }
  };
};
