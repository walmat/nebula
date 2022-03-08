import { variables, mixins } from '../../../styles/js';

export const styles = theme => {
  return {
    root: {
      backgroundColor: `transparent !important`,
      color: theme.palette.primary.color,
      position: 'absolute',
      width: 'auto',
      marginRight: 20,
      top: 0,
      right: 0
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
    badge: {
      top: 0,
      right: 0,
      height: 8,
      width: 8,
      color: 'white',
      backgroundColor: '#D8D8D8'
    },
    badgeStaff: {
      top: 0,
      right: 0,
      height: 8,
      width: 8,
      color: 'white',
      backgroundColor: '#ff86ab'
    },
    badgeMember: {
      top: 0,
      right: 0,
      height: 8,
      width: 8,
      color: 'white',
      backgroundColor: '#a097fd'
    },
    badgeLifetime: {
      top: 0,
      right: 0,
      height: 8,
      width: 8,
      color: 'white',
      backgroundColor: '#29cf8a'
    },
    inline: {
      display: 'flex',
      color: theme.palette.primary.color,
      flexDirection: 'column',
      textAlign: 'right',
      lineHeight: 1.25
    },
    bold: {
      fontWeight: 500
    },
    grow: {
      flexGrow: 1
    },
    subtext: {
      fontSize: 10,
      color: theme.palette.primary.subtext,
      fontWeight: 300
    },
    toolbarInnerWrapper: {
      display: 'flex',
      margin: '0 0 0 auto',
      padding: 0
    },
    toolbar: {
      width: `auto`,
      height: variables().sizes.toolbarHeight
    },
    appBar: {
      backgroundColor: `transparent !important`,
      margin: '16px 0 0 0'
    },
    navBtns: {
      margin: 15
    },
    noAppDrag: {
      ...mixins().appDragDisable,
      ...mixins().noDrag
    },
    navBtnImgs: {
      ...mixins().noDrag,
      ...mixins().noselect,
      height: 25,
      width: `auto`,
      '&:hover': {
        backgroundColor: 'transparent !important'
      }
    },
    disabledNavBtns: {},
    toolbarMenu: {
      padding: 0
    },
    condenseRight: {
      paddingRight: 6.5,
      height: '100%',
      margin: 'auto 0'
    },
    avatar: {
      cursor: 'pointer'
    },
    condensedMenuItem: {
      display: 'flex !important',
      justifyContent: 'center',
      padding: '8px 4px !important',
      fontSize: 12,
      fontWeight: 400,
      lineHeight: `0.5 !important`
    }
  };
};
