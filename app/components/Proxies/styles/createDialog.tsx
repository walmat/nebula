import { variables } from '../../../styles/js';

export const styles = theme => ({
  margin: {},
  root: {
    height: 475,
    width: 675,
    overflow: 'hidden'
  },
  fieldset: {
    width: `100%`,
    border: 0,
    display: 'inline-flex',
    padding: 0,
    position: 'relative',
    minWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    verticalAlign: 'top'
  },
  fieldsetFull: {
    width: '100%',
    overflow: 'hidden'
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
  forceStart: {
    margin: '0 auto 0 0'
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
    color: theme.palette.primary.color,
    display: 'flex',
    justifyContent: 'center',
    margin: '24px 24px 16px 24px'
  },
  inputWrapper: {
    margin: 0
  },
  multiline: {
    fontSize: 12,
    height: 225,
    width: '100%',
    fontWeight: 400,
    overflow: 'hidden',
    borderRadius: 5,
    padding: 8,
    border: '1px solid #979797',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  proxyInput: {
    height: '100%',
    fontSize: 12,
    paddingLeft: 8,
    paddingRight: 8,
    fontWeight: 400,
    color: theme.palette.primary.color
  },
  input: {
    borderRadius: 5,
    fontSize: 12,
    paddingLeft: 8,
    paddingRight: 8,
    fontWeight: 400,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    border: `1px solid ${theme.palette.primary.border}`,
    maxWidth: 185
  },
  numProxies: {
    fontSize: 12,
    fontWeight: 400,
    margin: 0,
    color: '#8E83F4'
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
  fullWidth: {
    width: '100%'
  },
  block: {},
  onBoardingPaper: {
    position: `relative`,
    padding: 10,
    marginTop: 4,
    backgroundColor: variables().styles.secondaryColor.main
  },
  onBoardingPaperArrow: {
    fontWeight: `bold`,
    content: ' ',
    borderBottom: `11px solid ${variables().styles.secondaryColor.main}`,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    position: 'absolute',
    top: -10,
    left: 2
  },
  onBoardingPaperBody: {
    color: variables().styles.primaryColor.main
  },
  a: {
    fontWeight: `bold`
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
  bottomRow: {
    justifyContent: 'center'
  },
  btnStart: {
    width: 105,
    height: 35,
    color: '#fff',
    borderRadius: 4,
    background:
      'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)'
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
