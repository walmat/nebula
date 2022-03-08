import { variables } from '../../../styles/js';

export const styles = theme => ({
  margin: {},
  rootSm: {
    width: 350,
    height: 415,
    backgroundColor: theme.palette.primary.background,
    color: theme.palette.primary.color
  },
  fieldset: {
    width: `45%`,
    margin: '0 12px',
    border: 0,
    display: 'inline-flex',
    padding: 0,
    position: 'relative',
    minWidth: 0,
    flexDirection: 'column',
    verticalAlign: 'top'
  },
  fieldsetFull: {
    width: '100%'
  },
  dialogContent: {
    margin: '16px 48px',
    padding: 0
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 500
  },
  fmSettingsStylesFix: {
    marginTop: 10
  },
  formGroupOne: {
    margin: '0 4px 16px 0',
    flexWrap: 'nowrap',
    display: 'inline-flex'
  },
  formGroupTwo: {
    margin: '0 0 16px 4px',
    flexWrap: 'nowrap',
    display: 'inline-flex'
  },
  formGroup: {
    margin: '0 0 16px 0'
  },
  formGroupCenter: {
    margin: '8px 0 16px 0'
  },
  subheading: {
    marginBottom: 5
  },
  title: {
    color: theme.palette.primary.heading,
    display: 'flex',
    justifyContent: 'center',
    margin: '24px 24px 16px 24px'
  },
  inputWrapper: {
    margin: 0
  },
  input: {
    borderRadius: 5,
    fontSize: 12,
    paddingLeft: 8,
    paddingRight: 8,
    fontWeight: 400,
    backgroundColor: theme.palette.primary.secondary,
    color: theme.palette.primary.color,
    border: `1px solid ${theme.palette.primary.border}`,
    width: '100%'
  },
  flexOne: {
    flex: 2
  },
  flexNone: {
    flex: 1
  },
  flex: {
    display: 'flex'
  },
  block: {},
  onBoardingPaper: {
    position: `relative`,
    padding: 10,
    marginTop: 4,
    backgroundColor: variables().styles.secondaryColor.background
  },
  onBoardingPaperArrow: {
    fontWeight: `bold`,
    content: ' ',
    borderBottom: `11px solid ${variables().styles.secondaryColor.background}`,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    position: 'absolute',
    top: -10,
    left: 2
  },
  onBoardingPaperBody: {
    color: variables().styles.primaryColor.background
  },
  a: {
    fontWeight: `bold`
  },
  menuItem: {
    padding: '4px 8px',
    fontSize: 10,
    textAlign: 'center'
  },
  stepper: {
    maxWidth: 400,
    flexGrow: 1
  },
  bar: {
    backgroundColor: '#fff'
  },
  progressBar: {
    backgroundColor: 'rgba(164,155,255, 0.333)',
    color: '#d8d8d8'
  },
  stepperRoot: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
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
  btnStart: {
    width: 105,
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
  },
  btnEnd: {
    width: 105,
    height: 35,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    borderRadius: 4,
    border: `1px solid ${theme.palette.primary.border}`,
    transition: theme.transitions.create(['opacity'], {
      duration: 300
    }),
    '&:hover': {
      opacity: 0.5,
      transition: theme.transitions.create(['opacity'], {
        duration: 300
      })
    },
    '&:active': {
      opacity: 0.5,
      transition: theme.transitions.create(['opacity'], {
        duration: 300
      })
    }
  }
});
