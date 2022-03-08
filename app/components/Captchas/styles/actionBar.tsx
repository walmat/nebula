import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      justifyContent: 'center',
      zIndex: 999
    },
    background: {
      height: 40,
      background:
        'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
      boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.25)',
      borderRadius: '50%',
      flexDirection: 'row',
      display: 'flex',
      position: 'absolute',
      bottom: 24,
      width: 40
    },
    alignCenter: {
      alignSelf: 'center',
      height: '100%'
    },
    center: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
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
