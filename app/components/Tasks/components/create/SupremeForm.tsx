import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { DialogContent } from '@material-ui/core';
import { FormikProvider, FormikHelpers, useFormik } from 'formik';
import * as yup from 'yup';

import { makeStores } from '../../../App/selectors';
import { styles } from '../../styles/createDialog';
import { editTask, TASK_FIELDS } from '../../actions';
import { makeProfiles } from '../../../Profiles/selectors';

// normal fields
import StoreField from './StoreField';
import ProductField from './ProductField';
import ProfileField from './ProfileField';
import SizesField from './SizesField';
import TaskModeField from './TaskModeField';
import ProxiesField from './ProxiesField';
import CategoryField from './CategoryField';
import VariationField from './VariationField';
import CheckoutDelayField from './CheckoutDelayField';
import NumberOfTasksField from './NumberOfTasksField';
// advanced fields

import MinPriceField from './MinPriceField';
import MaxPriceField from './MaxPriceField';
import DateField from './DateField';
import QuantityField from './QuantityField';
import OneCheckoutField from './OneCheckout';
import { makeCurrentTask, makeEditTask } from '../../selectors';

const useStyles = makeStyles(styles);

type Values = {};

type FormProps = {
  activeStep: number;
  isEditing: boolean;
};

const SupremeForm = ({ activeStep, isEditing }: FormProps) => {
  let task = useSelector(makeCurrentTask);
  if (isEditing) {
    task = useSelector(makeEditTask);
  }

  const proxyList = useSelector(({ Proxies }: { Proxies: any[] }) => Proxies);
  const profiles = useSelector(makeProfiles);
  const stores = useSelector(makeStores);

  const dispatch = useDispatch();

  const styles = useStyles();

  const {
    store,
    sizes,
    oneCheckout,
    category,
    profile,
    proxies,
    mode,
    variation,
    quantity,
    checkoutDelay,
    startTime,
    endTime,
    minPrice,
    maxPrice,
    amount
  } = task;

  const _editTask = ({
    field,
    value,
    stores
  }: {
    field: string;
    value: any;
    stores: any[];
  }) => {
    dispatch(editTask({ isEditing, field, value, stores }));
  };

  // eslint-disable-next-line
  const onSubmit = (values: Values, formikHelpers: FormikHelpers<Values>) => {};

  const formikbag = useFormik<Values>({
    initialValues: {},
    validationSchema: yup.object({
      // normal details
      store: yup.string(),
      product: yup.string(),
      profile: yup.string(),
      sizes: yup.string(),
      mode: yup.string(),
      proxies: yup.string(),
      category: yup.string(),
      variation: yup.string(),
      checkoutDelay: yup.string(),
      amount: yup.string(),
      // advanced details
      minPrice: yup.string(),
      maxPrice: yup.string(),
      startTime: yup.string(),
      endTime: yup.string(),
      captcha: yup.string(),
      secureBypass: yup.string()
    }),
    onSubmit
  });

  switch (activeStep) {
    case 0:
      return (
        <FormikProvider value={formikbag}>
          <DialogContent className={styles.dialogContent}>
            <div className={styles.fieldset}>
              <StoreField
                store={store}
                stores={stores}
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
              />
              <ProfileField
                profile={profile}
                profiles={profiles}
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
              />
              <TaskModeField
                mode={mode}
                isEditing={isEditing}
                onChange={_editTask}
                task={task}
              />
              <div className={styles.flex}>
                <CategoryField
                  category={category}
                  isEditing={isEditing}
                  task={task}
                  onChange={_editTask}
                />
                <VariationField
                  variation={variation}
                  isEditing={isEditing}
                  task={task}
                  onChange={_editTask}
                />
              </div>
            </div>
            <div className={styles.fieldset}>
              <ProductField
                product={task?.product}
                label="Keywords"
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
                stores={stores}
              />
              <SizesField
                onChange={_editTask}
                isEditing={isEditing}
                task={task}
                sizes={sizes}
              />
              <ProxiesField
                proxies={proxies}
                proxyList={proxyList}
                isEditing={isEditing}
                onChange={_editTask}
                task={task}
              />
              <div className={styles.flex}>
                <CheckoutDelayField
                  checkoutDelay={checkoutDelay}
                  isEditing={isEditing}
                  task={task}
                  onChange={_editTask}
                />
                <NumberOfTasksField
                  onChange={_editTask}
                  isEditing={isEditing}
                  task={task}
                  amount={amount}
                />
              </div>
            </div>
          </DialogContent>
        </FormikProvider>
      );
    case 1:
      return (
        <FormikProvider value={formikbag}>
          <DialogContent className={styles.dialogContent}>
            <div className={styles.fieldset}>
              <MinPriceField
                minPrice={minPrice}
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
              />
              <DateField
                label="Start Schedule"
                value={startTime}
                isEditing={isEditing}
                name={TASK_FIELDS.START_TIME}
                onChange={_editTask}
                task={task}
              />
              <OneCheckoutField
                label="One Checkout For Profile"
                onChange={_editTask}
                oneCheckout={oneCheckout}
                task={task}
              />
            </div>
            <div className={styles.fieldset}>
              <MaxPriceField
                task={task}
                isEditing={isEditing}
                maxPrice={maxPrice}
                onChange={_editTask}
              />
              <DateField
                label="End Schedule"
                value={endTime}
                isEditing={isEditing}
                name={TASK_FIELDS.END_TIME}
                onChange={_editTask}
                task={task}
              />
              <QuantityField
                onChange={_editTask}
                isEditing={isEditing}
                task={task}
                quantity={quantity}
              />
            </div>
          </DialogContent>
        </FormikProvider>
      );
    default:
      return (
        <FormikProvider value={formikbag}>
          <DialogContent className={styles.dialogContent}>
            <div className={styles.fieldset}>
              <StoreField
                store={store}
                stores={stores}
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
              />
              <ProfileField
                profile={profile}
                profiles={profiles}
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
              />
              <TaskModeField
                mode={mode}
                isEditing={isEditing}
                onChange={_editTask}
                task={task}
              />
              <div className={styles.flex}>
                <CategoryField
                  category={category}
                  isEditing={isEditing}
                  task={task}
                  onChange={_editTask}
                />
                <VariationField
                  variation={variation}
                  isEditing={isEditing}
                  task={task}
                  onChange={_editTask}
                />
              </div>
            </div>
            <div className={styles.fieldset}>
              <ProductField
                product={task?.product}
                label="Keywords"
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
                stores={stores}
              />
              <SizesField
                onChange={_editTask}
                isEditing={isEditing}
                task={task}
                sizes={sizes}
              />
              <ProxiesField
                proxies={proxies}
                proxyList={proxyList}
                isEditing={isEditing}
                onChange={_editTask}
                task={task}
              />
              <div className={styles.flex}>
                <CheckoutDelayField
                  checkoutDelay={checkoutDelay}
                  isEditing={isEditing}
                  task={task}
                  onChange={_editTask}
                />
                <NumberOfTasksField
                  onChange={_editTask}
                  isEditing={isEditing}
                  task={task}
                  amount={amount}
                />
              </div>
            </div>
          </DialogContent>
        </FormikProvider>
      );
  }
};

export default SupremeForm;
