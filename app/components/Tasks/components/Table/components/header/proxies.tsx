import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell, TableSortLabel } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

const headerProxies = ({
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
          styles.proxiesHead,
          styles.column,
          styles.noPadding
        )}
        sortDirection={orderBy === 'proxies' ? order : false}
        component="div"
        key="header--proxies"
        align="left"
        scope="col"
        padding="default"
      >
        <TableSortLabel
          classes={{
            root: styles.sortLabel
          }}
          active={orderBy === 'proxies'}
          direction={orderBy === 'proxies' ? order : ''}
          onClick={createSortHandler('proxies')}
        >
          Proxies
        </TableSortLabel>
      </TableCell>
    ),
    [order, orderBy, styles]
  );
};

export default headerProxies;
