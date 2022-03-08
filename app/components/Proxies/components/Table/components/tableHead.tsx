import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import classnames from 'classnames';
import {
  TableSortLabel,
  TableCell,
  TableHead,
  TableRow,
  Checkbox
} from '@material-ui/core';

import { setAllSelected } from '../../../actions';
import { styles } from '../styles';

const Columns = [
  {
    id: 'ip',
    numeric: false,
    disablePadding: false,
    label: 'IP Address'
  },
  {
    id: 'speed',
    numeric: false,
    disablePadding: false,
    label: 'Speed'
  },
  {
    id: 'use',
    numeric: false,
    disablePadding: false,
    label: 'In Use'
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Actions'
  }
];

const useStyles = makeStyles(styles);

const EnhancedTableHead = ({
  order,
  orderBy,
  onRequestSort,
  proxies
}: {
  order: 'asc' | 'desc';
  orderBy: string;
  onRequestSort: any;
  proxies: any[];
}) => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const numProxies = proxies?.length;
  const numSelected = proxies?.filter((p: any) => p.selected).length;

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
        onClick={() => dispatch(setAllSelected())}
      >
        <TableCell
          padding="none"
          component="div"
          className={classnames(
            styles.headerCell,
            styles.headerCellFirst,
            styles.column,
            styles.noGrow
          )}
        >
          <Checkbox
            color="primary"
            className={classnames(styles.checkboxHead)}
            indeterminate={numSelected > 0 && numSelected < numProxies}
            checked={numSelected > 0 && numSelected === numProxies}
          />
        </TableCell>
        {Columns.map((col, i) => (
          <TableCell
            className={classnames(
              styles.headerCell,
              i === Columns.length - 1 ? styles.headerCellLast : '',
              styles[`${col.id}Head`],
              styles.column,
              styles.noPaddingLeft
            )}
            sortDirection={orderBy === col.id ? order : false}
            component="div"
            key={col.id}
            align="left"
            scope="col"
            padding="default"
          >
            <TableSortLabel
              classes={{
                root: styles.sortLabel
              }}
              active={orderBy === col.id}
              direction={orderBy === col.id ? order : 'asc'}
              onClick={createSortHandler(col.id)}
            >
              {col.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
