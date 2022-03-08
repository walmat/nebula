import React from 'react';
import { ipcRenderer } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import WindowedSelect from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  DialogContent,
  FormControl,
  FormGroup,
  Fade,
  Input,
  Button,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';

import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import {
  deleteWebhook,
  editWebhook,
  selectWebhook,
  saveWebhook,
  WEBHOOK_FIELDS
} from '../../actions';
import { makeWebhookList, makeCurrentWebhook } from '../../selectors';
import { styles } from '../../styles';

import { IPCKeys } from '../../../../constants/ipc';

import { buildWebhookOptions } from '../../../../constants';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

const WebhooksDialog = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const webhook = useSelector(makeCurrentWebhook);
  const webhooks = useSelector(makeWebhookList);
  const theme = useSelector((state: RootState) => state.Theme);

  const { id, url, name } = webhook;

  let webhookValue = null;
  if (id) {
    webhookValue = {
      value: webhook.id,
      label: webhook.name
    };
  }

  const editHandler = (field: string, value: string) => {
    dispatch(editWebhook(field, value));
  };

  const selectHandler = (event: any) => {
    if (!event) {
      return dispatch(selectWebhook(null));
    }

    const webhook = webhooks.find((w: any) => w.id === event.value);
    return dispatch(selectWebhook(webhook));
  };

  const saveHandler = () => {
    if (!name || !url) {
      return;
    }

    dispatch(saveWebhook(webhook));
  };

  const deleteHandler = () => {
    if (!id) {
      return;
    }

    dispatch(deleteWebhook(webhook));
  };

  const { declines } = webhook;

  const handleWebhookTest = () => {
    ipcRenderer.send(IPCKeys.TestWebhook, webhook);
  };

  return (
    <Fade in>
      <DialogContent className={styles.dialog}>
        <FormControl component="fieldset" className={styles.fieldSetHalfOne}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Webhook
              </Typography>

              <Input
                required
                placeholder="https://discordapp.com/api/webhooks/..."
                disableUnderline
                className={styles.input}
                value={webhook.url}
                key="webhooks--webhook"
                onChange={(e: any) =>
                  editHandler(WEBHOOK_FIELDS.URL, e.target.value)
                }
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl
          component="fieldset"
          className={styles.fieldSetWebhookName}
        >
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Name
              </Typography>

              <Input
                required
                placeholder="Nebula Webhook"
                disableUnderline
                className={styles.input}
                value={webhook.name}
                key="webhooks--name"
                onChange={(e: any) =>
                  editHandler(WEBHOOK_FIELDS.NAME, e.target.value)
                }
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetDeclines}>
          <div className={styles.block}>
            <FormGroup className={styles.formGroup}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={declines}
                    onChange={(e: any) =>
                      editHandler(WEBHOOK_FIELDS.DECLINES, e.target.checked)
                    }
                    value={declines ? 'true' : 'false'}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="subtitle2" className={styles.subtitle}>
                    Declines
                  </Typography>
                }
              />
            </FormGroup>
          </div>
        </FormControl>

        <FormControl component="fieldset" className={styles.fieldset}>
          <div className={styles.block}>
            <FormGroup>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Webhooks
              </Typography>

              <WindowedSelect
                required
                isClearable
                menuPortalTarget={document.body}
                menuPlacement="auto"
                classNamePrefix="select"
                placeholder="Choose Webhook"
                components={{
                  IndicatorSeparator
                }}
                value={webhookValue}
                options={buildWebhookOptions(webhooks)}
                key="defaults--profiles"
                styles={colorStyles(theme)}
                onChange={selectHandler}
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetSecond}>
          <Button
            onClick={handleWebhookTest}
            disabled={!webhookValue}
            className={styles.createBtnLight}
          >
            Test
          </Button>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetSecond}>
          <Button onClick={saveHandler} className={styles.createBtn}>
            {webhook.id ? 'Update' : 'Create'}
          </Button>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetSecond}>
          <Button onClick={deleteHandler} className={styles.deleteBtn}>
            Delete
          </Button>
        </FormControl>
        <Typography variant="caption">
          Webhooks are an easy way to keep track of all bot activity in one nice
          and neat place. Omega will provide you with checkout links, success
          messages, and much more!
        </Typography>
      </DialogContent>
    </Fade>
  );
};

export default WebhooksDialog;
