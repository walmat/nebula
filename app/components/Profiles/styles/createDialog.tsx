import { variables, mixins } from '../../../styles/js';

export const styles = theme => ({
  margin: {},
  rootLg: {
    height: 480,
    width: 612
  },
  rootSm: {
    width: 350,
    height: 558
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
    color: theme.palette.primary.color,
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
    height: 29,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    border: `1px solid ${theme.palette.primary.border}`,
    width: '100%',
    '::placeholder': {
      color: 'rgba(0, 0, 0, 0.87)'
    }
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
    backgroundColor: theme.palette.primary.background
  },
  onBoardingPaperArrow: {
    fontWeight: `bold`,
    content: ' ',
    borderBottom: `11px solid ${theme.palette.primary.background}`,
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
  stepper: {
    maxWidth: 400,
    flexGrow: 1
  },
  bar: {},
  progressBar: {
    backgroundColor: 'rgba(164,155,255, 0.333)',
    color: '#d8d8d8'
  },
  stepperRoot: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  btnPositive: {
    borderColor: '#8E83F4',
    backgroundColor: '#8E83F4',
    '&:hover': {
      opacity: 0.5,
      borderColor: '#8E83F4',
      backgroundColor: '#8E83F4'
    }
  }
});
