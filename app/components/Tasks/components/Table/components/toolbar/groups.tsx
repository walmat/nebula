import React, { useMemo, useCallback } from 'react';
import CreateableSelect from 'react-select/creatable';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { styles } from '../../styles/tableToolbar';

import { createGroup, selectGroup } from '../../../../actions';
import { RootState } from '../../../../../../store/reducers';

import {
  basicStyles,
  IndicatorSeparator
} from '../../../../../../styles/select';

import { makeSelectedTasksGroup, makeTasks } from '../../../../selectors';

const useStyles = makeStyles(styles);

const getTaskGroupValues = (tasks: any) =>
  Object.values(tasks).map(({ id, name }: { id: any; name: any }) => ({
    label: name,
    value: id
  }));

const getSelectedValue = (group: any) => {
  if (!group) {
    return null;
  }

  return {
    label: group?.name,
    value: group?.id
  };
};

const noOptionsMessage = () => 'No Groups';

const Groups = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.Theme);

  const tasks = useSelector(makeTasks);
  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);

  const handleCreateTaskGroup = useCallback((event: any) => {
    dispatch(createGroup(event));
  }, []);

  const handleSelectTaskGroup = useCallback((event: any) => {
    if (!event) {
      return dispatch(selectGroup(null));
    }

    return dispatch(selectGroup(event.value));
  }, []);

  const taskGroupsValues: any = useMemo(() => getTaskGroupValues(tasks), [
    Object.values(tasks).length
  ]);

  const selectedValue: any = useMemo(
    () => getSelectedValue(selectedTaskGroup),
    [selectedTaskGroup?.id]
  );

  return (
    <>
      <Typography
        className={styles.groupTitle}
        variant="subtitle1"
        id="tableTitle"
      >
        Groups:
      </Typography>
      <CreateableSelect
        createOptionPosition="first"
        isMulti={false}
        isClearable
        options={taskGroupsValues}
        placeholder="Type to create"
        noOptionsMessage={noOptionsMessage}
        onChange={handleSelectTaskGroup}
        onCreateOption={handleCreateTaskGroup}
        components={{ IndicatorSeparator }}
        styles={basicStyles(theme)}
        className={styles.selectPeriod}
        value={selectedValue}
      />
    </>
  );
};

export default Groups;
