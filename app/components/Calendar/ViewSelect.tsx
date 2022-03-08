import React from 'react';
import WindowedSelect from 'react-windowed-select';
import styled from 'styled-components';
import { FormGroup as _FormGroup } from '@material-ui/core';
import { colorStyles, IndicatorSeparator } from '../../styles/select';

const FormGroup = styled(_FormGroup)`
  flex: 1;
  display: flex;
`;

export const CALENDAR_VIEW = {
  YEAR: 'YEAR',
  MONTH: 'MONTH'
};

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: Option;
  onChange: (option: Option) => void;
};
const ViewSelect = ({ value, onChange, maxWidth }: Props) => {
  const options = [
    {
      label: 'year',
      value: CALENDAR_VIEW.YEAR
    },
    {
      label: 'month',
      value: CALENDAR_VIEW.MONTH
    }
  ];

  const style = {
    ...colorStyles(null),
    input: styles => ({
      ...styles,
      width: 'auto',
      maxWidth,
      color: '#000'
    }),
    control: styles => ({
      ...styles,
      width: 'auto',
      maxWidth,
      border: '1px solid #979797',
      height: 29,
      fontSize: 12,
      minHeight: 29,
      borderRadius: 5,
      outline: 'none',
      cursor: 'pointer',
      boxShadow: 'none',
      ':hover': {
        border: '1px solid #979797',
        cursor: 'pointer'
      }
    })
  };

  return (
    <FormGroup>
      <WindowedSelect
        required
        isClearable
        menuPortalTarget={document.body}
        menuPlacement="auto"
        classNamePrefix="select"
        placeholder="Select View"
        components={{
          IndicatorSeparator
        }}
        value={value}
        options={options}
        key="calendar--view"
        styles={style}
        onChange={onChange}
      />
    </FormGroup>
  );
};

export default ViewSelect;
