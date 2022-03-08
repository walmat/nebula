import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

export const rowTaskId = ({ id }: { id: string }) => {
  const styles = useStyles();

  return useMemo(
    () => (
      <TableCell
        key={`${id}--id`}
        component="div"
        variant="body"
        align="left"
        className={classnames(styles.cell, styles.id, styles.noPaddingLeft)}
      >
        <span>{id}</span>
      </TableCell>
    ),
    [styles]
  );
};

export default rowTaskId;
