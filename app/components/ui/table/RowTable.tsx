import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from './TableCell';

const RowTable = ({ row, style }) => {
  // uncomment to check which rows are rerendering
  // console.log('RowTable', { row });
  return (
    <TableRow component="div" {...row.getRowProps({ style })}>
      {row.cells.map(cell => {
        return (
          <TableCell component="div" {...cell.getCellProps()}>
            {cell.render('Cell')}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default RowTable;
