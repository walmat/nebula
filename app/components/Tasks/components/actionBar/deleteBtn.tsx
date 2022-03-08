import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Grid, Tooltip, Fade } from '@material-ui/core';
import { useConfirm } from 'material-ui-confirm';
import Delete from '@material-ui/icons/Delete';
import { log } from '../../../../utils/log';
import { styles } from '../../styles/actionBar';

import { deleteGroup, deleteTasks } from '../../actions';
import { makeSelectedTasksGroup, makeTasks } from '../../selectors';

const useStyles = makeStyles(styles);

const stopBtn = ({ all }: { all: boolean }) => {
  const styles = useStyles();
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const groups = useSelector(makeTasks);
  const selectedTaskGroup: any = useSelector(makeSelectedTasksGroup);

  const deleteHandler = async (e: any) => {
    e.stopPropagation();

    if (all) {
      try {
        await confirm({
          title: `Are you sure you want to remove all tasks and groups?`,
          description: 'This action cannot be undone.',
          confirmationText: 'Yes',
          cancellationText: 'No',
          dialogProps: {
            classes: {
              paper: styles.paperRoot
            }
          },
          confirmationButtonProps: {
            classes: {
              root: styles.confirmBtn
            },
            style: {
              width: 105,
              height: 35,
              background:
                'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
              color: '#fff'
            }
          },
          cancellationButtonProps: {
            classes: {
              root: styles.cancelBtn
            },
            style: {
              width: 105,
              height: 35
            }
          }
        });

        return Object.values(groups).forEach(({ id: group, tasks }) => {
          dispatch(deleteTasks(group, tasks, true));

          if (group !== 'default') {
            dispatch(deleteGroup(group));
          }
        });
      } catch (err) {
        if (err) {
          log.error(err, 'Tasks -> Remove All');
        }
      }

      return null;
    }

    if (!selectedTaskGroup) {
      return null;
    }

    if (
      !selectedTaskGroup?.tasks.length &&
      selectedTaskGroup.id !== 'default'
    ) {
      try {
        await confirm({
          title: `Are you sure you want to remove group "${selectedTaskGroup.name}"?`,
          description: 'This action cannot be undone.',
          confirmationText: 'Yes',
          cancellationText: 'No',
          dialogProps: {
            classes: {
              paper: styles.paperRoot
            }
          },
          confirmationButtonProps: {
            classes: {
              root: styles.confirmBtn
            },
            style: {
              width: 105,
              height: 35,
              background:
                'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
              color: '#fff'
            }
          },
          cancellationButtonProps: {
            classes: {
              root: styles.cancelBtn
            },
            style: {
              width: 105,
              height: 35
            }
          }
        });

        return dispatch(deleteGroup(selectedTaskGroup.id));
      } catch (err) {
        if (err) {
          log.error(err, 'Tasks -> Remove Group');
        }
      }

      return null;
    }

    const toDelete = selectedTaskGroup.tasks.filter((t: any) => t.selected);
    if (!toDelete?.length) {
      return null;
    }

    try {
      await confirm({
        title: `Are you sure you want to remove these tasks?`,
        description: 'This action cannot be undone.',
        confirmationText: 'Yes',
        cancellationText: 'No',
        dialogProps: {
          classes: {
            paper: styles.paperRoot
          }
        },
        confirmationButtonProps: {
          classes: {
            root: styles.confirmBtn
          },
          style: {
            width: 105,
            height: 35,
            background:
              'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
            color: '#fff'
          }
        },
        cancellationButtonProps: {
          classes: {
            root: styles.cancelBtn
          },
          style: {
            width: 105,
            height: 35
          }
        }
      });

      const toDelete = selectedTaskGroup.tasks.filter((t: any) => t.selected);

      return dispatch(deleteTasks(selectedTaskGroup.id, toDelete));
    } catch (err) {
      if (err) {
        log.error(err, 'Tasks -> Remove Tasks');
      }
      return null;
    }
  };

  const deleteMessage = !selectedTaskGroup?.tasks.length
    ? 'Remove group'
    : 'Remove task(s)';

  return (
    <Grid item xs={2} className={styles.alignCenter}>
      <Grid item className={styles.center}>
        <Tooltip
          TransitionComponent={Fade}
          placement="top"
          title={deleteMessage}
        >
          <Delete className={styles.actionIcon} onClick={deleteHandler} />
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default stopBtn;
