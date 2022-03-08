import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

const headerSizes = () => {
  const styles = useStyles();

  return useMemo(
    () => (
      <TableCell
        className={classnames(
          styles.headerCell,
          styles.headerCell,
          styles.sizesHead,
          styles.column,
          styles.noPadding
        )}
        component="div"
        key="header--sizes"
        align="left"
        scope="col"
        padding="default"
      >
        Sizes
      </TableCell>
    ),
    [styles]
  );
};

export default headerSizes;
