import React, { useEffect, useState, memo, useCallback } from 'react';
import { ipcRenderer } from 'electron';
import memoize from 'memoize-one';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Table, TableBody } from '@material-ui/core';

import { FixedSizeList as List, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

import { styles } from './styles';

import { IPCKeys } from '../../../../constants/ipc';
import { setAllSelected, updateProxyStatus } from '../../actions';

import { makeSelectedProxyGroup } from '../../selectors';
import { makeCreateProxies } from '../../../Settings/selectors';

import EnhancedTableRow from './components/tableRow';
import EnhancedTableHead from './components/tableHead';
import EnhancedTableToolbar from './components/tableToolbar';

import NoChildrenComponent from '../../../NoChildrenComponent';

const Row = memo(
  ({ data, index, style }: { data: any; index: number; style: any }) => {
    const { group, proxies } = data;
    const proxy = proxies[index];

    return (
      <EnhancedTableRow
        group={group}
        proxy={proxy}
        index={index}
        style={style}
      />
    );
  },
  areEqual
);

function comparator(a: any[], b: any[], orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(
  order: 'asc' | 'desc',
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

const useStyles = makeStyles(styles);

const createItemData = memoize((proxies, group) => ({
  proxies,
  group
}));

const ProxyTable = () => {
  const proxiesGroup = useSelector(makeSelectedProxyGroup);
  const open = useSelector(makeCreateProxies);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = React.useState<string>('id');

  const handleRequestSort = useCallback(
    (property: string) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const dispatch = useDispatch();
  const classes = useStyles();

  const _handleKeyPress = useCallback(
    ({
      keyCode,
      shiftKey,
      ctrlKey
    }: {
      keyCode: number;
      shiftKey: boolean;
      ctrlKey: boolean;
    }) => {
      switch (keyCode) {
        case 65: {
          if (!shiftKey && !ctrlKey) {
            return;
          }

          if (open) {
            return;
          }

          dispatch(setAllSelected());
          break;
        }
        default: {
          break;
        }
      }
    },
    []
  );

  const proxyHandler = useCallback(
    () => (
      _: any,
      __: string,
      groupId: string,
      proxy: string,
      status: string
    ) => {
      dispatch(updateProxyStatus(groupId, proxy, status));
    },
    []
  );

  useEffect(() => {
    ipcRenderer.on(IPCKeys.ProxyStatus, proxyHandler);
    window.addEventListener('keydown', _handleKeyPress);

    return () => {
      ipcRenderer.removeListener(IPCKeys.ProxyStatus, proxyHandler);
      window.removeEventListener('keydown', _handleKeyPress);
    };
  });

  let proxies: any[] = [];
  if (proxiesGroup) {
    ({ proxies } = proxiesGroup);
  }

  const items = tableSort(proxies, getComparator(order, orderBy));

  const itemData = createItemData(items, proxiesGroup?.id);

  return (
    <div className={classes.tableRoot}>
      <EnhancedTableToolbar />
      <div className={classes.tableWrapper}>
        <Table className={classes.table} component="div">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            proxies={proxies}
          />
          <TableBody component="div" className={classes.tbody}>
            {proxiesGroup ? (
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    width={width}
                    itemSize={36}
                    itemCount={items.length}
                    itemData={itemData}
                    overscanCount={20}
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
            ) : (
              <NoChildrenComponent label="No Proxies" variant="body1" />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProxyTable;
