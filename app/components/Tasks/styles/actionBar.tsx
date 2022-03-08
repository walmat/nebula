import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      justifyContent: 'center'
    },
    background: {
      position: 'absolute',
      borderRadius: 25.5,
      bottom: 24,
      width: 315,
      opacity: 0.25,
      background:
        'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
      height: 40,
      transition: theme.transitions.create(['opacity'], { duration: 300 }),
      display: 'flex',
      boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.25)',
      flexDirection: 'row',
      '&:hover': {
        transition: theme.transitions.create(['opacity'], { duration: 300 }),
        opacity: 1
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
    alignCenter: {
      alignSelf: 'center'
    },
    center: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    },
    table: {
      height: `calc(100% - 125px)`
    },
    actionIcon: {
      cursor: 'pointer',
      color: '#fff',
      height: 24,
      width: 24,
      '&:hover': {
        opacity: 0.5
      }
    },
    lastAction: {
      margin: '0 16px 0 8px'
    },
    input: {
      borderRadius: 5,
      fontSize: 10,
      paddingLeft: 8,
      paddingRight: 8,
      fontWeight: 400,
      backgroundColor: theme.palette.primary.secondary,
      color: theme.palette.primary.color,
      border: '1px solid #979797',
      width: '100%',
      height: 27
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
