import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormGroup,
  Fade,
  Switch,
  Input,
  Button
} from '@material-ui/core';
import classNames from 'classnames';
import {
  toggleField,
  editAutoSolve,
  setAutoSolveConnected,
  AUTOSOLVE_FIELDS,
  SETTINGS_FIELDS
} from '../../actions';
import { makeAutoSolve, makeAutoSolveConnected } from '../../selectors';

import { IPCKeys } from '../../../../constants/ipc';

import { openExternalUrl } from '../../../../utils/url';
import { styles } from '../../styles';

import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

const GenericSettingsDialog = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const enableAutoRestart = useSelector(
    (state: RootState) => state.Settings.enableAutoRestart
  );
  const enablePerformance = useSelector(
    (state: RootState) => state.Settings.enablePerformance
  );
  const enableNotifications = useSelector(
    (state: RootState) => state.Settings.enableNotifications
  );
  const { accessToken, apiKey } = useSelector(makeAutoSolve);
  const autoSolveConnected = useSelector(makeAutoSolveConnected);

  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [timeout, resetTimeout] = useState<any>(null);
  const [message, setMessage] = useState('');

  const connectAutoSolve = () => {
    if (!accessToken || !apiKey) {
      return;
    }

    if (!isConnecting) {
      setIsConnecting(true);

      ipcRenderer
        .invoke(IPCKeys.SetupAutoSolve, { accessToken, apiKey })
        .then(({ success, error }) => {
          setIsConnecting(false);
          if (success) {
            return dispatch(setAutoSolveConnected(true));
          }

          if (timeout) {
            clearTimeout(timeout);
          }

          if (error && typeof error === 'string') {
            setMessage(error);
            setTimeout(() => {
              clearTimeout(timeout);
              setMessage('');
              resetTimeout(null);
            }, 1500);
          }
          return dispatch(setAutoSolveConnected(false));
        })
        .catch(() => {
          return dispatch(setAutoSolveConnected(false));
        });
    }
  };

  const disconnectAutoSolve = () => {
    ipcRenderer
      .invoke(IPCKeys.SetupAutoSolve, {})
      .then(() => dispatch(setAutoSolveConnected(false)))
      .catch(() => dispatch(setAutoSolveConnected(false)));
  };

  const editAutoSolveHandler = (field: string, value: string) => {
    dispatch(editAutoSolve(field, value));
  };

  const autoRestartHandler = (event: any) => {
    dispatch(toggleField(SETTINGS_FIELDS.AUTO_RESTART));
    ipcRenderer.send(IPCKeys.ToggleAutoRestart, event.target.checked);
  };

  return (
    <Fade in>
      <DialogContent className={styles.dialog}>
        <FormControl component="fieldset" className={styles.fieldset}>
          <div className={styles.block}>
            <FormGroup>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Automatic Restart
              </Typography>

              <FormControlLabel
                className={styles.switch}
                control={
                  <Switch
                    checked={enableAutoRestart}
                    color="primary"
                    onChange={autoRestartHandler}
                  />
                }
                label={enableAutoRestart ? `Enabled` : `Disabled`}
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldset}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Application Effects
              </Typography>

              <FormControlLabel
                className={styles.switch}
                control={
                  <Switch
                    checked={enableNotifications}
                    color="primary"
                    onChange={() =>
                      dispatch(toggleField(SETTINGS_FIELDS.NOTIFICATIONS))
                    }
                  />
                }
                label={enableNotifications ? `Enabled` : `Disabled`}
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldset}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Reduced Rendering
              </Typography>

              <FormControlLabel
                className={styles.switch}
                control={
                  <Switch
                    checked={enablePerformance}
                    color="primary"
                    onChange={() =>
                      dispatch(toggleField(SETTINGS_FIELDS.PERFORMANCE))
                    }
                  />
                }
                label={enablePerformance ? `Enabled` : `Disabled`}
              />
            </FormGroup>
          </div>
        </FormControl>
        <Typography variant="caption">
          We do not gather any kind of personal information and neither do we
          sell your data. We use this information only to improve the User
          Experience and to hopefully help squash bugs.
        </Typography>
        <div className={styles.topRow}>
          <Typography
            variant="body1"
            className={classNames(
              styles.flexStart,
              styles.marginTop,
              styles.marginBottom,
              styles.subcategory,
              styles.pushRight
            )}
          >
            AYCD AutoSolve
          </Typography>
          <Fade in>
            <Typography variant="caption" className={styles.autoSolveError}>
              {message}
            </Typography>
          </Fade>
        </div>
        <FormControl component="fieldset" className={styles.autoSolveField}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Access Token
              </Typography>

              <Input
                required
                disabled={autoSolveConnected}
                placeholder="XXXX-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                disableUnderline
                className={styles.input}
                value={accessToken}
                key="settings--accessToken"
                onChange={(e: any) =>
                  editAutoSolveHandler(
                    AUTOSOLVE_FIELDS.ACCESS_TOKEN,
                    e.target.value
                  )
                }
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.autoSolveField}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                API Key
              </Typography>

              {autoSolveConnected ? (
                <Input
                  required
                  disabled={autoSolveConnected}
                  value="****-********-****-****-****-************"
                  disableUnderline
                  className={styles.input}
                  key="settings--apikey"
                />
              ) : (
                <Input
                  required
                  disabled={autoSolveConnected}
                  placeholder="XXXX-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                  disableUnderline
                  className={styles.input}
                  value={apiKey}
                  key="settings--apikey"
                  onChange={(e: any) =>
                    editAutoSolveHandler(
                      AUTOSOLVE_FIELDS.API_KEY,
                      e.target.value
                    )
                  }
                />
              )}
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetSecond}>
          <Button
            onClick={() =>
              autoSolveConnected ? disconnectAutoSolve() : connectAutoSolve()
            }
            className={styles.createBtn}
          >
            {autoSolveConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </FormControl>
        <Typography variant="caption">
          Please make sure you are familiar with AutoSolve, it&apos;s purpose,
          and how to utilize it properly <strong>before</strong> attempting to
          integrate it into Omega.
          <a
            className={styles.a}
            onClick={() => {
              openExternalUrl(
                'https://aycd.zendesk.com/hc/en-us/articles/360045923874-Supported-Bots-Nebula',
                true
              );
            }}
          >
            Learn more here..
          </a>
        </Typography>
      </DialogContent>
    </Fade>
  );
};

export default GenericSettingsDialog;
