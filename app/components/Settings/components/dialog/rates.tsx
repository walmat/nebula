import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';
import { ValidationError } from 'yup';
import { makeStyles } from '@material-ui/styles';
import WindowedSelect from 'react-windowed-select';
import {
  Typography,
  DialogContent,
  FormControl,
  FormGroup,
  Fade,
  Button
} from '@material-ui/core';

import StoreField from './StoreField';
import ProfileField from './ProfileField';
import ProductField from './ProductField';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import { parseProduct } from '../../../../constants';
import { IPCKeys } from '../../../../constants/ipc';
import { Platforms } from '../../../../tasks/common/constants';
import { Constants } from '../../../../tasks/common';
// import { getValidationSchemaTask } from '../../../../utils/validateTasks';
import { styles } from '../../styles';

import { addRates, removeRates } from '../../actions';
import { RootState } from '../../../../store/reducers';

const processProduct = (value: string) => {
  const product = {
    raw: value || ''
  };

  if (!value) {
    return {
      product: null
    };
  }

  return {
    product
  };
};

const useStyles = makeStyles(styles);

const ShippingRatesDialogContent = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const profiles = useSelector((state: any) => state.Profiles);
  const ratesList = useSelector((state: any) => state.Rates);
  const stores = useSelector((state: any) => state.Stores);
  const theme = useSelector((state: RootState) => state.Theme);

  const [error, setError] = useState<string>('');
  const [store, setStore] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [rate, setRate] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);

  // const validationSchema = getValidationSchemaTask(Platforms.Shopify);

  const handleSetStore = ({ value }: { value: any }) => {
    if (value && store && value.url === store.url) {
      return;
    }
    setStore(value);
    setRate(null);
  };

  const handleSetProfile = ({ value }: { value: any }) => {
    if (profile?.id === value?.id) {
      return;
    }

    setProfile(value);
  };

  const handleSetProduct = ({ value }: { value: string }) => {
    const result = processProduct(value);

    if (!result) {
      return;
    }

    setProduct(result.product);
  };

  const handleSetRate = (e: any) => {
    setRate(e);
  };

  const handleRatesStatus = (_: any, { success, error, store, rates }: any) => {
    if (success) {
      dispatch(addRates({ store, rates }));
    }

    if (error) {
      setError(error);

      setTimeout(() => {
        setError('');
        setIsFetching(false);
      }, 1500);

      return;
    }

    setIsFetching(false);
  };

  const extractRateList = () => {
    if (!store) {
      return [];
    }

    const { url } = store;
    const ratesForStore = ratesList[url];
    if (!ratesForStore) {
      return [];
    }

    return ratesForStore.map(
      ({ id, name, price }: { id: string; name: string; price: string }) => ({
        label: name,
        value: { id, name, price }
      })
    );
  };

  const removeRate = () => {
    if (!rate || !store) {
      return;
    }

    dispatch(removeRates({ store: store.url, rate: rate.value }));
    setRate(null);
  };

  const stopRate = async () => {
    ipcRenderer.send(IPCKeys.CancelRates);

    setIsFetching(false);
  };

  const fetchRate = async () => {
    if (!product || !store) {
      return;
    }

    // they are providing a direct rate, let's bypass the fetcher
    if (
      /^.+-.+-.+/i.test(product.raw) &&
      !/^http/i.test(product.raw) &&
      store
    ) {
      const [, name] = product.raw.match(/^[^-]*-(.*)-.*$/);
      const [, price] = product.raw.match(/^.+-.+-(.*)$/);

      dispatch(
        addRates({
          store: store.url,
          rates: [{ id: product.raw, name, price }]
        })
      );

      return;
    }

    if (!profile) {
      return;
    }

    const task = {
      id: 'RATE_FETCHER',
      sizes: ['Random'],
      platform: Platforms.Shopify,
      type: Constants.Task.Types.Rates,
      store,
      profile,
      product: parseProduct(product)
    };

    try {
      // const result = await validationSchema.validate(task);

      setIsFetching(true);

      ipcRenderer.send(IPCKeys.FetchRates, task);

      ipcRenderer.once(IPCKeys.RatesTaskStatus, handleRatesStatus);
    } catch (err) {
      if (err instanceof ValidationError) {
        // TODO - show validation on fields
        // TODO - show errors to users
        // err.errors
      }

      setIsFetching(false);
      // eslint-disable-next-line
      console.log('err: ', err);
    }
  };

  let btnMessage = 'Fetch';
  if (isFetching) {
    btnMessage = 'Cancel';
  }

  if (error) {
    btnMessage = `ERR::${error}`;
  }

  return (
    <Fade in>
      <DialogContent className={styles.dialog}>
        <FormControl component="fieldset" className={styles.accountFieldOne}>
          <StoreField
            store={store}
            stores={stores?.length ? stores[0].options : []}
            onChange={handleSetStore}
          />
        </FormControl>
        <FormControl component="fieldset" className={styles.accountFieldTwo}>
          <ProfileField
            profiles={profiles}
            profile={profile}
            onChange={handleSetProfile}
          />
        </FormControl>
        <FormControl component="fieldset" className={styles.accountFieldThree}>
          <ProductField
            label="Product OR Rate"
            product={product}
            onChange={handleSetProduct}
          />
        </FormControl>

        <FormControl component="fieldset" className={styles.fieldSetFirst}>
          <div className={styles.block}>
            <FormGroup>
              <Typography variant="subtitle2" className={styles.subtitle}>
                Current Rates
              </Typography>

              <WindowedSelect
                required
                isClearable
                menuPortalTarget={document.body}
                menuPlacement="auto"
                classNamePrefix="select"
                placeholder="Choose Rates"
                components={{
                  IndicatorSeparator
                }}
                value={rate}
                options={extractRateList()}
                key="rates--list"
                styles={colorStyles(theme)}
                onChange={handleSetRate}
              />
            </FormGroup>
          </div>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetSecond}>
          <Button
            onClick={isFetching ? stopRate : fetchRate}
            className={styles.createBtn}
          >
            {btnMessage}
          </Button>
        </FormControl>
        <FormControl component="fieldset" className={styles.fieldSetSecond}>
          <Button onClick={removeRate} className={styles.deleteBtn}>
            Delete
          </Button>
        </FormControl>
        <Typography variant="caption">
          Shopify shipping rates can be pre-fetched and used to speed up the
          checkout process a bit more. Use this dialog to enter in an already
          fetched rate, or use a profile and product to fetch rates for a store
          now.
        </Typography>
      </DialogContent>
    </Fade>
  );
};

export default ShippingRatesDialogContent;
