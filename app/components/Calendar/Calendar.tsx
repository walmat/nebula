import React, { useState } from 'react';
import { Text, Flex } from 'rebass';
import { Container } from './Container';
import ViewSelect, { CALENDAR_VIEW } from './ViewSelect';
import CalendarYear from './CalendarYear';
import CalendarMonth from './CalendarMonth';

const getCalendarView = view => {
  const mapping = {
    [CALENDAR_VIEW.YEAR]: CalendarYear,
    [CALENDAR_VIEW.MONTH]: CalendarMonth
  };

  return view in mapping ? mapping[view] : CalendarYear;
};

const Calendar = () => {
  const [view, setView] = useState({
    label: 'month',
    value: CALENDAR_VIEW.MONTH
  });

  const CalendarComponent = getCalendarView(view.value);

  return (
    <Container overflowY="auto">
      <Flex mb="10px">
        <Text ml="10px">Calendar</Text>
        <ViewSelect
          value={view}
          onChange={value => setView(value)}
          maxWidth="200px"
        />
      </Flex>
      <CalendarComponent />
    </Container>
  );
};

export default Calendar;
