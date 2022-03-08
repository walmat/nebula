import React from 'react';
import { Flex, Text } from 'rebass';
import { space } from 'styled-system';
import moment, { Moment } from 'moment';
import { Card as _Card } from '@material-ui/core';
import styled from 'styled-components';

const Card = styled(_Card)`
  border-radius: 10px;
  background-color: #fff;
  line-height: 1.16;
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 10px 5px;

  & :first-child {
    grid-column: ${props => props.firstWeekday};
  }
  ${space}
`;

export const getWeekday = (date: Moment) => {
  const weekday = date.startOf('month').day() % 6;

  if (weekday === 0) {
    return 7;
  }

  return weekday;
};

type Props = {
  month: string;
};
const Month = ({ month }: Props) => {
  const year = moment().get('year');
  const months = moment.months();

  const monthIndex = months.findIndex(m => m === month);

  const weekdays = moment.weekdaysMin();

  const date = moment({
    year,
    month: monthIndex,
    day: 1
  });

  const firstWeekday = getWeekday(date);

  const daysInMonth = date.daysInMonth();

  const days = Array.from(Array(daysInMonth).keys()).map(i => i + 1);

  return (
    <Card>
      <Flex
        mt="10px"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text fontSize="10px" fontWeight="bold">
          {month}
        </Text>
        <Text fontSize="8px">{year}</Text>
      </Flex>
      <Flex flexDirection="column" ml="15px" mr="15px">
        <DayGrid mt="16px">
          {weekdays.map(wk => (
            <Text fontSize="10px" key={wk}>
              {wk.slice(0, 1)}
            </Text>
          ))}
        </DayGrid>
        <DayGrid firstWeekday={firstWeekday} mt="16px">
          {days.map(d => (
            <Text fontSize="10px" key={d}>
              {d}
            </Text>
          ))}
        </DayGrid>
      </Flex>
    </Card>
  );
};

export default Month;
