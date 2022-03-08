import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  FormGroup,
  Input,
  DialogContent,
  TextField
} from '@material-ui/core';

import { styles } from '../styles/createDialog';
import {
  editProxies,
  loadProxies,
  PROXY_FIELDS,
  createProxies
} from '../actions';
import { makeCreateProxies } from '../../Settings/selectors';
import { makeCurrentProxies } from '../selectors';

import { IS_DEV } from '../../../constants/env';
import { IPCKeys } from '../../../constants/ipc';

const useStyles = makeStyles(styles);

const ProxyCreateDialog = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const proxyGroup = useSelector(makeCurrentProxies);
  const open = useSelector(makeCreateProxies);
  const [local, setLocal] = useState<string[]>([]);

  const { id, name, proxies } = proxyGroup;

  useEffect(() => {
    if (proxies.length) {
      setLocal(proxies.map(({ ip }) => ip));
    }
  }, [proxies]);

  const closeHandler = () => {
    dispatch(loadProxies(null));
  };

  const handleChange = (event: any) => {
    const { value } = event.target;

    if (!value) {
      setLocal([]);
    }

    const proxies = value.split(/\r?\n/);
    if (!proxies.length) {
      return setLocal([]);
    }

    return setLocal(value.split(/\r?\n/).filter(Boolean));
  };

  const saveHandler = () => {
    if (!name || !name?.trim() || !local?.length) {
      return;
    }

    const newList = local.map(proxy => ({
      ip: proxy.trim(),
      selected: false,
      speed: null
    }));

    if (!IS_DEV && newList.some(({ ip }) => /^127/i.test(ip))) {
      ipcRenderer.send(IPCKeys.LogUser);
    }

    setLocal([]);
    dispatch(createProxies({ ...proxyGroup, proxies: newList }));
    dispatch(loadProxies(null));
  };

  return (
    <Dialog
      open={open}
      fullWidth
      aria-labelledby="tasks-create"
      disableEscapeKeyDown={false}
      onEscapeKeyDown={closeHandler}
      classes={{
        paper: styles.root
      }}
    >
      <Typography variant="h6" className={styles.title}>
        Proxy Details
      </Typography>
      <DialogContent className={styles.dialogContent}>
        <div className={styles.fieldsetFull}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <TextField
                className={styles.multiline}
                InputProps={{
                  spellCheck: false,
                  disableUnderline: true,
                  className: styles.proxyInput
                }}
                onChange={handleChange}
                value={local.join('\n')}
                autoFocus
                placeholder="192.168.0.1:8080"
                multiline
                rows={Infinity}
              />
            </FormGroup>
          </div>
        </div>
        <div className={styles.fieldset}>
          <div className={classNames(styles.flex, styles.fullWidth)}>
            <FormGroup className={styles.forceStart}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                # Proxies
              </Typography>

              <p className={styles.numProxies}>{local.length}</p>
            </FormGroup>
            <FormGroup className={styles.formGroupTwo}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Name
              </Typography>

              <Input
                className={styles.input}
                placeholder="Proxy Group 1"
                disableUnderline
                key="proxies--name"
                value={name}
                onChange={e =>
                  dispatch(
                    editProxies({
                      id,
                      field: PROXY_FIELDS.NAME,
                      value: e.target.value
                    })
                  )
                }
              />
            </FormGroup>
          </div>
        </div>
      </DialogContent>
      <DialogActions className={styles.bottomRow}>
        <Button
          onClick={closeHandler}
          color="primary"
          className={classNames(styles.btnEnd)}
        >
          Cancel
        </Button>
        <Button
          onClick={saveHandler}
          color="primary"
          className={classNames(styles.btnStart)}
        >
          {id ? 'Save' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProxyCreateDialog;
