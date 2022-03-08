import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';
import { Card } from '@material-ui/core';
import { space } from 'styled-system';
import { Text, Flex } from 'rebass';
import { getWeekday } from './Month';

const WeekdayGrid = styled.div`
  font-weight: 500;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 10px 5px;
  ${space}
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 10px 5px;
  height: 100%;

  & :first-child {
    grid-column: ${props => props.firstWeekday};
  }
  ${space}
`;

const DayCard = styled(Card)`
  border-radius: 10px;
  background-color: #fff;
`;

const MonthText = styled(Text)`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: #000;
`;

const YearText = styled(Text)`
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: #616161;
`;

const today = moment();

const CalendarMonth = () => {
  const month = moment().format('MMMM');
  const year = moment().format('YYYY');
  const weekdays = moment.weekdaysMin();

  const firstWeekday = getWeekday(today);

  const daysInMonth = today.daysInMonth();

  const days = Array.from(Array(daysInMonth).keys()).map(i => i + 1);

  return (
    <>
      <Flex justifyContent="center">
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Flex>
            <LeftIcon style={{ margin: 'auto 0', color: '#616161' }} />
            <MonthText>{month}</MonthText>
            <RightIcon style={{ margin: 'auto 0', color: '#616161' }} />
          </Flex>
          <YearText>{year}</YearText>
        </Flex>
      </Flex>
      <WeekdayGrid mt="16px">
        {weekdays.map(wk => (
          <Text fontSize="12px" textAlign="center" key={wk}>
            {wk.slice(0, 1)}
          </Text>
        ))}
      </WeekdayGrid>
      <DayGrid firstWeekday={firstWeekday} mt="16px">
        {days.map(d => (
          <DayCard>
            <Text fontSize="10px">{d}</Text>
          </DayCard>
        ))}
      </DayGrid>
    </>
  );
};

export default CalendarMonth;
