'use strict';

import { mixins } from '../../../../../styles/js';

export const styles = theme => ({
  root: {
    paddingLeft: 0,
    paddingRight: 8,
    alignItems: 'flex-start',
    minHeight: 'auto',
    marginBottom: 16
  },
  input: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 7,
    fontWeight: 400,
    fontSize: 12,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 29,
    width: 45
  },
  longInput: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 7,
    paddingRight: 7,
    fontWeight: 400,
    fontSize: 12,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    height: 29,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: 85
  },
  title: {
    fontSize: 12,
    width: 90,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    padding: 4,
    fontWeight: 400,
    display: 'inline-flex',
    justifyContent: 'center',
    borderRadius: 5,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: '0.5px solid #616161'
  },
  menuItem: {
    padding: '4px 8px',
    fontSize: 10,
    textAlign: 'center'
  },
  btnWrapper: {
    ...mixins().center,
    width: '100%',
    textAlign: 'center'
  },
  btn: {
    margin: 10
  }
});
