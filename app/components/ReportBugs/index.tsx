import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Helmet } from 'react-helmet';
import GenerateErrorReport from '../ErrorBoundary/components/GenerateErrorReport';
import { APP_NAME } from '../../constants/meta';
import { styles } from './styles';

const useStyles = makeStyles(styles);

const ReportBugsPage = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Helmet titleTemplate={`%s - ${APP_NAME}`}>
        <title>Report Bugs</title>
      </Helmet>
      <GenerateErrorReport />
    </div>
  );
};

export default ReportBugsPage;
