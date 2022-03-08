import React, { memo, useCallback, useMemo } from 'react';
import memoize from 'memoize-one';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { TableBody } from '@material-ui/core';

import { FixedSizeList as List, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { styles } from '../styles';
import { selectTasks } from '../../../actions';

import { makeSelectedTasksGroup } from '../../../selectors';

import EnhancedTableRow from './tableRow';

import { useTaskKeyPress } from '../../../useTaskKeyPress';

const Row = memo(
  ({ data, index, style }: { data: any; index: number; style: any }) => {
    const { tasks, group, isRangeSelecting, onRowClick } = data;

    const {
      id,
      mode,
      selected,
      store,
      product,
      sizes,
      proxies,
      profile,
      message,
      platform,
      variation,
      chosenSize,
      productName,
      productImage
    } = tasks[index];

    return (
      <div style={style}>
        <EnhancedTableRow
          id={id}
          mode={mode}
          selected={selected}
          store={store}
          product={product}
          sizes={sizes}
          proxies={proxies}
          profile={profile}
          message={message}
          platform={platform}
          variation={variation}
          chosenSize={chosenSize}
          productName={productName}
          productImage={productImage}
          isRangeSelecting={isRangeSelecting}
          onRowClick={onRowClick}
          group={group}
          index={index}
        />
      </div>
    );
  },
  areEqual
);

const useStyles = makeStyles(styles);

const createItemData = memoize(
  (tasks, group, isRangeSelecting, onRowClick) => ({
    tasks,
    group,
    isRangeSelecting,
    onRowClick
  })
);

interface TableBodyProps {
  all: boolean;
  setIsRangeSelecting: any;
  order: 'asc' | 'desc' | '';
  orderBy: string;
  isRangeSelecting: boolean;
}

function comparator(a: any, b: any, orderBy: string) {
  if (orderBy === 'store' || orderBy === 'profile') {
    return b[orderBy].name.localeCompare(a[orderBy].name);
  }

  if (orderBy === 'proxies') {
    const first = a[orderBy] ? a[orderBy].name : 'None';
    const second = b[orderBy] ? b[orderBy].name : 'None';

    if (!/none/i.test(first) && /none/i.test(second)) {
      return -1;
    }

    if (/none/i.test(first) && !/none/i.test(second)) {
      return 1;
    }

    return first.localeCompare(second);
  }

  if (orderBy === 'product') {
    return b[orderBy].raw.localeCompare(a[orderBy].raw);
  }

  if (orderBy === 'message') {
    if (!/idle/i.test(a[orderBy]) && /idle/i.test(b[orderBy])) {
      return 1;
    }

    if (/idle/i.test(a[orderBy]) && !/idle/i.test(b[orderBy])) {
      return -1;
    }

    return b[orderBy].localeCompare(a[orderBy]);
  }

  // 1-level deep comparator
  return b[orderBy].localeCompare(a[orderBy]);
}

function getComparator(
  order: 'asc' | 'desc' | '',
  orderBy: string
): (a: any[], b: any[]) => number {
  return order === 'desc'
    ? (a, b) => comparator(a, b, orderBy)
    : (a, b) => -comparator(a, b, orderBy);
}

function tableSort(array: any[], comparator: (a: any, b: any) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [any, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const TableBodyWrapper = ({
  all,
  setIsRangeSelecting,
  order,
  orderBy,
  isRangeSelecting
}: TableBodyProps) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);

  const items = useMemo(() => {
    if (orderBy) {
      return tableSort(selectedTaskGroup?.tasks, getComparator(order, orderBy));
    }

    return selectedTaskGroup?.tasks;
  }, [order, orderBy, selectedTaskGroup]);

  const onRowClick = useCallback(
    (group: string, id: string, isRangeSelecting: boolean) => {
      dispatch(selectTasks({ type: 'row', isRangeSelecting, group, id }));
    },
    [isRangeSelecting]
  );

  const itemCount = selectedTaskGroup?.tasks?.length || 0;
  const itemData = createItemData(
    items,
    selectedTaskGroup?.id,
    isRangeSelecting,
    onRowClick
  );

  useTaskKeyPress(setIsRangeSelecting, all);

  return useMemo(
    () => (
      <TableBody component="div" className={styles.tbody}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemSize={38}
              itemCount={itemCount}
              itemData={itemData}
              overscanCount={25}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </TableBody>
    ),
    [itemData, setIsRangeSelecting, isRangeSelecting, styles]
  );
};

export default TableBodyWrapper;
