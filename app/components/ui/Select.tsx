import React from 'react';
import { Select as _MuiSelect, MenuItem as _MenuItem } from '@material-ui/core';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const MuiSelect = styled(_MuiSelect)`
  && {
    border-radius: 5;
    font-size: 12;
    padding-left: 8;
    padding-right: 8;
    font-weight: 400;
    border: 1px solid #979797;
    width: 100%;
  }
`;

const MenuItem = styled(_MenuItem)`
  && {
    padding: 4px 8px;
    font-size: 10;
    text-align: center;
  }
`;

type Item = {
  value: string;
  label: string;
};
type Props = {
  value: string;
  onChange: (e) => void;
  items: Item[];
};
const Select = ({ value, onChange, items = [] }: Props) => {
  // TODO - fix styles
  return (
    <MuiSelect
      name="number"
      placeholder="Regular"
      disableUnderline
      value={value}
      onChange={onChange}
      SelectDisplayProps={{
        style: {
          paddingTop: 7,
          fontWeight: 400
        }
      }}
      IconComponent={ExpandMoreIcon}
      MenuProps={{
        PaperProps: {
          style: {
            marginTop: 30,
            padding: 0
          }
        },
        MenuListProps: {
          style: {
            fontSize: 10,
            padding: 0
          }
        }
      }}
    >
      {items.map(({ value, label }) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </MuiSelect>
  );
};

export default Select;
