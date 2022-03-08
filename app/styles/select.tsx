export const IndicatorSeparator = () => null;

export const basicStyles = (theme: number) => {
  return {
    container: (styles: any) => {
      return {
        ...styles,
        minWidth: 104,
        maxWidth: 104,
        width: 104
      };
    },
    control: (styles: any) => {
      return {
        ...styles,
        maxHeight: 29,
        minHeight: 29,
        height: 29,
        fontSize: 12,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        color: theme === 0 ? '#000' : '#fff',
        backgroundColor: theme === 0 ? '#fff' : '#2E2F34',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        boxShadow: 'none',
        ':hover': {
          border: 'none',
          cursor: 'pointer'
        }
      };
    },
    input: (styles: any) => ({
      ...styles,
      color: theme === 0 ? '#000' : '#fff'
    }),
    noOptionsMessage: (styles: any) => ({
      ...styles,
      padding: '4px 12px'
    }),
    clearIndicator: (styles: any) => ({
      ...styles,
      padding: 2
    }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      height: 29,
      minHeight: 29,
      maxHeight: 29,
      padding: 2,
      paddingTop: 4
    }),
    menuPortal: (styles: any) => ({
      ...styles,
      zIndex: 9999
    }),
    option: (styles: any, { isDisabled, isFocused, isSelected }: any) => {
      const color = theme === 0 ? '#000' : '#fff';

      if (isDisabled) {
        return {
          ...styles,
          padding: '4px 12px',
          fontSize: 12,
          fontWeight: 400,
          textOverflow: 'clip',
          whiteSpace: 'nowrap',
          backgroundColor: '#919191',
          cursor: 'not-allowed',
          outline: 'none',
          boxShadow: 'none',
          overflow: 'hidden'
        };
      }
      const retVal = {
        ...styles,
        fontSize: 12,
        fontWeight: 400,
        padding: '4px 12px',
        textOverflow: 'clip',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: 'none',
        color,
        overflow: 'hidden',
        ':active': {
          backgroundColor: '#8E83F4',
          color: '#fff'
        },
        ':selected': {
          color: '#fff'
        }
      };
      if (isFocused) {
        return {
          ...retVal,
          color: '#fff',
          backgroundColor: 'rgba(131,119,244,0.5)'
        };
      }
      if (isSelected) {
        return {
          ...retVal,
          color: '#fff',
          backgroundColor: '#8E83F4'
        };
      }
      return retVal;
    },
    valueContainer: (styles: any, { isMulti }: any) => {
      const ret = {
        ...styles,
        maxHeight: '29px',
        padding: '0 8px',
        cursor: 'pointer',
        position: 'static'
      };
      if (isMulti) {
        return {
          ...ret,
          overflowX: 'scroll',
          overflowY: 'hidden',
          flexWrap: 'nowrap',
          '::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
            background: 'transparent'
          }
        };
      }
      return ret;
    },
    singleValue: (styles: any) => ({
      ...styles,
      margin: 0,
      maxWidth: '55%',
      color: theme === 0 ? '#000' : '#fff',
      textTransform: 'capitalize',
      cursor: 'pointer'
    }),
    menu: (styles: any) => ({
      ...styles,
      maxHeight: 180,
      overflow: 'hidden',
      backgroundColor: theme === 0 ? '#fff' : '#2E2F34'
    }),
    menuList: (styles: any) => ({
      ...styles,
      maxHeight: 180,
      fontSize: 12,
      backgroundColor: theme === 0 ? '#fff' : '#2E2F34'
    })
  };
};

