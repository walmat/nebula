import { mixins } from '../../../../../styles/js';

export const styles = theme => ({
  root: {
    paddingLeft: 0,
    paddingRight: 8,
    alignItems: 'flex-start',
    minHeight: 'auto',
    marginBottom: 16
  },
  input: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 7,
    fontWeight: 400,
    fontSize: 12,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 29,
    width: 45
  },
  longInput: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 7,
    fontWeight: 400,
    fontSize: 12,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 29,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: 85
  },
  monitor: {
    marginLeft: 16,
    width: 75
  },
  groupTitle: {
    fontSize: 12,
    width: 65,
    padding: 4,
    fontWeight: 400,
    display: 'inline-flex',
    justifyContent: 'center',
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    borderRight: '0.5px solid #616161'
  },
  title: {
    fontSize: 12,
    width: 80,
    padding: 4,
    fontWeight: 400,
    display: 'inline-flex',
    justifyContent: 'center',
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    borderRight: '0.5px solid #616161'
  },
  menuItem: {
    display: 'flex !important',
    padding: '4px 8px',
    fontSize: 10,
    textAlign: 'center'
  },
  btnWrapper: {
    ...mixins().center,
    width: '100%',
    textAlign: 'center'
  },
  btn: {
    margin: 10
  },
  btnEnd: {
    width: 105,
    height: 29,
    fontSize: 10,
    marginLeft: 16,
    color: '#fff',
    background:
      'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
    borderRadius: 4,
    transition: theme.transitions.create(['opacity'], {
      duration: 300
    }),
    '&:hover': {
      background:
        'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
      opacity: 0.5,
      transition: theme.transitions.create(['opacity'], {
        duration: 300
      })
    },
    '&:active': {
      background:
        'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
      opacity: 0.5,
      transition: theme.transitions.create(['opacity'], {
        duration: 300
      })
    }
  }
});
