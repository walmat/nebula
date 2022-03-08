import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell, TableSortLabel } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

export const headerTaskId = ({
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
          styles.headerCell,
          styles.headerCell,
          styles.id,
          styles.column,
          styles.noPadding
        )}
        sortDirection={orderBy === 'id' ? order : false}
        component="div"
        key="header--id"
        align="left"
        scope="col"
        padding="default"
      >
        <TableSortLabel
          classes={{
            root: styles.sortLabel
          }}
          active={orderBy === 'id'}
          direction={orderBy === 'id' ? order : ''}
          onClick={createSortHandler('id')}
        >
          Task
        </TableSortLabel>
      </TableCell>
    ),
    [order, orderBy, styles]
  );
};

export default headerTaskId;
