import React from 'react';
import styled from 'styled-components';
import { layout } from 'styled-system';

export const Root = styled.div`
  width: 100%;
  margin: 35px;
  margin-top: 55px;
  display: flex;
  flex-direction: column;
`;
export const Grid = styled.div`
  height: 100%;
  width: 100%;
`;
export const TableContainer = styled.div`
  height: 100%;
  &::-webkit-scrollbar: {
    display: none;
  }
  ${layout}
  overflow-y: hidden;
`;
type Props = {
  children: React.ReactNode;
};
export const Container = ({ children, ...rest }: Props) => {
  return (
    <Root>
      <Grid>
        <TableContainer {...rest}>{children}</TableContainer>
      </Grid>
    </Root>
  );
};
