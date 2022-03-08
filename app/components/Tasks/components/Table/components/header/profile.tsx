import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell, TableSortLabel } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

const headerProfile = ({
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
          styles.profileHead,
          styles.column,
          styles.noPadding
        )}
        sortDirection={orderBy === 'profile' ? order : false}
        component="div"
        key="header--profile"
        align="left"
        scope="col"
        padding="default"
      >
        <TableSortLabel
          classes={{
            root: styles.sortLabel
          }}
          active={orderBy === 'profile'}
          direction={orderBy === 'profile' ? order : ''}
          onClick={createSortHandler('profile')}
        >
          Profile
        </TableSortLabel>
      </TableCell>
    ),
    [order, orderBy, styles]
  );
};

export default headerProfile;
