export const styles = theme => ({
  tableRoot: {
    width: '100%',
    height: '100%'
  },
  modeIcon: {
    display: 'flex',
    height: 12,
    width: 'auto',
    color: theme.palette.primary.color,
    margin: 'auto 4px auto 0 !important'
  },
  sortLabel: {
    color: theme.palette.primary.color,
    '&:hover': {
      color: theme.palette.primary.color,
      opacity: 0.55
    }
  },
  numTasks: {
    display: 'flex',
    color: theme.palette.primary.color,
    flex: 0,
    marginRight: 16,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 1.43
  },
  emphasizedNumber: {
    display: 'inline-flex',
    color: '#8175F3',
    margin: '0 8px'
  },
  numSelected: {
    display: 'flex',
    color: theme.palette.primary.color,
    flex: 0,
    marginRight: 16,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 1.43
  },
  numRunning: {
    display: 'flex',
    color: theme.palette.primary.color,
    flex: 1,
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 1.43
  },
  centerCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  flex: {
    marginBottom: 16,
    marginTop: -38,
    display: 'flex'
  },
  displayFlex: {
    display: 'flex'
  },
  table: {
    height: '100%',
    minHeight: '100%',
    width: '100%',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    '&::-webkit-scrollbar': {
      display: 'none !important'
    }
  },
  tableWrapper: {
    height: 'calc(100% - 50px)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  groupPill: {
    backgroundColor: 'rgba(162, 153, 254, 0.25)',
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
    display: 'flex',
    margin: 0,
    flex: '1 1 auto',
    '&::-webkit-scrollbar': {
      display: 'none !important'
    }
  },
  control: {
    alignItems: 'flex-start',
    margin: 0
  },
  switch: {
    marginTop: -8
  },
  checkbox: {},
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
    borderRadius: '4px 4px 0 0',
    backgroundColor: theme.palette.primary.secondary
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
    border: 'none !important',
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
    textAlign: 'left',
    border: 'none !important',
    fontSize: 12,
    fontWeight: 400,
    color: theme.palette.primary.heading,
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  cellDouble: {
    padding: `0 !important`,
    display: 'flex !important',
    margin: 'auto 0',
    textAlign: 'left',
    border: 'none !important',
    fontSize: `12px !important`,
    fontWeight: 400,
    color: theme.palette.primary.heading,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    '& > *': {
      margin: 'auto 16px auto 8px',
      overflow: 'hidden'
    }
  },
  cell: {
    padding: '0 !important',
    display: 'flex !important',
    margin: 'auto 0',
    textAlign: 'left',
    border: 'none !important',
    fontSize: `12px !important`,
    fontWeight: 400,
    color: theme.palette.primary.heading,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    '& > *': {
      margin: '0 16px 0 0',
      overflow: 'hidden'
    }
  },
  productImageContainer: {
    margin: 0,
    height: 24,
    width: 'auto',
    overflow: 'visible',
    padding: 0
  },
  productImage: {
    width: 'auto',
    height: '100%',
    position: 'unset',
    borderRadius: '50%'
  },
  checkboxHead: {
    padding: '6px 14px 6px 12px'
  },
  tableHead: {
    height: 35,
    cursor: 'pointer',
    display: 'flex',
    margin: 0
  },
  storeHead: {
    display: 'flex',
    flexDirection: 'row',
    width: '20%',
    margin: 0,
    flexGrow: 2,
    marginLeft: 16
  },
  productHead: {
    display: 'flex',
    flexDirection: 'row',
    width: '25%',
    margin: 0,
    flexGrow: 3,
    marginLeft: 16
  },
  sizesHead: {
    display: 'flex',
    flexDirection: 'row',
    width: '10%',
    margin: 0,
    flexGrow: 0,
    marginLeft: 16
  },
  proxiesHead: {
    display: 'flex',
    flexDirection: 'row',
    width: '10%',
    margin: 0,
    flexGrow: 0,
    marginLeft: 16
  },
  profileHead: {
    display: 'flex',
    flexDirection: 'row',
    width: '10%',
    margin: 0,
    flexGrow: 0,
    marginLeft: 16
  },
  statusHead: {
    display: 'flex',
    flexDirection: 'row',
    width: '26.5%',
    margin: 0,
    flexGrow: 3,
    marginLeft: 16
  },
  id: {
    width: '11.5%'
  },
  store: {
    width: '20%'
  },
  product: {
    width: '25%'
  },
  sizes: {
    width: '10%'
  },
  proxies: {
    width: '10%'
  },
  profile: {
    width: '10%'
  },
  status: {
    width: '25%'
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
  purple: {
    color: '#8E83F4'
  },
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
  },
  btnEnd: {
    width: 105,
    height: 35,
    color: theme.palette.primary.color,
    backgroundColor: theme.palette.primary.secondary,
    borderRadius: 4,
    border: `1px solid ${theme.palette.primary.border}`,
    transition: theme.transitions.create(['opacity'], {
      duration: 300
    }),
    '&:hover': {
      color: theme.palette.primary.color,
      backgroundColor: theme.palette.primary.secondary,
      border: `1px solid ${theme.palette.primary.border}`,
      opacity: 0.5,
      transition: theme.transitions.create(['opacity'], {
        duration: 300
      })
    },
    '&:active': {
      color: theme.palette.primary.color,
      backgroundColor: theme.palette.primary.secondary,
      border: `1px solid ${theme.palette.primary.border}`,
      opacity: 0.5,
      transition: theme.transitions.create(['opacity'], {
        duration: 300
      })
    }
  }
});
