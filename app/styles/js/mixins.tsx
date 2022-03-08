import { variables } from './index';

export default () => {
  return {
    noselect: {
      [`-webkitTouchCallout`]: `none`,
      [`-webkitUserSelect`]: `none`,
      [`-khtmlUserSelect`]: `none`,
      [`-mozUserSelect`]: `none`,
      [`-msUserSelect`]: `none`,
      [`userSelect`]: `none`
    },
    noDrag: {
      WebkitUserDrag: 'none',
      KhtmlUserDrag: 'none',
      MozUserDrag: 'none',
      OUserDrag: 'none',
      userDrag: 'none'
    },
    absoluteCenter: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      WebkitTransform: 'translate(-50%, -50%)',
      transform: 'translate(-50%, -50%)'
    },
    center: {
      marginLeft: `auto`,
      marginRight: `auto`
    },
    get appDragEnable() {
      return {
        [`-webkitAppRegion`]: `drag`,
        ...this.noselect
      };
    },
    appDragDisable: {
      [`-webkitAppRegion`]: `no-drag`
    },
    a: {
      cursor: `pointer`,
      textDecoration: 'none',
      color: variables().styles.secondaryColor.main
    },
    btnPositive: {
      backgroundColor: variables().styles.primaryColor.main,
      borderColor: variables().styles.primaryColor.main,
      color: variables().styles.primaryColor.secondary,
      outline: '0 !important',
      '&:hover': {
        backgroundColor: variables().styles.primaryColor.main,
        borderColor: variables().styles.primaryColor.main,
        color: variables().styles.primaryColor.secondary,
        opacity: 0.5
      },
      '&:active': {
        backgroundColor: variables().styles.primaryColor.main,
        borderColor: variables().styles.primaryColor.main,
        color: variables().styles.primaryColor.secondary,
        opacity: 0.5
      }
    },
    btnWarning: {
      backgroundColor: '#9B1D20',
      borderColor: '#9B1D20',
      color: variables().styles.primaryColor.secondary,
      outline: '0 !important',
      '&:hover': {
        backgroundColor: '#9B1D20',
        borderColor: '#9B1D20',
        color: variables().styles.primaryColor.secondary,
        opacity: 0.5
      },
      '&:active': {
        backgroundColor: '#9B1D20',
        borderColor: '#9B1D20',
        color: variables().styles.primaryColor.secondary,
        opacity: 0.5
      }
    },
    btnPositiveInverted: {
      backgroundColor: variables().styles.primaryColor.secondary,
      borderColor: variables().styles.primaryColor.main,
      color: variables().styles.primaryColor.main,
      outline: '0 !important',
      '&:hover': {
        backgroundColor: variables().styles.primaryColor.secondary,
        borderColor: variables().styles.primaryColor.main,
        color: variables().styles.primaryColor.main,
        opacity: 0.5
      },
      '&:active': {
        backgroundColor: variables().styles.primaryColor.secondary,
        borderColor: variables().styles.primaryColor.main,
        color: variables().styles.primaryColor.main,
        opacity: 0.5
      }
    },
    btnNegative: {
      color: variables().styles.primaryColor.main,
      backgroundColor: variables().styles.secondaryColor.primary,
      borderColor: variables().styles.primaryColor.main,
      '&:hover': {
        color: variables().styles.primaryColor.main,
        backgroundColor: variables().styles.secondaryColor.primary,
        borderColor: variables().styles.primaryColor.main
      },
      '&:active': {
        opacity: 0.5,
        color: variables().styles.primaryColor.main,
        backgroundColor: variables().styles.secondaryColor.primary,
        borderColor: variables().styles.primaryColor.main
      }
    }
  };
};
