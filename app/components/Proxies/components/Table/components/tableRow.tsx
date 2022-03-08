import React from 'react';
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import {
  TableCell,
  TableRow,
  Checkbox,
  Grid,
  Tooltip
} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';

import LoadingIndicator from '../../../../LoadingIndicator';
import { setSelected, deleteProxy } from '../../../actions';
import { styles } from '../styles';

const useStyles = makeStyles(styles);

const ProxyTableRow = ({
  group,
  style,
  index,
  proxy
}: {
  group: string;
  style: any;
  index: number;
  proxy: any;
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const labelId = `table-checkbox-${index}`;

  const { ip, speed, inUse, selected, isLoading } = proxy;

  let messageClassName = 'normal';
  if (speed && /failed/i.test(speed)) {
    messageClassName = 'failed';
  } else if (speed && Number(speed) <= 1000) {
    messageClassName = 'success';
  } else if (speed && Number(speed) > 2500 && Number(speed) < 5000) {
    messageClassName = 'warning';
  } else if (speed && Number(speed) >= 5000) {
    messageClassName = 'failed';
  }

  const deleteHandler = async (event: any) => {
    event.stopPropagation();
    dispatch(deleteProxy(group, ip));
  };

  return (
    <TableRow
      hover
      role="checkbox"
      component="div"
      onClick={() => dispatch(setSelected(index))}
      aria-checked={selected}
      key={`proxy--${ip}`}
      selected={selected}
      style={{ ...style, display: 'flex' }}
    >
      <TableCell
        padding="none"
        component="div"
        align="left"
        variant="body"
        className={classnames(styles.noGrow, styles.cellCheckbox)}
      >
        <Checkbox
          checked={selected}
          color="primary"
          className={styles.rowCheckbox}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </TableCell>
      <TableCell
        component="div"
        variant="body"
        className={classnames(styles.cell, styles.ip, styles.noPaddingLeft)}
      >
        <span>{ip}</span>
      </TableCell>
      <TableCell
        component="div"
        variant="body"
        className={classnames(
          styles.cell,
          styles.speed,
          styles.noPaddingLeft,
          styles[messageClassName]
        )}
      >
        {isLoading ? (
          <LoadingIndicator size={16} />
        ) : (
          <span>{speed || 'N/A'}</span>
        )}
      </TableCell>
      <TableCell
        component="div"
        variant="body"
        className={classnames(styles.cell, styles.use, styles.noPaddingLeft)}
      >
        <span>{inUse ? 'Yes' : 'No'}</span>
      </TableCell>
      <TableCell
        component="div"
        variant="body"
        className={classnames(
          styles.cell,
          styles.actions,
          styles.noPaddingLeft
        )}
      >
        <Grid item className={styles.center}>
          <Tooltip placement="top" title="Remove proxy">
            <Delete className={styles.actionIcon} onClick={deleteHandler} />
          </Tooltip>
        </Grid>
      </TableCell>
    </TableRow>
  );
};

export default ProxyTableRow;
