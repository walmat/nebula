import React, { useMemo } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell } from '@material-ui/core';

import { styles } from '../../styles';

const useStyles = makeStyles(styles);

const makeSizes = (sizes: any[]) =>
  sizes.length > 1 ? `${sizes.join(', ')}` : sizes[0];

export const rowTaskSizes = ({
  id,
  chosenSize,
  sizes
}: {
  id: string;
  chosenSize?:
    | string
    | {
        name?: string;
      };
  sizes: string[];
}) => {
  const styles = useStyles();

  const sizesValue = makeSizes(sizes);
  return useMemo(
    () => (
      <TableCell
        key={`${id}--sizes`}
        component="div"
        variant="body"
        align="left"
        className={classnames(styles.cell, styles.sizes, styles.noPaddingLeft)}
      >
        <span>
          {chosenSize && typeof chosenSize === 'object'
            ? chosenSize.name
            : chosenSize || sizesValue}
        </span>
      </TableCell>
    ),
    [chosenSize, sizesValue, styles]
  );
};

rowTaskSizes.defaultProps = {
  chosenSize: ''
};

export default rowTaskSizes;
