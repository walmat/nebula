import { variables, mixins } from '../../../../styles/js';

export const styles = theme => ({
  root: {
    color: theme.palette.primary.color,
    borderRadius: '5px',
    backgroundColor: 'transparent',
    textAlign: `left`,
    padding: 30,
    maxWidth: '800px',
    margin: '78px auto 48px 0',
    overflow: 'auto'
  },
  bold: {
    color: variables().styles.primaryColor.main
  },
  a: {
    fontWeight: `bold`
  },
  heading: {
    textDecoration: 'underline'
  },
  body: {
    lineHeight: `22px`
  },
  noAppDrag: {
    ...mixins().appDragDisable
  },
  navBtns: {
    paddingLeft: 5
  },
  navBtnImgs: {
    height: 25,
    width: `auto`,
    ...mixins().noDrag,
    ...mixins().noselect
  }
});
