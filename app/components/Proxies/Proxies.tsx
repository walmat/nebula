import React from 'react';
import { makeStyles } from '@material-ui/styles';

import ProxyTable from './components/Table/ProxyTable';
import ProxyActionBar from './components/ProxyActionBar';
import ProxyCreateDialog from './components/ProxyCreateDialog';

import { styles } from './styles';

const useStyles = makeStyles(styles);

const Proxies = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        <div className={styles.table}>
          <ProxyTable />
        </div>
        <ProxyActionBar />
        <ProxyCreateDialog />
      </div>
    </div>
  );
};

export default Proxies;
