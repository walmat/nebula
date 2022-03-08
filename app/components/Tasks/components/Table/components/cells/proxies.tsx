import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

export const rowTaskProxies = ({
  id,
  proxies
}: {
  id: string;
  proxies: any;
}) => {
  const styles = useStyles();

  return useMemo(
    () => (
      <TableCell
        key={`${id}--proxies`}
        component="div"
        variant="body"
        align="left"
        className={classnames(
          styles.cell,
          styles.proxies,
          styles.noPaddingLeft
        )}
      >
        <span>{proxies ? proxies.name : 'None'}</span>
      </TableCell>
    ),
    [proxies, styles]
  );
};

export default rowTaskProxies;
