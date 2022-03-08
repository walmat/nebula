import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WindowedSelect from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  DialogContent,
  FormControl,
  FormGroup,
  Fade,
  Input,
  Button
} from '@material-ui/core';

import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import {
  ACCOUNT_FIELDS,
  editAccount,
  saveAccount,
  selectAccount,
  deleteAccount,
  uploadAccounts
} from '../../actions';
import { makeAccountsList, makeCurrentAccount } from '../../selectors';
import { styles } from '../../styles';

import { loadTextFile } from '../../../../utils/loadFile';
import { RootState } from '../../../../store/reducers';

import { buildAccountListOptions } from '../../../../constants';

const useStyles = makeStyles(styles);

const DefaultsSettingsDialog = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.Theme);
  const account = useSelector(makeCurrentAccount);
  const accounts = useSelector(makeAccountsList);

  const { id, name, username, password } = account;

  let accountValue = null;
  if (id) {
    accountValue = {
      value: id,
      label: name
    };
  }

  const editHandler = (field: string, value: string) => {
    dispatch(editAccount(field, value));
  };

  const selectHandler = (event: any) => {
    if (!event) {
      return dispatch(selectAccount(null));
    }

    const account = accounts.find((a: any) => a.id === event.value);
    return dispatch(selectAccount(account));
  };

  const saveHandler = () => {
    if (!name || !password || !username) {
      return;
    }

    dispatch(saveAccount(account));
  };

  const deleteHandler = () => {
    if (!id) {
      return;
    }

    dispatch(deleteAccount(account));
  };

  const uploadHandler = async () => {
    const { success, accounts } = await loadTextFile();

    if (success && accounts?.length) {
      dispatch(uploadAccounts(accounts));
    }
  };

  return (
    <Fade in>
      <DialogContent className={styles.dialog}>
        <FormControl component="fieldset" className={styles.accountFieldOne}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Username
              </Typography>

              <Input
                required
                placeholder="johnsmith@gmail.com"
                disableUnderline
                className={styles.input}
                value={username}
                key="account--username"
                onChange={(e: any) =>
                  editHandler(ACCOUNT_FIELDS.USERNAME, e.target.value)
                }
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.accountFieldTwo}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Password
              </Typography>

              <Input
                required
                placeholder="*************"
                disableUnderline
                className={styles.input}
                value={password}
                key="account--password"
                onChange={(e: any) =>
                  editHandler(ACCOUNT_FIELDS.PASSWORD, e.target.value)
                }
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.accountFieldThree}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Name
              </Typography>

              <Input
                required
                placeholder="Undefeated Acc 1"
                disableUnderline
                className={styles.input}
                value={name}
                key="account--name"
                onChange={(e: any) =>
                  editHandler(ACCOUNT_FIELDS.NAME, e.target.value)
                }
              />
            </FormGroup>
          </div>
        </FormControl>

        <FormControl component="fieldset" className={styles.fieldSetFirst}>
          <div className={styles.block}>
            <FormGroup>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Accounts
              </Typography>

              <WindowedSelect
                required
                isClearable
                menuPortalTarget={document.body}
                menuPlacement="auto"
                classNamePrefix="select"
                placeholder="Choose Account"
                components={{
                  IndicatorSeparator
                }}
                value={accountValue}
                options={buildAccountListOptions(accounts, false)}
                key="account--accounts"
                styles={colorStyles(theme)}
                onChange={selectHandler}
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetSecond}>
          <Button onClick={saveHandler} className={styles.createBtn}>
            {id ? 'Update' : 'Create'}
          </Button>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetSecond}>
          <Button onClick={deleteHandler} className={styles.deleteBtn}>
            Delete
          </Button>
        </FormControl>
        <Typography variant="caption">
          Accounts are sometimes needed for authentication into a certain site.
          Keep a list of them here and simply choose them when creating tasks to
          use that account. If you happen to have a list of accounts formatted
          as <strong>username:password</strong> on new lines,
          <a className={styles.a} onClick={uploadHandler}>
            upload them here...
          </a>
        </Typography>
      </DialogContent>
    </Fade>
  );
};

export default DefaultsSettingsDialog;