export const secondaryStyles = (theme: number) => {
  return {
    control: (styles: any) => {
      return {
        ...styles,
        maxWidth: 228.6,
        height: 29,
        width: 155,
        fontSize: 12,
        minHeight: 29,
        border: 'none',
        borderRadius: 5,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        color: theme === 0 ? '#000' : '#fff',
        backgroundColor: theme === 0 ? '#fff' : '#2E2F34',
        outline: 'none',
        cursor: 'pointer',
        boxShadow: 'none',
        ':hover': {
          border: 'none',
          cursor: 'pointer'
        }
      };
    },
    input: (styles: any) => ({
      ...styles,
      color: theme === 0 ? '#000' : '#fff'
    }),
    indicator: (styles: any) => ({
      ...styles,
      padding: '0 8px'
    }),
    clearIndicator: (styles: any) => ({
      ...styles,
      padding: '8px',
      paddingRight: 0
    }),
    indicatorsContainer: (styles: any) => ({
      ...styles,
      height: '100%'
    }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      color: '#979797',
      padding: '8px',
      paddingLeft: 0
    }),
    multiValueRemove: (styles: any) => ({
      ...styles,
      backgroundColor: 'rgba(164, 155, 255, 0.25)',
      color: 'rgba(131,119,244,1)',
      ':hover': {
        backgroundColor: 'rgba(164, 155, 255, 0.55)',
        color: 'rgba(131, 119, 244, 1)'
      }
    }),
    menuPortal: (styles: any) => ({
      ...styles,
      zIndex: 9999
    }),
    option: (styles: any, { isDisabled, isFocused, isSelected }: any) => {
      const color = theme === 0 ? '#000' : '#fff';

      if (isDisabled) {
        return {
          ...styles,
          fontSize: 12,
          fontWeight: 400,
          textOverflow: 'clip',
          whiteSpace: 'nowrap',
          backgroundColor: '#919191',
          cursor: 'not-allowed',
          outline: 'none',
          boxShadow: 'none',
          overflow: 'hidden'
        };
      }
      const retVal = {
        ...styles,
        fontSize: 12,
        fontWeight: 400,
        textOverflow: 'clip',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        outline: 'none',
        color,
        boxShadow: 'none',
        overflow: 'hidden',
        ':active': {
          backgroundColor: '#8E83F4',
          color: '#fff'
        },
        ':selected': {
          color: '#fff'
        }
      };
      if (isFocused) {
        return {
          ...retVal,
          color: '#fff',
          backgroundColor: 'rgba(131,119,244,0.5)'
        };
      }
      if (isSelected) {
        return {
          ...retVal,
          color: '#fff',
          backgroundColor: '#8E83F4'
        };
      }
      return retVal;
    },
    valueContainer: (styles: any, { isMulti }: any) => {
      const ret = {
        ...styles,
        maxHeight: '29px',
        padding: '0 8px',
        cursor: 'pointer',
        position: 'static'
      };
      if (isMulti) {
        return {
          ...ret,
          overflowX: 'scroll',
          overflowY: 'hidden',
          flexWrap: 'nowrap',
          '::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
            background: 'transparent'
          }
        };
      }
      return ret;
    },
    singleValue: (styles: any) => ({
      ...styles,
      margin: 0,
      maxWidth: '65%',
      color: theme === 0 ? '#000' : '#fff',
      textTransform: 'capitalize',
      cursor: 'pointer'
    }),
    menu: (styles: any) => ({
      ...styles,
      maxHeight: 180,
      overflow: 'hidden',
      backgroundColor: theme === 0 ? '#fff' : '#2E2F34'
    }),
    menuList: (styles: any) => ({
      ...styles,
      maxHeight: 180,
      fontSize: 12,
      backgroundColor: theme === 0 ? '#fff' : '#2E2F34'
    })
  };
};

