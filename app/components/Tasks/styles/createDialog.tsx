import { variables } from '../../../styles/js';

export const styles = theme => ({
  margin: {},
  root: {
    height: 425,
    zIndex: 9999,
    width: 675,
    overflow: 'hidden'
  },
  rootFix: {
    flex: 'inherit'
  },
  topRow: {
    display: 'flex'
  },
  pushLeft: {
    marginRight: 170
  },
  massVariantsBtn: {
    height: 'unset',
    padding: '2px',
    border: 'none'
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
    flex: 'inherit',
    overflow: 'hidden',
    padding: 0
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 500
  },
  fmSettingsStylesFix: {
    marginTop: 10
  },
  formFieldOne: {
    flex: 1,
    margin: '0 8px 16px 0',
    flexWrap: 'nowrap',
    display: 'inline-flex'
  },
  formFieldTwo: {
    flex: 1,
    margin: '0 8px 16px 0',
    flexWrap: 'nowrap',
    display: 'inline-flex'
  },
  formGroupOne: {
    flex: 1,
    margin: '0 8px 16px 0',
    flexWrap: 'nowrap',
    display: 'inline-flex'
  },
  formGroupTwo: {
    flex: 1,
    flexWrap: 'nowrap',
    display: 'inline-flex'
  },
  formGroup: {
    flex: 1,
    display: 'flex',
    margin: '0 0 16px 0'
  },
  formGroupCondensed: {
    flex: 1,
    margin: '12px 0 0px 0',
    display: 'flex'
  },
  formGroupCenter: {
    margin: '8px 0 16px 0'
  },
  marginAuto: {
    margin: 'auto 0',
    flex: '0 !important'
  },
  actionIcon: {
    cursor: 'pointer',
    color: '#8E83F4',
    '&:hover': {
      opacity: 0.5
    }
  },
  previousIcon: {
    width: 12,
    margin: 'auto 8px',
    cursor: 'pointer',
    '&:hover': {
      cursor: 'pointer',
      color: '#8E83F4',
      transition: theme.transitions.create(['color'], { duration: 300 }),
      '& > *': {
        cursor: 'pointer',
        color: '#8E83F4',
        transition: theme.transitions.create(['color'], { duration: 300 })
      }
    }
  },
  nextIcon: {
    width: 12,
    margin: 'auto 8px',
    cursor: 'pointer',
    '&:hover': {
      cursor: 'pointer',
      color: '#8E83F4',
      transition: theme.transitions.create(['color'], { duration: 300 }),
      '& > *': {
        cursor: 'pointer',
        color: '#8E83F4',
        transition: theme.transitions.create(['color'], { duration: 300 })
      }
    }
  },
  subheadingLeft: {
    width: 150,
    alignContent: 'center',
    justifyContent: 'center',
    display: 'flex',
    color: theme.palette.primary.checkbox,
    flexDirection: 'row',
    margin: 'auto 0',
    marginTop: 30,
    '&:hover': {
      cursor: 'pointer',
      color: '#8E83F4',
      transition: theme.transitions.create(['color'], { duration: 300 }),
      '& > *': {
        cursor: 'pointer',
        color: '#8E83F4',
        transition: theme.transitions.create(['color'], { duration: 300 })
      }
    }
  },
  subheading: {
    width: 150,
    display: 'flex',
    color: theme.palette.primary.checkbox,
    flexDirection: 'row',
    margin: 'auto 0',
    marginTop: 30,
    '&:hover': {
      cursor: 'pointer',
      color: '#8E83F4',
      transition: theme.transitions.create(['color'], { duration: 300 }),
      '& > *': {
        cursor: 'pointer',
        color: '#8E83F4',
        transition: theme.transitions.create(['color'], { duration: 300 })
      }
    }
  },
  titleLeft: {
    color: theme.palette.primary.color,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    margin: '24px 24px 16px 24px',
    marginLeft: '60px',
    flex: 1
  },
  title: {
    color: theme.palette.primary.color,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    margin: '24px 24px 16px 24px',
    marginRight: '-125px',
    flex: 1
  },
  marginRight16: {
    marginRight: 16
  },
  marginRight: {
    marginRight: 8
  },
  marginLeft: {
    marginLeft: 8
  },
  inputWrapper: {
    margin: 0
  },
  overflowYScroll: {
    overflowY: 'scroll'
  },
  input: {
    borderRadius: 5,
    fontSize: 12,
    paddingLeft: 8,
    paddingRight: 8,
    fontWeight: 400,
    maxHeight: 29.25,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    border: `1px solid ${theme.palette.primary.border}`,
    width: '100%'
  },
  inputPicker: {
    fontWeight: 400,
    fontSize: 12
  },
  flexOne: {
    flex: 2
  },
  flexNone: {
    flex: 1
  },
  flex: {
    flex: 1,
    display: 'flex'
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
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 16,
    flex: 1
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
  clearBtn: {
    width: 105,
    height: 35,
    color: theme.palette.primary.color,
    backgroundColor: '#FFB15E',
    borderRadius: 4,
    opacity: 0.5,
    border: `1px solid ${theme.palette.primary.border}`,
    transition: theme.transitions.create(['opacity'], {
      duration: 300
    }),
    '&:hover': {
      color: theme.palette.primary.color,
      backgroundColor: '#FFB15E',
      border: `1px solid ${theme.palette.primary.border}`,
      opacity: 0.25,
      transition: theme.transitions.create(['opacity'], {
        duration: 300
      })
    },
    '&:active': {
      color: theme.palette.primary.color,
      backgroundColor: '#FFB15E',
      border: `1px solid ${theme.palette.primary.border}`,
      opacity: 0.25,
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
