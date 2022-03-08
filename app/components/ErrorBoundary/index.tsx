import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import { Typography, Button } from '@material-ui/core';

import { ipcRenderer } from 'electron';
import { EOL } from 'os';
import { log } from '../../utils/log';
import { styles } from './styles';
import { imgsrc } from '../../utils/imgsrc';
import GenerateErrorReport from './components/GenerateErrorReport';
import { IPCKeys } from '../../constants/ipc';

class ErrorBoundary extends PureComponent {
  state = {
    errorInfo: null
  };

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo
    });
    const _errorInfo = JSON.stringify(errorInfo);
    log.doLog(
      `Error boundary log capture:${EOL}${error.toString()}${EOL}${_errorInfo}`,
      true,
      error
    );
  }

  handleReload = async () => {
    try {
      const { history } = this.props;
      history.push('/');
      ipcRenderer.invoke(IPCKeys.GetCurrentWindow, 'reload');
    } catch (e) {
      log.error(e, `ErrorBoundary -> handleReload`);
    }
  };

  render() {
    const { classes: styles, children } = this.props;

    const { errorInfo } = this.state;
    if (errorInfo) {
      return (
        <div className={styles.root}>
          <img
            alt="Some Error Occured!"
            src={imgsrc('logo.png', false)}
            className={styles.bugImg}
          />
          <Typography variant="h4" className={styles.headings}>
            Uh oh!
          </Typography>
          <Typography variant="h5" className={styles.headings}>
            Looks like we ran into an issue.
          </Typography>
          <Typography variant="subtitle1" className={styles.subHeading}>
            Please send us the generated error log so that we can address this.
          </Typography>
          <GenerateErrorReport />
          <Button
            variant="outlined"
            className={styles.btnEnd}
            onClick={this.handleReload}
          >
            Return Home
          </Button>
        </div>
      );
    }

    return children;
  }
}

export default withRouter(withStyles(styles)(ErrorBoundary));
