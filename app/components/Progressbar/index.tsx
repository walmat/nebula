import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Typography } from '@material-ui/core';
import { styles } from './styles';

import { IPCKeys } from '../../constants/ipc';

class ProgressbarPage extends Component {
  initialState: {
    progressTitle: string;
    value: number;
    variant: string;
  };

  updateTitleTimeout: any;

  constructor(props: any) {
    super(props);

    this.initialState = {
      progressTitle: `Hang tight! We're downloading the update...`,
      value: 0,
      variant: `indeterminate`
    };

    this.updateTitleTimeout = null;
    this.state = {
      ...this.initialState
    };
  }

  componentWillMount() {
    ipcRenderer.on('progressBarDataCommunication', (_: any, { ...args }) => {
      console.info(`Progressbar -> data communication`, args);
      this.setState({ ...args });
    });

    if (this.updateTitleTimeout) {
      clearTimeout(this.updateTitleTimeout);
      this.updateTitleTimeout = null;
    }

    this.updateTitleTimeout = setTimeout(() => {
      this.setState({
        progressTitle: `Hang tight! We're still working on it...`
      });

      clearTimeout(this.updateTitleTimeout);

      // possible that they're experiencing network timeouts, lets let them know...
      this.updateTitleTimeout = setTimeout(() => {
        this.setState({
          progressTitle: `Possible network issues, please try again...`
        });

        setTimeout(() => {
          ipcRenderer.invoke(IPCKeys.GetCurrentWindow, 'close');
        }, 2500);
      }, 15000);
    }, 15000);
  }

  componentWillUnmount() {
    if (this.updateTitleTimeout) {
      clearTimeout(this.updateTitleTimeout);
      this.updateTitleTimeout = null;
    }
  }

  render() {
    const { classes: styles } = this.props;
    const { progressTitle, value, variant } = this.state;
    return (
      <div className={styles.root}>
        <Typography variant="h6" className={styles.progressTitle}>
          {progressTitle}
        </Typography>
        <LinearProgress color="primary" variant={variant} value={value} />
      </div>
    );
  }
}

export default withStyles(styles)(ProgressbarPage);