export const fullWidthStyles = (theme: number) => {
  return {
    control: (styles: any) => {
      return {
        ...styles,
        border: `1px solid ${theme === 0 ? '#979797' : '#2E2F34'}`,
        height: 29,
        fontSize: 12,
        minHeight: 29,
        borderRadius: 5,
        color: theme === 0 ? '#000' : '#fff',
        backgroundColor: theme === 0 ? '#fff' : '#2E2F34',
        outline: 'none',
        cursor: 'pointer',
        boxShadow: 'none',
        ':hover': {
          border: `1px solid ${theme === 0 ? '#979797' : '#2E2F34'}`,
          cursor: 'pointer'
        }
      };
    },
    input: (styles: any) => ({
      ...styles,
      color: theme === 0 ? '#000' : '#fff'
    }),
    indicator: (styles: any) => ({
      ...styles,
      padding: '0 8px'
    }),
    clearIndicator: (styles: any) => ({
      ...styles,
      padding: '8px',
      paddingRight: 0,
      zIndex: 9999
    }),
    indicatorsContainer: (styles: any) => ({
      ...styles,
      height: '100%'
    }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      color: '#979797',
      padding: '8px',
      paddingLeft: 0
    }),
    multiValueRemove: (styles: any) => ({
      ...styles,
      backgroundColor: 'rgba(164, 155, 255, 0.25)',
      color: 'rgba(131,119,244,1)',
      ':hover': {
        backgroundColor: 'rgba(164, 155, 255, 0.55)',
        color: 'rgba(131, 119, 244, 1)'
      }
    }),
    menuPortal: (styles: any) => ({
      ...styles,
      zIndex: 9999
    }),
    option: (styles: any, { isDisabled, isFocused, isSelected }: any) => {
      const color = theme === 0 ? '#000' : '#fff';

      if (isDisabled) {
        return {
          ...styles,
          fontSize: 12,
          fontWeight: 400,
          textOverflow: 'clip',
          whiteSpace: 'nowrap',
          backgroundColor: '#919191',
          cursor: 'not-allowed',
          outline: 'none',
          boxShadow: 'none',
          overflow: 'hidden'
        };
      }
      const retVal = {
        ...styles,
        fontSize: 12,
        fontWeight: 400,
        textOverflow: 'clip',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: 'none',
        overflow: 'hidden',
        color,
        ':active': {
          backgroundColor: '#8E83F4',
          color: '#fff'
        },
        ':selected': {
          color: '#fff'
        }
      };
      if (isFocused) {
        return {
          ...retVal,
          color: '#fff',
          backgroundColor: 'rgba(131,119,244,0.5)'
        };
      }
      if (isSelected) {
        return {
          ...retVal,
          color: '#fff',
          backgroundColor: '#8E83F4'
        };
      }
      return retVal;
    },
    valueContainer: (styles: any, { isMulti }: any) => {
      const ret = {
        ...styles,
        maxHeight: '29px',
        padding: '0 8px',
        cursor: 'pointer',
        position: 'static'
      };
      if (isMulti) {
        return {
          ...ret,
          overflowX: 'scroll',
          overflowY: 'hidden',
          flexWrap: 'nowrap',
          '::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
            background: 'transparent'
          }
        };
      }
      return ret;
    },
    multiValue: (styles: any) => ({
      ...styles,
      minWidth: 'unset',
      margin: 'auto 2px',
      color: theme === 0 ? '#000' : '#fff',
      backgroundColor: theme === 0 ? '#d8d8d8' : '#616161'
    }),
    multiValueLabel: (styles: any) => ({
      ...styles,
      color: theme === 0 ? '#000' : '#fff'
    }),
    singleValue: (styles: any) => ({
      ...styles,
      margin: 0,
      maxWidth: '65%',
      color: theme === 0 ? '#000' : '#fff',
      textTransform: 'capitalize',
      cursor: 'pointer'
    }),
    menu: (styles: any) => ({
      ...styles,
      maxHeight: 180,
      overflow: 'hidden',
      backgroundColor: theme === 0 ? '#fff' : '#2E2F34'
    }),
    menuList: (styles: any) => ({
      ...styles,
      maxHeight: 180,
      fontSize: 12,
      backgroundColor: theme === 0 ? '#fff' : '#2E2F34'
    })
  };
};

