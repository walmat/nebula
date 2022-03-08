import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useConfirm } from 'material-ui-confirm';
import { ipcRenderer } from 'electron';
import {
  Grid,
  IconButton,
  Fade,
  FormGroup,
  Input,
  Select as MuiSelect,
  Tooltip,
  MenuItem
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LaunchIcon from '@material-ui/icons/Launch';
import DeleteIcon from '@material-ui/icons/Delete';
import YouTubeIcon from '@material-ui/icons/YouTube';
import LoadingIcon from '@material-ui/icons/Cancel';
import { log } from '../../../../utils/log';
import { styles } from '../../styles/card';

import {
  editCaptcha,
  deleteCaptcha,
  HARVESTER_FIELDS,
  HARVESTER_TYPES
} from '../../actions';

import { IPCKeys } from '../../../../constants/ipc';
import { HarvesterOptions, HarvesterTypes } from '../../../../constants';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

const buildMenuItems = () => {
  const styles = useStyles();

  const options = [...Object.keys(HarvesterOptions)];

  return options.map(option => (
    <MenuItem
      key={option}
      value={HarvesterOptions[option]}
      className={styles.menuItem}
    >
      {option}
    </MenuItem>
  ));
};

const CardComponent = ({ captcha }: { captcha: any }) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const theme = useSelector((state: RootState) => state.Theme);

  const [isLoadingYouTube, setLoadingYoutube] = useState<boolean>(false);
  const [isLoadingHarvester, setLoadingHarvester] = useState<boolean>(false);

  const editHandler = async (e: any, field: string) => {
    dispatch(
      editCaptcha({
        id: captcha.id,
        type: HARVESTER_TYPES.EDIT,
        field,
        value: e.target.value
      })
    );
  };

  const closeHandler = async (e: any) => {
    e.stopPropagation();

    try {
      await confirm({
        title: `Remove Harvester "${captcha.name}"?`,
        description: 'This action cannot be undone.',
        confirmationText: 'Yes',
        cancellationText: 'No',
        dialogProps: {
          classes: {
            paper: styles.paperRoot
          }
        },
        confirmationButtonProps: {
          classes: {
            root: styles.confirmBtn
          },
          style: {
            width: 105,
            height: 35,
            background:
              'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
            color: '#fff'
          }
        },
        cancellationButtonProps: {
          classes: {
            root: styles.cancelBtn
          },
          style: {
            width: 105,
            height: 35
          }
        }
      });

      ipcRenderer
        .invoke(IPCKeys.CloseHarvesterWindows, { ...captcha })
        .then(() => dispatch(deleteCaptcha(captcha)))
        .catch(() => {
          // TODO: Error handling
        });
    } catch (e) {
      log.error(e, 'Harvesters -> Remove Harvester Cancelled');
    }
  };

  const launchHarvesterHandler = () => {
    if (!isLoadingHarvester && !isLoadingYouTube) {
      setLoadingHarvester(true);

      ipcRenderer
        .invoke(IPCKeys.LaunchHarvester, { ...captcha, theme })
        .then(() => setLoadingHarvester(false))
        .catch(() => setLoadingHarvester(false));
    }
  };

  const cancelLaunchHarvester = () => {
    ipcRenderer
      .invoke(IPCKeys.CancelLaunchHarvester, { ...captcha })
      .then(() => setLoadingHarvester(false))
      .catch(() => setLoadingHarvester(false));
  };

  const launchYouTubeHandler = () => {
    if (!isLoadingYouTube && !isLoadingHarvester) {
      setLoadingYoutube(true);
      ipcRenderer
        .invoke(IPCKeys.LaunchYoutube, { ...captcha })
        .then(() => setLoadingYoutube(false))
        .catch(() => setLoadingYoutube(false));
    }
  };

  const cancelLaunchYouTube = () => {
    ipcRenderer
      .invoke(IPCKeys.CancelLaunchYouTube, { ...captcha })
      .then(() => setLoadingYoutube(false))
      .catch(() => setLoadingYoutube(false));
  };

  return (
    <Grid key={captcha.id} item xs={4} md={4} lg={4} xl={4}>
      <div className={styles.root}>
        <Fade in>
          <div className={styles.background}>
            <Grid container className={styles.gridContainer} direction="row">
              <Grid container direction="column" className={styles.textHolder}>
                <Input
                  onChange={e => editHandler(e, HARVESTER_FIELDS.NAME)}
                  onBlur={() =>
                    ipcRenderer.send(IPCKeys.UpdateHarvester, {
                      ...captcha,
                      theme
                    })
                  }
                  disableUnderline
                  value={captcha.name}
                  className={styles.cardHolder}
                />
              </Grid>
            </Grid>
            <Grid container className={styles.gridContainerEnd} direction="row">
              <FormGroup classes={{ root: styles.flexFillOne }}>
                <MuiSelect
                  className={styles.input}
                  name="store"
                  placeholder="None"
                  disableUnderline
                  value={captcha.store}
                  onChange={e => editHandler(e, HARVESTER_FIELDS.STORE)}
                  defaultValue={HarvesterOptions.Shopify}
                  SelectDisplayProps={{
                    style: {
                      paddingTop: 7,
                      fontWeight: 400
                    }
                  }}
                  inputProps={{
                    classes: {
                      icon: styles.dropdownIcon
                    }
                  }}
                  IconComponent={ExpandMoreIcon}
                  MenuProps={{
                    MenuListProps: {
                      classes: {
                        root: styles.menuList
                      }
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left'
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left'
                    },
                    getContentAnchorEl: null
                  }}
                >
                  {buildMenuItems()}
                </MuiSelect>
              </FormGroup>
              <FormGroup classes={{ root: styles.flexFillTwo }}>
                <MuiSelect
                  className={styles.input}
                  name="number"
                  placeholder="Regular"
                  disableUnderline
                  value={captcha.type}
                  onChange={e => editHandler(e, HARVESTER_FIELDS.TYPE)}
                  defaultValue={HarvesterTypes.Checkout}
                  SelectDisplayProps={{
                    style: {
                      paddingTop: 7,
                      fontWeight: 400
                    }
                  }}
                  inputProps={{
                    classes: {
                      icon: styles.dropdownIcon
                    }
                  }}
                  IconComponent={ExpandMoreIcon}
                  MenuProps={{
                    MenuListProps: {
                      classes: {
                        root: styles.menuList
                      }
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left'
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left'
                    },
                    getContentAnchorEl: null
                  }}
                >
                  {captcha.store === HarvesterOptions.Shopify ? (
                    [
                      HarvesterTypes.Login,
                      HarvesterTypes.Checkout,
                      HarvesterTypes.Checkpoint
                    ].map(option => (
                      <MenuItem
                        key={option}
                        value={option}
                        className={styles.menuItem}
                      >
                        {option}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem
                      value={HarvesterTypes.Checkout}
                      className={styles.menuItem}
                    >
                      Checkout
                    </MenuItem>
                  )}
                </MuiSelect>
              </FormGroup>
            </Grid>
            <Grid container className={styles.gridContainerEnd} direction="row">
              <Input
                disableUnderline
                placeholder="192.168.X.X"
                className={styles.input}
                value={captcha.proxy}
                onChange={e => editHandler(e, HARVESTER_FIELDS.PROXY)}
                onBlur={() =>
                  ipcRenderer.send(IPCKeys.UpdateHarvester, {
                    ...captcha,
                    theme
                  })
                }
              />
            </Grid>
            <Grid container className={styles.gridContainerEnd} direction="row">
              {isLoadingYouTube ? (
                <Tooltip title="Cancel">
                  <IconButton
                    className={styles.youtubeIconWrapper}
                    onClick={cancelLaunchYouTube}
                  >
                    <LoadingIcon className={styles.youtubeIcon} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Launch YouTube">
                  <IconButton
                    className={styles.youtubeIconWrapper}
                    disabled={isLoadingYouTube}
                    onClick={launchYouTubeHandler}
                  >
                    <YouTubeIcon className={styles.youtubeIcon} />
                  </IconButton>
                </Tooltip>
              )}
              {isLoadingHarvester ? (
                <Tooltip title="Cancel">
                  <IconButton
                    className={styles.youtubeIconWrapper}
                    onClick={cancelLaunchHarvester}
                  >
                    <LoadingIcon className={styles.youtubeIcon} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Launch Harvester">
                  <IconButton
                    className={styles.youtubeIconWrapper}
                    disabled={isLoadingHarvester}
                    onClick={launchHarvesterHandler}
                  >
                    <LaunchIcon className={styles.youtubeIcon} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Delete Harvester">
                <IconButton
                  className={styles.youtubeIconWrapper}
                  onClick={closeHandler}
                >
                  <DeleteIcon className={styles.youtubeIcon} />
                </IconButton>
              </Tooltip>
            </Grid>
          </div>
        </Fade>
      </div>
    </Grid>
  );
};

export default CardComponent;
