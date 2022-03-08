import React from 'react';
import { useSelector } from 'react-redux';
import { sortBy } from 'lodash';
import moment from 'moment';
import { Typography, Grid } from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';

import NoChildrenComponent from '../../NoChildrenComponent';
import { styles } from '../styles/news';

const typeColors: any = {
  UPDATE: '#58D67D',
  DROP: '#9389F9'
};

const messages: any = {
  UPDATE: ' - Update - ',
  DROP: ' - Drop - '
};

const useStyles = makeStyles(styles);

const NewsRow = ({
  news: { date, type, message },
  styles
}: {
  news: any;
  styles: any;
}) => {
  return (
    <Grid container direction="row" className={styles.newsItem}>
      <Grid item className={styles.flexFirst}>
        <div
          className={styles.status}
          style={{ backgroundColor: typeColors[type] }}
        />
        <Typography className={styles.date} component="div" variant="body1">
          {moment(Number(date)).format('MM/DD')}
        </Typography>
        <Typography
          className={styles.messageBuffer}
          component="div"
          variant="body1"
        >
          {messages[type]}
        </Typography>
        <Typography className={styles.message} component="span" variant="body1">
          {message}
        </Typography>
      </Grid>
    </Grid>
  );
};

const NewsGrid = () => {
  const styles = useStyles();
  const news = useSelector(({ News }: { News: any[] }) => News);

  if (!news.length) {
    return <NoChildrenComponent label="No News" variant="body1" />;
  }

  return (
    <>
      {sortBy(news, n => Number(n.date))
        .reverse()
        .map(n => (
          <NewsRow key={n.id} news={n} styles={styles} />
        ))}
    </>
  );
};

const NewsComponent = () => {
  const styles = useStyles();

  return (
    <Grid className={styles.gridItem} item xs={6}>
      <div className={styles.root}>
        <Grid container direction="row" className={styles.colContainer}>
          <Grid item className={styles.firstCol}>
            <Typography className={styles.header} variant="h6">
              News
            </Typography>
          </Grid>
        </Grid>
        <Grid container direction="row" className={styles.gridBottom}>
          <NewsGrid />
        </Grid>
      </div>
    </Grid>
  );
};

export default NewsComponent;
