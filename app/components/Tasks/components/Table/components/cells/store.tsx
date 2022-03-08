import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell } from '@material-ui/core';

import { MODE_ICONS } from '../icons';
import { styles } from '../../styles';

import { RootState } from '../../../../../../store/reducers';

const useStyles = makeStyles(styles);

const iconForMode = (mode: string, theme: number, classes: any) =>
  MODE_ICONS[mode] ? MODE_ICONS[mode](classes, theme) : null;

export const rowTaskStore = ({
  id,
  mode,
  store
}: {
  id: string;
  mode: string;
  store: any;
}) => {
  const styles = useStyles();

  const theme = useSelector((state: RootState) => state.Theme);

  const storeValue = store ? store.name : 'Invalid Store';
  return useMemo(
    () => (
      <TableCell
        key={`${id}--store`}
        component="div"
        variant="body"
        align="left"
        className={classnames(styles.cell, styles.store, styles.noPaddingLeft)}
      >
        {mode ? iconForMode(mode, theme, styles.modeIcon) : null}
        <span>{storeValue}</span>
      </TableCell>
    ),
    [mode, theme, storeValue, styles]
  );
};

export default rowTaskStore;
