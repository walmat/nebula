import React, { MouseEvent } from 'react';

import { Fade, Menu, MenuItem } from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import { close, minimize, quit } from '../../../../utils/createWindows';
import { styles } from '../../styles/ToolbarAreaPane';

const useStyles = makeStyles(styles);

const _renderMenuItem = ({
  className,
  onClick,
  label
}: {
  className: string;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  label: string;
}) => (
  <MenuItem key={`menuItem--${label}`} className={className} onClick={onClick}>
    {label}
  </MenuItem>
);

const extractMenuItems = (
  pathname: string,
  toggleState: any,
  toggleSettings: any,
  styles: any
) => {
  const action = /privacy|terms|bugs/i.test(pathname) ? close : quit;

  if (/privacy|terms|bugs/i.test(pathname)) {
    return (
      <MenuItem className={styles.condensedMenuItem} onClick={action}>
        Close
      </MenuItem>
    );
  }

  return [
    {
      className: styles.condensedMenuItem,
      onClick: toggleState,
      label: 'State'
    },
    {
      className: styles.condensedMenuItem,
      onClick: toggleSettings,
      label: 'Settings'
    },
    {
      className: styles.condensedMenuItem,
      onClick: minimize,
      label: 'Minimize'
    },
    {
      className: styles.condensedMenuItem,
      onClick: action,
      label: 'Close'
    }
  ].map(_renderMenuItem);
};

const ToolbarAreaPane = ({
  anchorEl,
  handleClose,
  handleToggleState,
  handleToggleSettings,
  pathname
}: {
  anchorEl: any;
  handleClose: any;
  handleToggleState: any;
  handleToggleSettings: any;
  pathname: string;
}) => {
  const styles = useStyles();

  const menuItems = extractMenuItems(
    pathname,
    handleToggleState,
    handleToggleSettings,
    styles
  );

  return (
    <Menu
      id="simple-menu"
      className={styles.toolbarMenu}
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
      TransitionComponent={Fade}
      MenuListProps={{
        classes: {
          root: styles.menuList
        }
      }}
      PaperProps={{
        style: {
          marginTop: 40,
          padding: 0
        }
      }}
      style={{
        paddingTop: 0,
        paddingBottom: 0
      }}
    >
      {menuItems}
    </Menu>
  );
};

export default ToolbarAreaPane;
