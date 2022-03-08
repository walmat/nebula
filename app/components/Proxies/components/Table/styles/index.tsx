export const styles = theme => ({
  tableRoot: {
    width: '100%',
    height: '100%'
  },
  table: {
    height: '100%',
    minHeight: '100%',
    width: '100%',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  sortLabel: {
    color: theme.palette.primary.color,
    '&:hover': {
      color: theme.palette.primary.color,
      opacity: 0.55
    },
    '&:focus': {
      color: theme.palette.primary.color,
      opacity: 0.55
    },
    '&:active': {
      color: theme.palette.primary.color,
      opacity: 0.55
    }
  },
  tableHead: {
    height: 35,
    margin: 0,
    display: 'flex'
  },
  tableWrapper: {
    height: 'calc(100% - 50px)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  list: {
    maxHeight: 656,
    '&::-webkit-scrollbar': {
      display: 'none !important'
    }
  },
  groupPill: {
    backgroundColor: theme.palette.primary.secondary,
    margin: '0 8px',
    padding: '0 8px',
    color: '#8175F3',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 500
  },
  thead: {},
  tbody: {
    width: '100%',
    flex: '1 1 auto',
    margin: 0,
    display: 'flex'
  },
  row: {
    alignItems: 'center',
    boxSizing: 'border-box',
    minWidth: '100%',
    width: '100%'
  },
  rowCheckbox: {
    padding: '6px 14px 8px 12px !important'
  },
  headerRow: {
    height: 35,
    display: 'flex',
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.secondary,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  headerCellFirst: {
    borderTopLeftRadius: 5
  },
  headerCellLast: {
    borderTopRightRadius: 5
  },
  headerCell: {
    paddingRight: 16,
    textAlign: 'left',
    border: 'none',
    fontSize: 14,
    fontWeight: 700,
    color: theme.palette.primary.heading,
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  cellCheckbox: {
    padding: `0 !important`,
    display: 'flex',
    margin: 0,
    border: 'none !important',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 400,
    color: theme.palette.primary.heading,
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  cell: {
    padding: `0 !important`,
    display: 'flex',
    margin: 'auto 0',
    textAlign: 'left',
    border: 'none !important',
    fontSize: 12,
    fontWeight: 400,
    color: theme.palette.primary.heading,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    '& > *': {
      margin: '0 16px 0 0',
      overflow: 'hidden'
    }
  },
  checkboxHead: {
    padding: '6px 14px 6px 12px'
  },
  alignCenter: {
    alignSelf: 'center'
  },
  actionIcon: {
    cursor: 'pointer',
    color: '#616161',
    height: 24,
    width: 24,
    '&:hover': {
      opacity: 0.5
    }
  },
  center: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  ip: {
    textAlign: 'left',
    width: '55%'
  },
  ipHead: {
    width: '55%'
  },
  speed: {
    width: '15%',
    marginLeft: 16
  },
  speedHead: {
    width: '14%'
  },
  use: {
    width: '15%'
  },
  useHead: {
    width: '15%'
  },
  actions: {
    width: '15%'
  },
  actionsHead: {
    width: '17%'
  },
  noGrow: {
    paddingRight: 0,
    flexGrow: 0
  },
  flexOne: {
    flexGrow: 1
  },
  flexTwo: {
    flexGrow: 2
  },
  noPaddingLeft: {
    paddingLeft: 0
  },
  noPaddingRight: {
    paddingRight: 0
  },
  noPadding: {
    padding: 0,
    margin: 0
  },
  expandingCell: {
    flex: 1
  },
  column: {},
  failed: {
    color: '#C04949'
  },
  neutral: {
    color: '#0084CA'
  },
  success: {
    color: '#49C061'
  },
  warning: {
    color: '#FFB15E'
  },
  normal: {
    color: theme.palette.primary.heading
  }
});
