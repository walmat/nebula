import React from 'react';

import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Column, useRowSelect, useSortBy, useTable } from 'react-table';
import styled from 'styled-components';
import IndeterminateCheckbox from './IndeterminateCheckbox';
import RowTable from './RowTable';
import { TableCell } from './TableCell';

const TableRowHead = styled(TableRow)`
  background-color: #ffffff;
`;

type Props<D extends object> = {
  columns: Array<Column<D>>;
  data: D[];
};
const Table = <D extends object>({
  columns,
  data,
  skipPageReset,
  onSelect,
  onSelectAll
}: Props<D>) => {
  const selectedRowIdsInitialState = data.reduce((acc, el, i) => {
    if (el.selected === true) {
      return {
        ...acc,
        [i]: true
      };
    }

    return acc;
  }, {});

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
    state: { selectedRowIds }
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
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
        <TableBody component="div">
          {rows.map(row => {
            prepareRow(row);

            return (
              <RowTable
                {...row.getRowProps()}
                row={row}
                isSelected={selectedRowIds[row.id]}
              />
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
