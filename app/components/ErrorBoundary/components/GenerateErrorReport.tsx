import React, { Component } from 'react';
import { shell, ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/styles';
import { log } from '../../../utils/log';
import { styles } from '../styles/GenerateErrorReport';
import { promisifiedRimraf } from '../../../api/sys';
import { fileExistsSync } from '../../../api/sys/fileOps';
import { mailTo } from '../../../constants';
import { compressFile } from '../../../utils/gzip';
import GenerateErrorReportBody from './GenerateErrorReportBody';
import { IPCKeys } from '../../../constants/ipc';

class GenerateErrorReport extends Component {
  compressLog = async () => {
    try {
      const { logFile, logFileZippedPath } = await ipcRenderer.invoke(
        IPCKeys.GetLogPath
      );

      compressFile(logFile, logFileZippedPath);
    } catch (e) {
      log.error(e, `GenerateErrorReport -> compressLog`);
    }
  };

  handleGenerateErrorLogs = async () => {
    try {
      const {
        mailToInstructions,
        logFileZippedPath
      } = await ipcRenderer.invoke(IPCKeys.GetLogPath);

      const { error } = await promisifiedRimraf(logFileZippedPath);

      if (error) {
        return null;
      }

      this.compressLog();

      if (!fileExistsSync(logFileZippedPath)) {
        return null;
      }

      if (window) {
        window.location.href = `${mailTo} ${mailToInstructions}`;
      }

      shell.showItemInFolder(logFileZippedPath);

      return true;
    } catch (e) {
      log.error(e, `GenerateErrorReport -> generateErrorLogs`);

      return null;
    }
  };

  render() {
    const { classes: styles } = this.props;
    return (
      <GenerateErrorReportBody
        styles={styles}
        onGenerateErrorLogs={this.handleGenerateErrorLogs}
      />
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators({}, dispatch);

const mapStateToProps = (state, props) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(GenerateErrorReport));
