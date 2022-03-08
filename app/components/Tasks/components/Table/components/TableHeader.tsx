import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { TableHead, TableRow } from '@material-ui/core';

import HeaderCheckbox from './header/checkbox';
import HeaderTaskId from './header/taskId';
import HeaderStore from './header/store';
import HeaderProduct from './header/product';
import HeaderSizes from './header/sizes';
import HeaderProxies from './header/proxies';
import HeaderProfile from './header/profile';
import HeaderStatus from './header/status';

import { selectTasks } from '../../../actions';
import { makeSelectedTasksGroup, makeTasks } from '../../../selectors';

import { styles } from '../styles';

const useStyles = makeStyles(styles);

const EnhancedTableHead = ({
  all,
  order,
  orderBy,
  onRequestSort
}: {
  all: boolean;
  order: 'asc' | 'desc' | '';
  orderBy: string;
  onRequestSort: any;
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const groups = useSelector(makeTasks);
  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);

  const onSelect = () => {
    if (all) {
      const needsSelected = Object.values(groups).find(group =>
        group.tasks.some(t => !t.selected)
      );

      if (needsSelected) {
        return Object.values(groups).map(({ id: group, tasks }) => {
          if (tasks.some(t => !t.selected)) {
            return dispatch(selectTasks({ group }));
          }

          return null;
        });
      }

      return Object.values(groups).map(({ id: group }) =>
        dispatch(selectTasks({ group }))
      );
    }
    return dispatch(selectTasks({ group: selectedTaskGroup?.id }));
  };

  const createSortHandler = (property: string) => (
    event: React.MouseEvent<unknown>
  ) => {
    event.stopPropagation();
    onRequestSort(property);
  };

  return (
    <TableHead component="div" className={styles.tableHead}>
      <TableRow
        component="div"
        className={classnames(styles.row, styles.headerRow)}
        onClick={onSelect}
      >
        <HeaderCheckbox />
        <HeaderTaskId
          order={order}
          orderBy={orderBy}
          createSortHandler={createSortHandler}
        />
        <HeaderStore
          order={order}
          orderBy={orderBy}
          createSortHandler={createSortHandler}
        />
        <HeaderProduct
          order={order}
          orderBy={orderBy}
          createSortHandler={createSortHandler}
        />
        <HeaderSizes />
        <HeaderProxies
          order={order}
          orderBy={orderBy}
          createSortHandler={createSortHandler}
        />
        <HeaderProfile
          order={order}
          orderBy={orderBy}
          createSortHandler={createSortHandler}
        />
        <HeaderStatus
          order={order}
          orderBy={orderBy}
          createSortHandler={createSortHandler}
        />
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
