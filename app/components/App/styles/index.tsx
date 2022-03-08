import { variables, mixins } from '../../../styles/js';

export const dark = {
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
  palette: {
    primary: {
      ...variables().styles.darkPalette
    },
    secondary: {
      ...variables().styles.secondaryColor
    }
  },
  typography: {
    useNextVariants: true,
    fontSize: variables().styles.regularFontSize,
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: variables().styles.darkPalette.background
      }
    },
    MuiTypography: {
      root: {
        color: variables().styles.darkPalette.color
      }
    },
    MuiInputBase: {
      root: {
        color: variables().styles.darkPalette.color
      },
      inputMultiline: {
        height: '100%'
      }
    },
    MuiMobileStepper: {
      root: {
        background: variables().styles.darkPalette.background
      }
    },
    MuiCheckbox: {
      root: {
        color: variables().styles.darkPalette.checkbox
      }
    },
    MuiSwitch: {
      track: {
        backgroundColor: variables().styles.darkPalette.subtext
      }
    },
    MuiDialog: {
      paper: {
        color: variables().styles.darkPalette.color,
        backgroundColor: variables().styles.darkPalette.background
      }
    },
    MuiDialogTitle: {
      root: {
        color: variables().styles.darkPalette.color
      }
    },
    MuiDialogContentText: {
      root: {
        color: variables().styles.darkPalette.subtext
      }
    }
  }
};

export const light = {
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
  palette: {
    primary: {
      ...variables().styles.lightPalette
    },
    secondary: {
      ...variables().styles.secondaryColor
    }
  },
  typography: {
    useNextVariants: true,
    fontSize: variables().styles.regularFontSize,
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(',')
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: variables().styles.lightPalette.background
      }
    },
    MuiTypography: {
      root: {
        color: variables().styles.lightPalette.color
      }
    },
    MuiInputBase: {
      root: {
        color: variables().styles.lightPalette.color
      },
      inputMultiline: {
        height: '100%'
      }
    },
    MuiMobileStepper: {
      root: {
        background: variables().styles.lightPalette.background
      }
    },
    MuiCheckbox: {
      root: {
        color: variables().styles.lightPalette.checkbox
      }
    },
    MuiSwitch: {
      track: {
        backgroundColor: variables().styles.lightPalette.subtext
      }
    },
    MuiDialog: {
      paper: {
        color: variables().styles.lightPalette.color,
        backgroundColor: variables().styles.lightPalette.background
      }
    },
    MuiDialogTitle: {
      root: {
        color: variables().styles.lightPalette.color
      }
    },
    MuiDialogContentText: {
      root: {
        color: variables().styles.lightPalette.subtext
      }
    }
  }
};

export const styles = theme => {
  return {
    root: {
      display: `flex`,
      flexDirection: 'column',
      height: `100%`,
      background: theme.palette.primary.background
    },
    noAppDrag: {
      ...mixins().appDragDisable
    },
    navBtns: {
      paddingLeft: 5
    },
    navBtnImgs: {
      height: 25,
      width: `auto`,
      ...mixins().noDrag,
      ...mixins().noselect
    },
    row: {
      display: `flex`,
      flexDirection: 'row',
      height: `100%`
    },
    col: {
      display: `flex`,
      flexDirection: 'column',
      small: {
        flexGrow: 1
      },
      extend: {
        flexGrow: 5
      }
    },
    noProfileError: {
      textAlign: `center`,
      ...mixins().center,
      ...mixins().absoluteCenter
    },
    props: {
      MuiTypography: {
        display: 'block'
      }
    }
  };
};
