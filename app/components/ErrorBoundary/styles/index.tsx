import { variables, mixins } from '../../../styles/js';

export const styles = theme => ({
  root: {
    textAlign: `center`,
    ...mixins().center,
    ...mixins().absoluteCenter
  },
  bugImg: {
    ...mixins().noDrag,
    height: `auto`,
    borderRadius: '50%',
    width: 150
  },
  headings: {
    ...mixins().noDrag,
    ...mixins().noselect,
    marginTop: 15
  },
  subHeading: {
    ...mixins().noDrag,
    ...mixins().noselect,
    marginTop: 15
  },
  goBackBtn: {
    marginTop: 15,
    marginLeft: 15
  },
  btnEnd: {
    height: 35,
    marginTop: 15,
    marginLeft: 15,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    borderRadius: 4,
    border: `1px solid ${theme.palette.primary.border}`,
    transition: theme.transitions.create(['opacity'], {
      duration: 300
    }),
    '&:hover': {
      color: theme.palette.primary.color,
      backgroundColor: theme.palette.primary.secondary,
      border: `1px solid ${theme.palette.primary.border}`,
      opacity: 0.5,
      transition: theme.transitions.create(['opacity'], {
        duration: 300
      })
    },
    '&:active': {
      color: theme.palette.primary.color,
      backgroundColor: theme.palette.primary.secondary,
      border: `1px solid ${theme.palette.primary.border}`,
      opacity: 0.5,
      transition: theme.transitions.create(['opacity'], {
        duration: 300
      })
    }
  }
});
