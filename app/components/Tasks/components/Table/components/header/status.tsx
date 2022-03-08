import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell, TableSortLabel } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

const headerStatus = ({
  order,
  orderBy,
  createSortHandler
}: {
  order: 'asc' | 'desc' | '';
  orderBy: string;
  createSortHandler: any;
}) => {
  const styles = useStyles();

  return useMemo(
    () => (
      <TableCell
        className={classnames(
          styles.headerCellLast,
          styles.headerCell,
          styles.statusHead,
          styles.column,
          styles.noPadding
        )}
        sortDirection={orderBy === 'message' ? order : false}
        component="div"
        key="header--status"
        align="left"
        scope="col"
        padding="default"
      >
        <TableSortLabel
          classes={{
            root: styles.sortLabel
          }}
          active={orderBy === 'message'}
          direction={orderBy === 'message' ? order : ''}
          onClick={createSortHandler('message')}
        >
          Status
        </TableSortLabel>
      </TableCell>
    ),
    [order, orderBy, styles]
  );
};

export default headerStatus;
