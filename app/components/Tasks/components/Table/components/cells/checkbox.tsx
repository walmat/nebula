import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell, Checkbox } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

export const rowCheckbox = ({
  index,
  selected
}: {
  index: number;
  selected: boolean;
}) => {
  const styles = useStyles();

  return useMemo(
    () => (
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
          inputProps={{ 'aria-labelledby': `table-checkbox-${index}` }}
        />
      </TableCell>
    ),
    [index, selected, styles]
  );
};

export default rowCheckbox;
