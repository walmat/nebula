/* eslint-disable react/no-children-prop */
import React, { useMemo } from 'react';
import { Provider, useSelector } from 'react-redux';
import {
  StylesProvider,
  ThemeProvider as MuiThemeProvider
} from '@material-ui/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ErrorIcon from '@material-ui/icons/Error';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from 'styled-components';
import { SnackbarProvider } from 'notistack';
import { createTheme } from '@material-ui/core/styles';
import { Store } from 'redux';
import MomentUtils from '@date-io/moment';

import { getNebulaFeatureFlags } from '../featureFlag/NebulaFeatureFlags';
import { FeatureFlagContext } from '../featureFlag/FeatureFlagContext';

import { light, dark } from './styles';
import { RootState } from '../../store/reducers';

const lightTheme = createTheme(light);
const darkTheme = createTheme(dark);

const getTheme = (type: number) => {
  switch (type) {
    case 0:
      return lightTheme;
    case 1:
      return darkTheme;
    default:
      return lightTheme;
  }
};

// this has access to redux slices
const ThemeInjector = ({ children }: { children: React.ReactNode }) => {
  const theme = useSelector((state: RootState) => state.Theme);
  const chosen = useMemo(() => getTheme(theme), [theme]);

  const notistackRef = React.createRef();
  const onClickDismiss = (key: string | number) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={chosen}>
        <MuiThemeProvider theme={chosen}>
          <SnackbarProvider
            iconVariant={{
              success: <CheckCircleIcon />,
              error: <ErrorIcon />,
              warning: <NotificationsIcon />,
              info: <HelpIcon />
            }}
            disableWindowBlurListener
            preventDuplicate
            autoHideDuration={2500}
            maxSnack={3}
            ref={notistackRef}
            action={key => (
              <IconButton onClick={onClickDismiss(key)}>
                <CloseIcon />
              </IconButton>
            )}
          >
            <MuiPickersUtilsProvider utils={MomentUtils}>
              {children}
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
        </MuiThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  );
};

type Props = {
  store: Store;
  children: React.ReactNode;
};
const Providers = ({ store, children }: Props) => {
  const features = useMemo(() => {
    return getNebulaFeatureFlags();
  }, []);

  return (
    <FeatureFlagContext.Provider value={features}>
      <Provider store={store}>
        <ThemeInjector children={children} />
      </Provider>
    </FeatureFlagContext.Provider>
  );
};

export default Providers;
