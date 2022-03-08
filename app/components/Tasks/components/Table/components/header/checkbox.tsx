import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableCell, Checkbox } from '@material-ui/core';

import { styles } from '../../styles';
import { makeSelectedTasksGroup } from '../../../../selectors';

const useStyles = makeStyles(styles);

export const headerCheckbox = () => {
  const styles = useStyles();

  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);
  const numTasks = useMemo(() => {
    if (selectedTaskGroup) {
      return selectedTaskGroup.tasks.length;
    }

    return 0;
  }, [selectedTaskGroup?.id, selectedTaskGroup?.tasks]);

  const selected = useMemo(() => {
    if (selectedTaskGroup) {
      return selectedTaskGroup.tasks.filter(t => t.selected).length;
    }

    return 0;
  }, [selectedTaskGroup?.id, selectedTaskGroup?.tasks]);

  return useMemo(
    () => (
      <TableCell
        padding="none"
        component="div"
        className={classnames(
          styles.headerCell,
          styles.headerCellFirst,
          styles.column,
          styles.noGrow,
          styles.checkbox
        )}
      >
        <Checkbox
          color="primary"
          className={classnames(styles.checkboxHead)}
          indeterminate={selected > 0 && selected < numTasks}
          checked={selected > 0 && selected === numTasks}
        />
      </TableCell>
    ),
    [selected, numTasks, styles]
  );
};

export default headerCheckbox;
