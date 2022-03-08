import React, { useMemo } from 'react';
import SettingsDialog from './components/dialog';

const Settings = ({
  show,
  toggleSettings
}: {
  show: boolean;
  toggleSettings: Function;
}) => {
  return useMemo(
    () => (
      <SettingsDialog open={show} onDialogBoxCloseBtnClick={toggleSettings} />
    ),
    [show]
  );
};

export default Settings;
