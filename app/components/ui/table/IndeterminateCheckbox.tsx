import styled from 'styled-components';
import React, { useEffect, useRef, forwardRef } from 'react';
import _Checkbox from '@material-ui/core/Checkbox';

const Checkbox = styled(_Checkbox)`
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 10px;
  padding-right: 0px;
  margin: 0;
`;

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  const { index } = rest;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <Checkbox
        ref={resolvedRef}
        color="primary"
        inputProps={{ 'aria-labelledby': `table-checkbox-${index}` }}
        {...rest}
      />
    </>
  );
});

export default IndeterminateCheckbox;
