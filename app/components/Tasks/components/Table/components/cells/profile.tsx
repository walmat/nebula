import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

export const rowTaskProduct = ({
  id,
  profile
}: {
  id: string;
  profile: any;
}) => {
  const styles = useStyles();

  return useMemo(
    () => (
      <TableCell
        key={`${id}--profile`}
        component="div"
        variant="body"
        align="left"
        className={classnames(
          styles.cell,
          styles.profile,
          styles.noPaddingLeft
        )}
      >
        <span>{profile ? profile.name : 'None'}</span>
      </TableCell>
    ),
    [profile, styles]
  );
};

export default rowTaskProduct;
