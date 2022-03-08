import { variables, mixins } from '../../../styles/js';

export const styles = theme => ({
  root: {
    boxShadow: `5px 0px 5px 1px ${theme.palette.primary.boxShadow}`,
    maxWidth: '236px',
    zIndex: 999,
    position: 'static !important',
    backgroundColor: theme.palette.primary.secondary,
    color: theme.palette.primary.color,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
    width: '100%',
    transition: theme.transitions.create(['max-width'], { duration: 300 })
  },
  rootCollapsed: {
    boxShadow: `5px 0px 5px 1px ${theme.palette.primary.boxShadow}`,
    maxWidth: '40px',
    zIndex: 999,
    position: 'static !important',
    backgroundColor: theme.palette.primary.secondary,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    height: '100%',
    width: '100%',
    transition: theme.transitions.create(['max-width'], { duration: 300 })
  },
  defaultIcon: {
    color: theme.palette.primary.navText
  },
  adjustSizing: {
    width: 16,
    height: 'auto',
    marginLeft: 24,
    color: theme.palette.primary.color
  },
  navHeader: {
    color: '#8D8D8D',
    fontSize: 12,
    marginBottom: 8
  },
  marginBottom: {
    marginBottom: 1
  },
  navText: {
    fontSize: 12
  },
  defaultCursor: {
    cursor: 'default !important',
    marginRight: 0
  },
  activeNavBg: {
    background: variables().styles.sidebar.active
  },
  activeNavText: {
    fontSize: 12,
    color: '#fff !important'
  },
  afterRight: {
    paddingLeft: `24px`
  },
  navigationHeader: {
    backgroundColor: theme.palette.primary.navHeader,
    color: theme.palette.primary.color,
    borderRadius: 5,
    paddingTop: 4,
    paddingBottom: 4
  },
  mainNavigation: {
    backgroundColor: theme.palette.primary.navBackground,
    margin: '6px 0',
    borderRadius: 5,
    paddingTop: 1,
    paddingBottom: 1
  },
  altNavigation: {
    cursor: 'pointer',
    border: '2px solid',
    borderRadius: 5,
    borderColor: variables().styles.sidebar.header,
    padding: '0',
    marginTop: 'auto'
  },
  noAppDrag: {
    ...mixins().appDragDisable,
    ...mixins().noDrag,
    borderRadius: 5
  },
  addedStyle: {
    display: 'none',
    transition: theme.transitions.create(['display'], { duration: 300 })
  },
  collapse: {
    padding: 0,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  navBtns: {
    paddingLeft: 0,
    color: theme.palette.primary.iconColor
  },
  nested: {
    backgroundColor: theme.palette.primary.navBackground,
    paddingLeft: 16,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 4,
    margin: '12px 0'
  },
  nestedDisabled: {
    paddingLeft: 16,
    backgroundColor: theme.palette.primary.navBackground,
    paddingTop: 1,
    paddingBottom: 1,
    borderRadius: 4,
    margin: '12px 0',
    cursor: 'not-allowed'
  },
  shrinkText: {
    fontSize: 11,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  navBtnImgs: {
    height: 25,
    width: `auto`,
    ...mixins().noDrag,
    ...mixins().noselect
  },
  navBtnImgsEnd: {
    display: 'flex',
    alignSelf: 'flex-end'
  },
  rowStartExpand: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  fill: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    width: '100%'
  },
  end: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    margin: '0 15px'
  },
  center: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: '32px 0 64px 0',
    position: 'static !important'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    margin: `0 15px`
  },
  rowExpand: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  col: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: `0 15px`,
    transition: theme.transitions.create(['display'], { duration: 300 })
  },
  colCenter: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    margin: 'auto 0',
    height: '100%',
    width: '100%',
    cursor: 'pointer'
  },
  collapsedBtn: {
    height: 20,
    width: 20
  },
  spacer: {
    margin: '16px 0'
  },
  noPaddingLeft: {
    paddingLeft: 0
  },
  noMarginRight: {
    width: 18,
    height: 'auto',
    minWidth: 'unset'
  },
  noPadding: {
    padding: 0
  },
  colExpand: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    margin: `15px`
  }
});
