import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Table } from '@material-ui/core';

import { styles } from './styles';

import EnhancedTableBody from './components/TableBodyWrapper';
import EnhancedTableHeader from './components/TableHeader';

const useStyles = makeStyles(styles);

const TableView = ({ all }: { all: boolean }) => {
  const styles = useStyles();
  const [isRangeSelecting, setIsRangeSelecting] = useState<boolean>(false);
  const [order, setOrder] = useState<'asc' | 'desc' | ''>('');
  const [orderBy, setOrderBy] = useState<string>('');

  const handleRequestSort = useCallback(
    (property: string) => {
      const isAsc = orderBy === property && order === 'asc';
      const isDesc = orderBy === property && order === 'desc';

      if (isAsc) {
        setOrder('desc');
        setOrderBy(property);
      } else if (isDesc) {
        setOrder('');
        setOrderBy('');
      } else {
        setOrder('asc');
        setOrderBy(property);
      }
    },
    [order, orderBy]
  );

  return (
    <Table className={styles.table} component="div">
      <EnhancedTableHeader
        all={all}
        order={order}
        orderBy={orderBy}
        onRequestSort={handleRequestSort}
      />
      <EnhancedTableBody
        all={all}
        setIsRangeSelecting={setIsRangeSelecting}
        order={order}
        orderBy={orderBy}
        isRangeSelecting={isRangeSelecting}
      />
    </Table>
  );
};

export default TableView;
