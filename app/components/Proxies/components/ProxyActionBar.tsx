import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { useConfirm } from 'material-ui-confirm';
import { makeStyles } from '@material-ui/styles';
import { Fade, Grid, Tooltip } from '@material-ui/core';
import WindowedSelect from 'react-windowed-select';
import Delete from '@material-ui/icons/Delete';
import Create from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';

import { ipcRenderer } from 'electron';
import SpeedIcon from '@material-ui/icons/Speed';
import { buildProxiesOptions } from '../../../constants';

import { log } from '../../../utils/log';
import { colorStyles, IndicatorSeparator } from '../../../styles/select';
import { styles } from '../styles/actionBar';

import {
  deleteProxies,
  selectProxies,
  loadProxies,
  setLoading
} from '../actions';
import { makeProxies } from '../selectors';
import { makeProxySite } from '../../Settings/selectors';
import { RootState } from '../../../store/reducers';
import { toggleField, SETTINGS_FIELDS } from '../../Settings/actions';
import { IPCKeys } from '../../../constants/ipc';

const useStyles = makeStyles(styles);

const ProxyActionBar = () => {
  const styles = useStyles();
  const confirm = useConfirm();

  const theme = useSelector((state: RootState) => state.Theme);
  const proxyGroups = useSelector(makeProxies);
  const proxySite = useSelector(makeProxySite);
  const dispatch = useDispatch();

  const selectedList = proxyGroups.find((p: any) => p.selected);

  let proxiesValue = null;
  if (selectedList && selectedList.id) {
    proxiesValue = {
      label: selectedList.name,
      value: selectedList.id
    };
  }

  let proxies: any[] = [];
  let id: string | null = null;
  if (selectedList) {
    ({ id, proxies } = selectedList);
  }

  const handleSelectProxies = (event: any) => {
    if (!event) {
      dispatch(selectProxies(event));
      return;
    }
    dispatch(selectProxies(event.value));
  };

  const handleLoadProxies = () => {
    if (!selectedList || (selectedList && !selectedList.id)) {
      return;
    }

    dispatch(loadProxies(selectedList));
  };

  const deleteHandler = async (e: any) => {
    e.stopPropagation();

    if (!selectedList) {
      return;
    }
    try {
      await confirm({
        title: `Are you sure you want to delete this proxy group?`,
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
      dispatch(deleteProxies(selectedList));
    } catch (e) {
      if (!e) {
        return;
      }

      log.error(e, 'Tasks -> Remove All Tasks Cancelled');
    }
  };

  const testAction = async () => {
    if (!proxySite) {
      return;
    }

    const { url } = proxySite;

    const selectedProxies = proxies.filter(p => p.selected);
    if (id && url) {
      dispatch(setLoading(selectedProxies));
      ipcRenderer.send(IPCKeys.RequestTestProxy, id, url, selectedProxies);
    }
  };

  return (
    <Grid container direction="row" className={styles.root}>
      <Grid item xs={12} className={styles.background}>
        <Grid item xs={2} className={styles.alignCenter}>
          <Grid item className={styles.center}>
            <Tooltip
              TransitionComponent={Fade}
              placement="top"
              title="Create proxies"
            >
              <Create
                className={styles.actionIcon}
                onClick={() =>
                  dispatch(toggleField(SETTINGS_FIELDS.CREATE_PROXIES))
                }
              />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item xs={2} className={styles.alignCenter}>
          <Grid item className={styles.center}>
            <Tooltip
              TransitionComponent={Fade}
              placement="top"
              title="Test proxies"
            >
              <SpeedIcon className={styles.actionIcon} onClick={testAction} />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item xs={2} className={styles.alignCenter}>
          <Grid item className={styles.center}>
            <Tooltip
              TransitionComponent={Fade}
              placement="top"
              title="Remove proxies"
            >
              <Delete className={styles.actionIcon} onClick={deleteHandler} />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item xs={2} className={styles.alignCenter}>
          <Grid item className={styles.center}>
            <Tooltip
              TransitionComponent={Fade}
              placement="top"
              title="Edit proxies"
            >
              <Edit className={styles.actionIcon} onClick={handleLoadProxies} />
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item xs={6} className={classnames(styles.alignCenterLast)}>
          <Grid item className={classnames(styles.center, styles.select)}>
            <WindowedSelect
              required
              isClearable
              menuPlacement="auto"
              classNamePrefix="select"
              placeholder="Select Proxies"
              className={styles.select}
              components={{
                IndicatorSeparator
              }}
              value={proxiesValue}
              options={buildProxiesOptions(proxyGroups, false)}
              key="tasks--profile"
              styles={colorStyles(theme)}
              onChange={handleSelectProxies}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProxyActionBar;
