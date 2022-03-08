import React from 'react';
import { makeStyles } from '@material-ui/styles';

import { styles } from './styles';

import TableWrapper from './TableWrapper';
import TableData from './TableData';
import EnhancedTableToolbar from './components/tableToolbar';

const useStyles = makeStyles(styles);

const TaskList = ({ all, toggleAll }: { all: boolean; toggleAll: any }) => {
  const styles = useStyles();

  return (
    <>
      <TableData all={all} toggleAll={toggleAll} />
      <div className={styles.tableRoot}>
        <EnhancedTableToolbar all={all} />
        <div className={styles.tableWrapper}>
          <TableWrapper all={all} />
        </div>
      </div>
    </>
  );
};

export default TaskList;
