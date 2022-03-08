import { variables, mixins } from '../../../styles/js';

export const styles = theme => ({
  margin: {},
  root: {},
  dialog: {
    padding: '16px 24px 24px 24px',
    backgroundColor: theme.palette.primary.background,
    color: theme.palette.primary.color
  },
  dialogSizes: {
    padding: '16px 24px 24px 24px',
    minHeight: 215
  },
  topRow: {
    display: 'flex'
  },
  pointer: {
    cursor: 'pointer'
  },
  pushRight: {
    marginRight: 'auto !important'
  },
  flexRow: {
    display: 'flex',
    alignItems: 'flex-end',
    margin: '0'
  },
  flexCol: {
    width: `33%`,
    display: 'flex',
    flexDirection: 'column'
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
  createBtn: {
    fontSize: '12px',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    fontWeight: 400,
    lineHeight: 1,
    marginRight: '12px',
    padding: '6px 16px',
    borderColor: '#8E83F4',
    backgroundColor: '#8E83F4',
    color: '#fff',
    width: '100%',
    height: 29,
    maxHeight: 29,
    transition: theme.transitions.create(['opacity'], { duration: 300 }),
    '&:hover': {
      opacity: 0.5,
      borderColor: '#8E83F4',
      backgroundColor: '#8E83F4',
      color: '#fff'
    }
  },
  createBtnLight: {
    fontSize: '12px',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    fontWeight: 400,
    lineHeight: 1,
    opacity: 0.5,
    marginRight: '12px',
    padding: '6px 16px',
    borderColor: '#8E83F4',
    backgroundColor: '#8E83F4',
    color: '#fff',
    width: '100%',
    height: 29,
    maxHeight: 29,
    transition: theme.transitions.create(['opacity'], { duration: 300 }),
    '&:hover': {
      opacity: 0.25,
      borderColor: '#8E83F4',
      backgroundColor: '#8E83F4',
      color: '#fff'
    }
  },
  deleteBtn: {
    opacity: 0.5,
    fontSize: '12px',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    fontWeight: 400,
    lineHeight: 1,
    height: 29,
    maxHeight: 29,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.border,
    padding: '6px 16px',
    width: '100%',
    transition: theme.transitions.create(['opacity'], { duration: 300 }),
    '&:hover': {
      opacity: 1,
      border: `1px solid ${theme.palette.primary.border}`,
      color: theme.palette.primary.color,
      backgroundColor: theme.palette.primary.border
    }
  },
  fieldset: {
    width: '33%'
  },
  fieldSetFirst: {
    maxWidth: '47.5%',
    width: '47.5%',
    marginRight: 16
  },
  fieldSetSecond: {
    width: '19%',
    marginLeft: 14,
    marginTop: 21
  },
  accountFieldOne: {
    width: `30%`,
    margin: '0 11px 0 0'
  },
  accountFieldTwo: {
    width: `30%`,
    margin: '0 11px'
  },
  accountFieldThree: {
    width: `30%`,
    margin: '0 0 0 11px'
  },
  autoSolveField: {
    width: `36.5%`,
    margin: '0 12px 0 0'
  },
  fieldSetHalfOne: {
    width: '47.5%',
    maxWidth: '47.5%',
    marginRight: 8,
    overflow: 'hidden'
  },
  fieldSetHalfTwo: {
    width: '47.5%',
    maxWidth: '47.5%',
    marginLeft: 8,
    overflow: 'hidden'
  },
  fieldSetWebhookName: {
    width: '27%',
    marginLeft: 8,
    overflow: 'hidden'
  },
  fieldSetDeclines: {
    width: '18%',
    marginLeft: 16,
    marginTop: 14,
    overflow: 'hidden'
  },
  previousIcon: {
    width: 16,
    height: 16,
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto 8px',
    color: '#616161'
  },
  nextIcon: {
    width: 16,
    height: 16,
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto 8px',
    color: '#616161'
  },
  subtitle: {},
  fmSettingsStylesFix: {
    marginTop: 10
  },
  formGroup: {
    paddingTop: 0
  },
  flexStart: {
    width: '100%',
    marginLeft: '0 !important',
    justifyContent: 'flex-start'
  },
  subcategory: {
    margin: 'auto 24px',
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    color: '#616161'
  },
  autoSolveError: {
    margin: 'auto 24px',
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontSize: '12px',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    color: '#FF4462'
  },
  subheading: {
    margin: 'auto 24px',
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    color: '#616161',
    transition: theme.transitions.create(['color'], { duration: 300 }),
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
  title: {
    margin: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  switch: {},
  block: {
    marginBottom: 20
  },
  marginTop: {
    marginTop: 20
  },
  marginBottom: {
    marginBottom: 10
  },
  onBoardingPaper: {
    position: `relative`,
    padding: 10,
    margin: '0 0 8px 0',
    color: '#fff',
    backgroundColor: variables().styles.primaryColor.main
  },
  onBoardingPaperArrow: {
    fontWeight: `bold`,
    content: ' ',
    borderBottom: `11px solid ${variables().styles.primaryColor.main}`,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    position: 'absolute',
    top: -10,
    left: 2
  },
  onBoardingPaperBody: {
    color: variables().styles.primaryColor.secondary
  },
  a: {
    fontWeight: `bold`,
    margin: '0 8px 0 4px'
  },
  aLight: {
    fontWeight: 400,
    margin: '0 8px'
  },
  btnPositive: {
    flex: 0,
    display: 'flex',
    margin: '0 20px',
    ...mixins().btnPositive
  },
  btnWarning: {
    display: 'flex',
    ...mixins().btnNegative
  },
  bottomRow: {
    flex: '0 0 auto',
    margin: '8px 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  textCol: {
    flex: 1,
    margin: '8px 16px auto 16px'
  }
});
