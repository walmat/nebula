import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import { TableRow } from '@material-ui/core';

import { styles } from '../styles';

import RowCheckbox from './cells/checkbox';
import RowTaskId from './cells/taskId';
import RowTaskStore from './cells/store';
import RowTaskProduct from './cells/product';
import RowTaskSizes from './cells/sizes';
import RowTaskProxies from './cells/proxies';
import RowTaskProfile from './cells/profile';
import RowTaskStatus from './cells/status';

const useStyles = makeStyles(styles);

type Props = {
  id: string;
  mode: string;
  selected: boolean;
  store: any;
  product: any;
  sizes: any[];
  proxies: any;
  profile: any;
  message: string;
  platform: string;
  // eslint-disable-next-line
  variation?: string;
  // eslint-disable-next-line
  chosenSize?:
    | string
    | {
        id: number | string;
        name: string;
      };
  // eslint-disable-next-line
  productName?: string;
  // eslint-disable-next-line
  productImage?: string;
  isRangeSelecting: boolean;
  group: string;
  onRowClick: Function;
  index: number;
};

const TaskTableRow = (props: Props) => {
  const {
    id,
    mode,
    selected,
    store,
    product,
    sizes,
    proxies,
    profile,
    message,
    platform,
    variation,
    chosenSize,
    productName,
    productImage,
    isRangeSelecting,
    group,
    onRowClick,
    index
  } = props as any;

  const styles = useStyles();

  return useMemo(
    () => (
      <TableRow
        onClick={() => onRowClick(group, id, isRangeSelecting)}
        role="checkbox"
        component="div"
        aria-checked={selected}
        key={`{task}--${id}`}
        selected={selected}
        className={styles.displayFlex}
      >
        <RowCheckbox index={index} selected={selected} />
        <RowTaskId id={id} />
        <RowTaskStore id={id} mode={mode} store={store} />
        <RowTaskProduct
          id={id}
          platform={platform}
          product={product}
          variation={variation}
          productImage={productImage}
          productName={productName}
        />
        <RowTaskSizes id={id} chosenSize={chosenSize} sizes={sizes} />
        <RowTaskProxies id={id} proxies={proxies} />
        <RowTaskProfile id={id} profile={profile} />
        <RowTaskStatus
          id={id}
          group={group}
          platform={platform}
          message={message}
        />
      </TableRow>
    ),
    [
      mode,
      selected,
      store,
      product,
      sizes,
      proxies,
      profile,
      message,
      platform,
      variation,
      chosenSize,
      productName,
      productImage,
      onRowClick,
      styles
    ]
  );
};

export default TaskTableRow;
