import React from 'react';
import { ipcRenderer } from 'electron';

import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell } from '@material-ui/core';

import { IPCKeys } from '../../../../../../constants/ipc';
import {
  failedStatuses,
  warningStatuses,
  neutralStatuses,
  successStatuses,
  Platforms
} from '../../../../../../constants';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

const failedRegex = new RegExp(failedStatuses.join('|'), 'i');
const warningRegex = new RegExp(warningStatuses.join('|'), 'i');
const neutralRegex = new RegExp(neutralStatuses.join('|'), 'i');
const successRegex = new RegExp(successStatuses.join('|'), 'i');

const getMessageAction = (
  id: string,
  group: string,
  platform: string,
  message: string
) => {
  if (platform === Platforms.YeezySupply) {
    if (/passed/i.test(message)) {
      // return a function handler that launches the browser onClick
      return (e: Event) => {
        // prevent the handler from deselecting the task row
        e.stopPropagation();

        ipcRenderer.send(IPCKeys.LaunchBrowser, { group, id });
      };
    }
  }

  // return a "noop" function handler
  return () => {};
};

const getMessageClassName = (message: string) => {
  if (failedRegex.test(message)) {
    return 'failed';
  }

  if (warningRegex.test(message)) {
    return 'warning';
  }

  if (neutralRegex.test(message)) {
    return 'purple';
  }

  if (successRegex.test(message)) {
    return 'success';
  }

  return 'normal';
};

export const rowTaskStatus = ({
  id,
  group,
  platform,
  message
}: {
  id: string;
  group: string;
  platform: string;
  message: string;
}) => {
  const styles = useStyles();

  const messageAction: any = getMessageAction(id, group, platform, message);

  const messageClassName: string = getMessageClassName(message);

  return (
    <TableCell
      key={`${id}--status`}
      onClick={messageAction}
      component="div"
      variant="body"
      align="left"
      className={classnames(
        styles.cell,
        styles.status,
        styles.noPaddingLeft,
        styles[messageClassName]
      )}
    >
      <span>{message}</span>
    </TableCell>
  );
};

export default rowTaskStatus;
