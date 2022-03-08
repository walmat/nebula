import { variables, mixins } from '../../../styles/js';

export const styles = theme => ({
  subHeading: {
    ...mixins().noDrag,
    ...mixins().noselect,
    marginTop: 15
  },
  instructions: {
    listStyle: `none`,
    color: variables().styles.textLightColor,
    lineHeight: '24px',
    marginTop: 15,
    paddingLeft: 0,
    marginBottom: 15
  },
  generateLogsBtn: {
    marginTop: 15
  },
  emailIdWrapper: {
    color: variables().styles.textLightColor,
    marginTop: 15
  },
  emailId: {
    fontWeight: `bold`
  },
  btnStart: {
    marginTop: 15,
    height: 35,
    color: '#fff',
    borderRadius: 4,
    transition: theme.transitions.create(['opacity'], {
      duration: 300
    }),
    background:
      'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
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
