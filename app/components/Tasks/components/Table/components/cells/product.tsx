import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import Image from 'material-ui-image';
import { makeStyles } from '@material-ui/styles';
import { TableCell } from '@material-ui/core';
import { styles } from '../../styles';
import { Platforms } from '../../../../../../constants';

import { RootState } from '../../../../../../store/reducers';

const useStyles = makeStyles(styles);

const getProductValue = ({
  platform,
  productName,
  product,
  variation
}: {
  platform: string;
  productName?: string;
  product: any;
  variation?: string;
}) => {
  let productValue = productName;
  if (!productValue) {
    switch (platform) {
      case Platforms.Supreme:
        if (product) {
          productValue = `${product?.raw} / ${variation}`;
        } else {
          productValue = `Malformed product`;
        }
        break;
      default:
        if (product) {
          productValue = `${product?.raw}`;
        } else {
          productValue = `Malformed product`;
        }
    }
  }

  return productValue;
};

export const rowTaskProduct = ({
  id,
  productImage,
  platform,
  product,
  productName,
  variation
}: {
  id: string;
  productImage?: string;
  platform: string;
  product: any;
  productName?: string;
  variation?: string;
}) => {
  const styles = useStyles();
  const productValue = useMemo(
    () =>
      getProductValue({
        platform,
        product,
        productName,
        variation
      }),
    [product, productName, variation]
  );

  const enablePerformance = useSelector(
    (state: RootState) => state.Settings.enablePerformance
  );

  return useMemo(
    () => (
      <TableCell
        key={`${id}--product`}
        component="div"
        variant="body"
        className={classnames(
          productImage ? styles.cellDouble : styles.cell,
          styles.product,
          styles.noPaddingLeft
        )}
      >
        {!enablePerformance && productImage ? (
          <Image
            animationDuration={1000}
            src={productImage}
            color="transparent"
            imageStyle={{
              width: 'auto',
              height: '100%',
              maxWidth: 24,
              position: 'unset',
              borderRadius: '50%'
            }}
            style={{
              margin: 0,
              height: 24,
              width: 'auto',
              overflow: 'visible',
              padding: 0
            }}
          />
        ) : null}
        <span>{productValue}</span>
      </TableCell>
    ),
    [productValue, productImage, styles]
  );
};

rowTaskProduct.defaultProps = {
  productImage: null,
  productName: null,
  variation: null
};

export default rowTaskProduct;
