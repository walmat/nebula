import { variables, mixins } from '../../../styles/js';

export const styles = theme => ({
  margin: {},
  root: {},
  dialog: {
    padding: '16px 24px 24px 24px'
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
    flex: 1,
    margin: '0'
  },
  flexCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    borderRadius: 5,
    fontSize: 12,
    paddingLeft: 8,
    paddingRight: 8,
    fontWeight: 400,
    border: '1px solid #979797',
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
    height: 27,
    maxHeight: 27,
    transition: theme.transitions.create(['opacity'], { duration: 300 }),
    '&:hover': {
      opacity: 0.5,
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
    margin: '0 0 0 14px',
    padding: '6px 16px',
    borderColor: '#8E83F4',
    border: '1px solid',
    backgroundColor: '#fff',
    color: '#8E83F4',
    width: '100%',
    transition: theme.transitions.create(['opacity'], { duration: 300 }),
    '&:hover': {
      opacity: 0.5,
      border: '1px solid',
      backgroundColor: '#fff',
      color: '#8E83F4'
    }
  },
  fieldset: {
    width: '100%'
  },
  fieldSetFirst: {
    maxWidth: '47.5%',
    width: '47.5%',
    margin: '0 8px 0 0'
  },
  fieldSetSecond: {
    maxWidth: '47.5%',
    width: '47.5%',
    margin: '0 0 0 8px'
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
  previousIcon: {
    width: 16,
    height: 16,
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto 8px'
  },
  nextIcon: {
    width: 16,
    height: 16,
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto 8px',
    color: '#616161'
  },
  subtitle: {
    marginBottom: 8
  },
  fmSettingsStylesFix: {
    marginTop: 10
  },
  formGroup: {
    paddingTop: 0
  },
  subheading: {
    margin: 'auto 24px',
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
  switch: {
    height: 30
  },
  block: {
    marginBottom: 20
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
    display: 'flex',
    ...mixins().btnPositive
  },
  btnNegative: {
    display: 'flex',
    ...mixins().btnNegative
  },
  btnWarning: {
    display: 'flex',
    backgroundColor: 'rgb(199, 193, 255)',
    color: '#fff',
    '&:hover': {
      opacity: 0.5,
      color: '#fff',
      backgroundColor: 'rgb(199, 193, 255)',
      borderColor: 'rgb(199, 193, 255)'
    },
    '&:active': {
      opacity: 0.5,
      color: '#fff',
      backgroundColor: 'rgb(199, 193, 255)',
      borderColor: 'rgb(199, 193, 255)'
    }
  },
  bottomRow: {
    flex: '0 0 auto',
    margin: '8px 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  textCol: {
    flex: 1,
    margin: '8px 16px auto 16px'
  }
});
