import React, { PureComponent } from 'react';
import { Button } from '@material-ui/core';

export default class GenerateErrorReportBody extends PureComponent {
  render() {
    const { styles, onGenerateErrorLogs } = this.props as any;
    return (
      <React.Fragment>
        <Button
          variant="outlined"
          color="primary"
          className={styles.btnStart}
          onClick={onGenerateErrorLogs}
        >
          OPEN EMAIL CLIENT
        </Button>
      </React.Fragment>
    );
  }
}