export const colorStyles = (theme: number | null) => {
  return {
    control: (styles: any) => {
      return {
        ...styles,
        maxWidth: 228.6,
        border: `1px solid ${theme === 0 ? '#979797' : '#2E2F34'}`,
        color: theme === 0 ? '#000' : '#fff',
        backgroundColor: theme === 0 ? '#fff' : '#2E2F34',
        height: 29,
        fontSize: 12,
        minHeight: 29,
        borderRadius: 5,
        outline: 'none',
        cursor: 'pointer',
        boxShadow: 'none',
        ':hover': {
          border: `1px solid ${theme === 0 ? '#979797' : '#2E2F34'}`,
          cursor: 'pointer'
        }
      };
    },
    input: (styles: any) => ({
      ...styles,
      color: theme === 0 ? '#000' : '#fff'
    }),
    indicator: (styles: any) => ({
      ...styles,
      padding: '0 8px'
    }),
    clearIndicator: (styles: any) => ({
      ...styles,
      padding: '8px',
      paddingRight: 0,
      zIndex: 9999
    }),
    indicatorsContainer: (styles: any) => ({
      ...styles,
      height: '100%'
    }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      color: '#979797',
      padding: '8px',
      paddingLeft: 0
    }),
    multiValue: (styles: any) => ({
      ...styles,
      minWidth: 'unset',
      margin: 'auto 2px',
      color: theme === 0 ? '#000' : '#fff',
      backgroundColor: theme === 0 ? '#d8d8d8' : '#616161'
    }),
    multiValueLabel: (styles: any) => ({
      ...styles,
      color: theme === 0 ? '#000' : '#fff'
    }),
    multiValueRemove: (styles: any) => ({
      ...styles,
      backgroundColor: 'rgba(164, 155, 255, 0.25)',
      color: 'rgba(131,119,244,1)',
      ':hover': {
        backgroundColor: 'rgba(164, 155, 255, 0.55)',
        color: 'rgba(131, 119, 244, 1)'
      }
    }),
    menuPortal: (styles: any) => ({
      ...styles,
      zIndex: 9999
    }),
    option: (styles: any, { isDisabled, isFocused, isSelected }: any) => {
      const color = theme === 0 ? '#000' : '#fff';

      if (isDisabled) {
        return {
          ...styles,
          fontSize: 12,
          fontWeight: 400,
          textOverflow: 'clip',
          whiteSpace: 'nowrap',
          backgroundColor: '#919191',
          cursor: 'not-allowed',
          outline: 'none',
          boxShadow: 'none',
          overflow: 'hidden'
        };
      }
      const retVal = {
        ...styles,
        fontSize: 12,
        fontWeight: 400,
        textOverflow: 'clip',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        outline: 'none',
        boxShadow: 'none',
        color,
        overflow: 'hidden',
        ':active': {
          backgroundColor: '#8E83F4',
          color: '#fff'
        },
        ':selected': {
          color: '#fff'
        }
      };
      if (isFocused) {
        return {
          ...retVal,
          color: '#fff',
          backgroundColor: 'rgba(131,119,244,0.5)'
        };
      }
      if (isSelected) {
        return {
          ...retVal,
          color: '#fff',
          backgroundColor: '#8E83F4'
        };
      }
      return retVal;
    },
    valueContainer: (styles: any, { isMulti }: any) => {
      const ret = {
        ...styles,
        maxHeight: '29px',
        padding: '0 8px',
        cursor: 'pointer',
        position: 'static'
      };
      if (isMulti) {
        return {
          ...ret,
          overflowX: 'scroll',
          overflowY: 'hidden',
          flexWrap: 'nowrap',
          '::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
            background: 'transparent'
          }
        };
      }
      return ret;
    },
    singleValue: (styles: any) => ({
      ...styles,
      margin: 0,
      maxWidth: '65%',
      color: theme === 0 ? '#000' : '#fff',
      textTransform: 'capitalize',
      cursor: 'pointer'
    }),
    menu: (styles: any) => ({
      ...styles,
      maxHeight: 180,
      overflow: 'hidden',
      backgroundColor: theme === 0 ? '#fff' : '#2E2F34'
    }),
    menuList: (styles: any) => ({
      ...styles,
      maxHeight: 180,
      fontSize: 12,
      backgroundColor: theme === 0 ? '#fff' : '#2E2F34'
    })
  };
};
