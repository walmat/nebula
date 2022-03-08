import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell, TableSortLabel } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

const headerProduct = ({
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
          styles.productHead,
          styles.column,
          styles.noPadding
        )}
        sortDirection={orderBy === 'product' ? order : false}
        component="div"
        key="header--product"
        align="left"
        scope="col"
        padding="default"
      >
        <TableSortLabel
          classes={{
            root: styles.sortLabel
          }}
          active={orderBy === 'product'}
          direction={orderBy === 'product' ? order : ''}
          onClick={createSortHandler('product')}
        >
          Product
        </TableSortLabel>
      </TableCell>
    ),
    [order, orderBy, styles]
  );
};

export default headerProduct;
