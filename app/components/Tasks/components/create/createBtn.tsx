import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { styles } from '../../styles/createDialog';
import { makeProfiles } from '../../../Profiles/selectors';
import { makeCurrentTask, makeSelectedTasksGroup } from '../../selectors';
import { createTasks } from '../../actions';

import { IS_DEV } from '../../../../constants/env';

const useStyles = makeStyles(styles);

const CreateBtn = ({
  useMassVariants,
  useMocks
}: {
  useMassVariants: boolean;
  useMocks: boolean;
}) => {
  let shouldUseMocks = useMocks;
  const styles = useStyles();
  const dispatch = useDispatch();
  const task = useSelector(makeCurrentTask);
  const group: any = useSelector(makeSelectedTasksGroup);
  const profiles = useSelector(makeProfiles);

  if (!IS_DEV) {
    shouldUseMocks = false;
  }

  const handleCreateTask = useCallback(() => {
    if (!group || !task.profile) {
      return null;
    }

    if (useMassVariants) {
      const variants = task.product.raw.split(/\r?\n/).filter(Boolean);

      if (!variants || !variants?.length) {
        return null;
      }

      return variants.map((variant: any) => {
        return task.profile.map((prof: any) => {
          if (prof.value === 'All') {
            return profiles.map((profile: any) => {
              return dispatch(
                createTasks(group.id, {
                  ...task,
                  profile: {
                    id: profile.id,
                    name: profile.name
                  },
                  useMocks: shouldUseMocks,
                  product: {
                    ...task.product,
                    raw: variant,
                    variant
                  }
                })
              );
            });
          }

          return dispatch(
            createTasks(group.id, {
              ...task,
              profile: {
                id: prof.value,
                name: prof.label
              },
              useMocks: shouldUseMocks,
              product: {
                ...task.product,
                raw: variant,
                variant
              }
            })
          );
        });
      });
    }

    return task.profile.map((prof: any) => {
      if (prof.value === 'All') {
        return profiles.map((profile: any) => {
          return dispatch(
            createTasks(group.id, {
              ...task,
              profile: {
                id: profile.id,
                name: profile.name
              },
              useMocks: shouldUseMocks
            })
          );
        });
      }

      return dispatch(
        createTasks(group.id, {
          ...task,
          profile: {
            id: prof.value,
            name: prof.label
          },
          useMocks: shouldUseMocks
        })
      );
    });
  }, [group, task, useMassVariants, shouldUseMocks]);

  return (
    <Button
      onClick={handleCreateTask}
      color="primary"
      className={classNames(styles.btnStart)}
    >
      Create
    </Button>
  );
};

export default CreateBtn;
