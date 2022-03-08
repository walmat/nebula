import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useLocation } from 'react-router-dom';

import { ClickAwayListener, AppBar, Toolbar, List } from '@material-ui/core';

import { styles } from '../../styles/ToolbarAreaPane';
import SettingsDialog from '../../../Settings';
import StateDialog from '../../../ImportExport';
import Profile from './profile';
import MenuItems from './menu';

const useStyles = makeStyles(styles);

const ToolbarAreaPane = () => {
  const styles = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStateOpen, setIsStateOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  const handleClick = useCallback(
    (event: any) => {
      if (anchorEl) {
        setAnchorEl(null);
        return;
      }

      setAnchorEl(event.currentTarget);
    },
    [anchorEl]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const _handleToggleSettings = useCallback(() => {
    setIsSettingsOpen(!isSettingsOpen);
    handleClose();
  }, [isSettingsOpen]);

  const _handleToggleState = useCallback(() => {
    setIsStateOpen(!isStateOpen);
    handleClose();
  }, [isStateOpen]);

  // don't render the toolbar on the progress window or task group windows...

  if (/progress|taskGroup/i.test(pathname)) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div className={styles.root}>
        <SettingsDialog
          show={isSettingsOpen}
          toggleSettings={_handleToggleSettings}
        />
        <StateDialog show={isStateOpen} toggleState={_handleToggleState} />
        <AppBar position="static" elevation={0} className={styles.appBar}>
          <Toolbar className={styles.toolbar} disableGutters>
            <div className={styles.toolbarInnerWrapper}>
              <List>
                <Profile handleClick={handleClick} />
                <MenuItems
                  anchorEl={anchorEl}
                  handleClose={handleClose}
                  handleToggleState={_handleToggleState}
                  handleToggleSettings={_handleToggleSettings}
                  pathname={pathname}
                />
              </List>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </ClickAwayListener>
  );
};

export default ToolbarAreaPane;
