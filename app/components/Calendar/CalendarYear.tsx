import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Month from './Month';

const AnnualGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 25px;
`;

const CalendarYear = () => {
  const months = moment.months();

  return (
    <AnnualGrid>
      {months.map((month, i) => (
        <Month key={month} month={month} monthIndex={i} />
      ))}
    </AnnualGrid>
  );
};

export default CalendarYear;
