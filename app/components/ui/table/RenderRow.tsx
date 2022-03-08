import React, { memo } from 'react';
import { areEqual } from 'react-window';
import RowTable from './RowTable';

const RenderRow = memo(({ data, index, style }) => {
  const { prepareRow, rows, selectedRowIds } = data;
  const row = rows[index];
  prepareRow(row);

  return (
    <RowTable
      {...row.getRowProps()}
      row={row}
      isSelected={selectedRowIds[row.id]}
      style={style}
    />
  );
}, areEqual);

export default RenderRow;
