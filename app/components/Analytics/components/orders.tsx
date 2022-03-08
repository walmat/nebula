import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Grid } from '@material-ui/core';

import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { makeStyles } from '@material-ui/styles';
import NoChildrenComponent from '../../NoChildrenComponent';
import { imageForCard } from '../../../utils/imgForCardType';
import { styles } from '../styles/orders';
import { RootState } from '../../../store/reducers';

const useStyles = makeStyles(styles);

const OrderComponent = ({
  order: { store, product, card },
  styles
}: {
  order: any;
  styles: any;
}) => (
  <Grid container direction="row" className={styles.tableRow}>
    <Grid item className={styles.margin}>
      <Typography className={styles.store} variant="body1" title={store}>
        {store}
      </Typography>
      <Typography className={styles.product} variant="body1" title={product}>
        {product}
      </Typography>
      <Typography className={styles.card} variant="body1">
        <img alt="" src={imageForCard(card)} />
      </Typography>
    </Grid>
  </Grid>
);

const OrdersGrid = ({ orders, styles }: { orders: any[]; styles: any }) => {
  if (!orders.length) {
    return <NoChildrenComponent label="No Orders" variant="body1" />;
  }

  return (
    <div className={styles.table}>
      {orders.map(order => (
        <OrderComponent key={order.id} order={order} styles={styles} />
      ))}
    </div>
  );
};

const OrdersComponent = () => {
  const styles = useStyles();

  const orders = useSelector((state: RootState) =>
    state.Checkouts.filter((checkout: any) => checkout.delivered)
  );

  return (
    <Grid className={styles.container} item xs={3}>
      <div className={styles.root}>
        <Grid container direction="row" className={styles.gridTop}>
          <Grid item className={styles.icon}>
            <LocalShippingIcon className={styles.iconSvg} />
          </Grid>
          <Grid item>
            <Typography className={styles.welcome} variant="h6">
              <span className={styles.bold}>{orders.length}</span>
            </Typography>
            <Typography variant="body1">
              {!orders.length || orders.length > 1 ? 'Orders' : 'Order'}{' '}
              Received
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={styles.gridBottom}>
          <OrdersGrid orders={orders} styles={styles} />
        </Grid>
      </div>
    </Grid>
  );
};

export default OrdersComponent;
