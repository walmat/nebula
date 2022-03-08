/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useDispatch, useStore } from 'react-redux';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  DialogContent,
  FormControl,
  FormGroup,
  Fade,
  Button,
  Tooltip
} from '@material-ui/core';

import loadFile from '../../../utils/loadFile';
import saveFile from '../../../utils/saveFile';

import { importTasks } from '../../Tasks/actions';
import { importProfiles } from '../../Profiles/actions';
import { importAccounts } from '../../Settings/actions';
import { importAll } from '../../App/actions';

import { styles } from '../styles';

const onExport = ({ state }: { state: any }) => {
  if (!state) {
    return;
  }

  return saveFile(state);
};

const useStyles = makeStyles(styles);

const ImportExportDialogContent = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const store = useStore();
  const state = store.getState();

  const { Tasks, Profiles, Accounts } = state;

  const { News, Checkouts, Stores, User, ...rest } = state;

  const importHandler = async (type: string) => {
    const { success, data } = await loadFile(type);

    if (success) {
      switch (type) {
        case 'accounts':
          return dispatch(importAccounts(data));

        case 'profiles':
          return dispatch(importProfiles(data));

        case 'tasks':
          return dispatch(importTasks(data));

        case 'all':
          return dispatch(importAll(data));

        default:
          break;
      }
    }
    return null;
  };

  return (
    <Fade in>
      <DialogContent className={styles.dialog}>
        <FormControl component="fieldset" className={styles.fieldset}>
          <div className={styles.block}>
            <FormGroup>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Profiles
              </Typography>

              <div className={styles.flexRow}>
                <Button
                  onClick={() => importHandler('profiles')}
                  color="primary"
                  className={classNames(
                    styles.btnPositive,
                    styles.fieldSetFirst,
                    styles.flexRow
                  )}
                >
                  Import
                </Button>

                {Profiles.length ? (
                  <Button
                    onClick={() => onExport({ state: Profiles })}
                    color="primary"
                    className={classNames(
                      styles.btnWarning,
                      styles.fieldSetSecond,
                      styles.flexRow
                    )}
                  >
                    Export
                  </Button>
                ) : (
                  <Tooltip title="Please add some profiles in order to export">
                    <Button
                      onClick={() => {}}
                      color="primary"
                      className={classNames(
                        styles.btnWarning,
                        styles.fieldSetSecond,
                        styles.flexRow
                      )}
                    >
                      Export
                    </Button>
                  </Tooltip>
                )}
              </div>
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldset}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Accounts
              </Typography>

              <div className={styles.flexRow}>
                <Button
                  onClick={() => importHandler('accounts')}
                  color="primary"
                  className={classNames(
                    styles.btnPositive,
                    styles.fieldSetFirst,
                    styles.flexRow
                  )}
                >
                  Import
                </Button>

                {Accounts.length ? (
                  <Button
                    onClick={() => onExport({ state: Accounts })}
                    color="primary"
                    className={classNames(
                      styles.btnWarning,
                      styles.fieldSetSecond,
                      styles.flexRow
                    )}
                  >
                    Export
                  </Button>
                ) : (
                  <Tooltip title="Please add some accounts in order to export">
                    <Button
                      onClick={() => {}}
                      color="primary"
                      className={classNames(
                        styles.btnWarning,
                        styles.fieldSetSecond,
                        styles.flexRow
                      )}
                    >
                      Export
                    </Button>
                  </Tooltip>
                )}
              </div>
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldset}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Tasks
              </Typography>

              <div className={styles.flexRow}>
                <Button
                  onClick={() => importHandler('tasks')}
                  color="primary"
                  className={classNames(
                    styles.btnPositive,
                    styles.fieldSetFirst,
                    styles.flexRow
                  )}
                >
                  Import
                </Button>

                {!isEmpty(Tasks) ? (
                  <Button
                    onClick={() => onExport({ state: Tasks })}
                    color="primary"
                    className={classNames(
                      styles.btnWarning,
                      styles.fieldSetSecond,
                      styles.flexRow
                    )}
                  >
                    Export
                  </Button>
                ) : (
                  <Tooltip title="Please add some tasks in order to export">
                    <Button
                      onClick={() => {}}
                      color="primary"
                      className={classNames(
                        styles.btnWarning,
                        styles.fieldSetSecond,
                        styles.flexRow
                      )}
                    >
                      Export
                    </Button>
                  </Tooltip>
                )}
              </div>
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldset}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                All Data
              </Typography>

              <div className={styles.flexRow}>
                <Button
                  onClick={() => importHandler('all')}
                  color="primary"
                  className={classNames(
                    styles.btnPositive,
                    styles.fieldSetFirst,
                    styles.flexRow
                  )}
                >
                  Import
                </Button>

                <Button
                  onClick={() => onExport({ state: rest })}
                  color="primary"
                  className={classNames(
                    styles.btnWarning,
                    styles.fieldSetSecond,
                    styles.flexRow
                  )}
                >
                  Export
                </Button>
              </div>
            </FormGroup>
          </div>
        </FormControl>
        <Typography variant="caption">
          Please double check the information you load into Omega. We cover most
          inconsistencies, but we cannot guarantee data that isn&apos;t exported
          from us directly to be sanitized and correct. Also, please be aware
          that your current state <strong>will not</strong> be overwitten during
          the process of importing data.
        </Typography>
      </DialogContent>
    </Fade>
  );
};

export default ImportExportDialogContent;
