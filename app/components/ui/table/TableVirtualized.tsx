import React, { useMemo, useRef, useEffect } from 'react';

import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {
  Column,
  useRowSelect,
  useSortBy,
  useTable,
  useBlockLayout
} from 'react-table';
import styled from 'styled-components';
import { FixedSizeList } from 'react-window';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import { TableCell } from './TableCell';
import RenderRow from './RenderRow';

const TableRowHead = styled(TableRow)`
  background-color: #ffffff;
`;

type Props<D extends object> = {
  columns: Array<Column<D>>;
  data: D[];
};
const TableVirtualized = <D extends object>(props: Props<D>) => {
  const { columns, data, onSelect, onSelectAll } = props;
  const selectedRowIdsInitialState = useMemo(() => {
    return data.reduce((acc, el, i) => {
      if (el.selected === true) {
        return {
          ...acc,
          [i]: true
        };
      }

      return acc;
    }, {});
  }, [data]);

  // used to avoid causing double rerender when updating data
  const skipPageResetRef = useRef<boolean>(false);
  useEffect(() => {
    // After the table has updated, always remove the flag
    skipPageResetRef.current = false;
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    totalColumnsWidth,
    state: { selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageResetRef.current,
      autoResetExpanded: !skipPageResetRef.current,
      autoResetGroupBy: !skipPageResetRef.current,
      autoResetSortBy: !skipPageResetRef.current,
      autoResetFilters: !skipPageResetRef.current,
      autoResetRowState: !skipPageResetRef.current,
      // autoResetSelectedRows: !skipPageResetRef.current,
      initialState: {
        selectedRowIds: selectedRowIdsInitialState
      }
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
    },
    useSortBy,
    useRowSelect,
    useBlockLayout,
    hooks => {
      hooks.allColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox.  Pagination is a problem since this will select all
          // rows even though not all rows are on the current page.  The solution should
          // be server side pagination.  For one, the clients should not download all
          // rows in most cases.  The client should only download data for the current page.
          // In that case, getToggleAllRowsSelectedProps works fine.
          Header: ({ getToggleAllRowsSelectedProps }) => {
            const toggleAllRowsSelectedProps = getToggleAllRowsSelectedProps();

            const onChange = e => {
              skipPageResetRef.current = true;
              onSelectAll(e);
              toggleAllRowsSelectedProps.onChange(e);
            };

            return (
              <div>
                <IndeterminateCheckbox
                  {...toggleAllRowsSelectedProps}
                  onChange={onChange}
                />
              </div>
            );
          },
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => {
            const toggleRowSelectedProps = row.getToggleRowSelectedProps();

            const onChange = e => {
              skipPageResetRef.current = true;
              toggleRowSelectedProps.onChange(e);
              onSelect(row.original, e);
            };

            return (
              <div>
                <IndeterminateCheckbox
                  index={row.index}
                  {...toggleRowSelectedProps}
                  onChange={onChange}
                />
              </div>
            );
          }
        },
        ...columns
      ]);
    }
  );

  const itemData = useMemo(() => {
    return {
      prepareRow,
      rows,
      selectedRowIds
    };
  }, [prepareRow, rows, selectedRowIds]);

  return (
    <TableContainer>
      <MuiTable component="div" {...getTableProps()}>
        <TableHead component="div">
          {headerGroups.map(headerGroup => (
            <TableRowHead
              component="div"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map(column => (
                <TableCell
                  component="div"
                  {...(column.id === 'selection'
                    ? column.getHeaderProps()
                    : column.getHeaderProps(column.getSortByToggleProps()))}
                >
                  {column.render('Header')}
                  {column.id !== 'selection' ? (
                    <TableSortLabel
                      active={column.isSorted}
                      // react-table has a unsorted state which is not treated here
                      direction={column.isSortedDesc ? 'desc' : 'asc'}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRowHead>
          ))}
        </TableHead>
        <TableBody component="div" {...getTableBodyProps()}>
          <FixedSizeList
            height={400}
            width={totalColumnsWidth}
            itemCount={rows.length}
            itemSize={36}
            itemData={itemData}
          >
            {RenderRow}
          </FixedSizeList>
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default TableVirtualized;
