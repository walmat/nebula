import React from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Typography, Grid, Tooltip, Fade } from '@material-ui/core';
import { orderBy, isPlainObject } from 'lodash';
import { useConfirm } from 'material-ui-confirm';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/styles';
import NoChildrenComponent from '../../NoChildrenComponent';
import { imageForCard } from '../../../utils/imgForCardType';
import { styles } from '../styles/checkouts';

import { setAnalyticsFile } from '../../Settings/actions';
import { loadCSVFile } from '../../../utils/loadFile';
import { RootState } from '../../../store/reducers';

const useStyles = makeStyles(styles);

const CheckoutComponent = ({
  checkout,
  style
}: {
  checkout: any;
  style: any;
}) => {
  const styles = useStyles();

  let storeValue = checkout.store;
  if (isPlainObject(storeValue)) {
    storeValue = checkout.store.name;
  }

  let productValue = checkout.product;
  if (isPlainObject(productValue)) {
    productValue = checkout.product.name;
  }

  let cardValue = checkout.card;
  if (!cardValue && checkout.profile) {
    cardValue = checkout.profile.type;
  }

  return (
    <Grid
      style={{ ...style, padding: '2px 12px 2px 12px' }}
      container
      direction="row"
    >
      <Grid item style={{ width: '100%', maxWidth: '100%', display: 'flex' }}>
        <Tooltip TransitionComponent={Fade} title={storeValue}>
          <Typography
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 10,
              flex: 1,
              maxWidth: '25%',
              alignItems: 'flex-start',
              alignSelf: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              '& > *': {
                margin: '0 16px 0 0',
                overflow: 'hidden'
              }
            }}
            component="div"
            variant="body1"
          >
            <span>{storeValue}</span>
          </Typography>
        </Tooltip>
        <Tooltip TransitionComponent={Fade} title={productValue}>
          <Typography
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 10,
              flex: 2,
              alignItems: 'flex-start',
              alignSelf: 'center',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              margin: 'auto 8px'
            }}
            variant="body1"
          >
            {productValue}
          </Typography>
        </Tooltip>
        <Typography
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            fontSize: 10,
            alignItems: 'flex-end',
            alignSelf: 'center',
            whiteSpace: 'nowrap',
            margin: '0'
          }}
          variant="body1"
          title={cardValue || ''}
        >
          {cardValue ? (
            <img
              className={styles.cardType}
              alt=""
              src={imageForCard(cardValue)}
            />
          ) : null}
        </Typography>
      </Grid>
    </Grid>
  );
};

type RowProps = {
  data: any[];
  index: number;
  style: any;
};

const Row = ({ data, index, style }: RowProps) => {
  const checkout = data[index];
  return (
    <CheckoutComponent
      key={checkout?.id || checkout?._id?.toString()}
      checkout={checkout}
      style={style}
    />
  );
};

const CheckoutsLoader = ({ checkouts }: { checkouts: any[] }) => (
  <AutoSizer>
    {({ height, width }) => (
      <List
        className="checkouts--list"
        height={height}
        itemCount={checkouts.length}
        itemSize={24}
        width={width}
        itemData={checkouts}
      >
        {Row}
      </List>
    )}
  </AutoSizer>
);

const CheckoutsGrid = ({ checkouts }: { checkouts: any[] }) => {
  if (!checkouts.length) {
    return <NoChildrenComponent label="No Checkouts" variant="body1" />;
  }

  return <CheckoutsLoader checkouts={checkouts} />;
};

const CheckoutsComponent = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const file = useSelector((state: RootState) => state.Settings.analyticsFile);
  const checkouts = useSelector((state: RootState) =>
    orderBy(
      state.Checkouts.filter((checkout: any) => checkout.success),
      checkout => Number(checkout.date),
      'desc'
    )
  );

  const attachFile = async () => {
    if (file) {
      try {
        await confirm({
          title: `Are you sure you want to detach the analytics file?`,
          description: `File location: ${file}`,
          confirmationText: 'Yes',
          cancellationText: 'No',
          dialogProps: {
            classes: {
              paper: styles.paperRoot
            }
          },
          confirmationButtonProps: {
            classes: {
              root: styles.confirmBtn
            },
            style: {
              width: 105,
              height: 35,
              background:
                'linear-gradient(90deg, rgba(131,119,244,1) 0%, rgba(164,155,255,1) 100%)',
              color: '#fff'
            }
          },
          cancellationButtonProps: {
            classes: {
              root: styles.cancelBtn
            },
            style: {
              width: 105,
              height: 35
            }
          }
        });

        return dispatch(setAnalyticsFile(''));
      } catch (e) {
        // noop...
      }

      return null;
    }

    const path = await loadCSVFile();
    if (!path) {
      return;
    }

    return dispatch(setAnalyticsFile(path));
  };

  return (
    <Grid className={styles.container} item xs={3}>
      <div className={styles.root}>
        <Grid container direction="row" className={styles.gridTop}>
          <Grid item className={styles.icon}>
            {file ? (
              <Tooltip title={`File loaded: ${file}`}>
                <FileCopyIcon
                  className={
                    file
                      ? classnames(styles.activeIcon, styles.iconSvg)
                      : styles.iconSvg
                  }
                  onClick={attachFile}
                />
              </Tooltip>
            ) : (
              <DoneIcon className={styles.iconSvg} onClick={attachFile} />
            )}
          </Grid>
          <Grid item>
            <Typography className={styles.welcome} variant="h6">
              <span className={styles.bold}>{checkouts.length}</span>
            </Typography>
            <Typography variant="body1">
              Total{' '}
              {!checkouts.length || checkouts.length > 1
                ? 'Checkouts'
                : 'Checkout'}
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={styles.gridBottom}>
          <CheckoutsGrid checkouts={checkouts} />
        </Grid>
      </div>
    </Grid>
  );
};

export default CheckoutsComponent;
