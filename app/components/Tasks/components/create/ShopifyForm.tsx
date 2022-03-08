import React from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  DialogContent,
  Tooltip,
  Fade,
  FormGroup,
  Checkbox
} from '@material-ui/core';
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
import AccountField from './AccountField';
import NumberOfTasksField from './NumberOfTasksField';
// advanced fields
import PasswordField from './PasswordField';
import QuantityField from './QuantityField';
import RatesField from './RatesField';
import MinPriceField from './MinPriceField';
import MaxPriceField from './MaxPriceField';
import DateField from './DateField';
import OneCheckoutField from './OneCheckout';
import RestockMode from './RestockMode';
import PaypalField from './PayPalField';
import DiscountField from './DiscountField';
import { makeCurrentTask, makeEditTask } from '../../selectors';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Values = {};

type FormProps = {
  activeStep: number;
  isEditing: boolean;
  useMassVariants: boolean;
  setUseMassVariants: Function;
};

const ShopifyForm = ({
  activeStep,
  isEditing,
  useMassVariants,
  setUseMassVariants
}: FormProps) => {
  let task: any = useSelector(makeCurrentTask);
  if (isEditing) {
    task = useSelector(makeEditTask);
  }
  const proxyList = useSelector((state: RootState) => state.Proxies);
  const accounts = useSelector((state: RootState) => state.Accounts);
  const profiles = useSelector(makeProfiles);
  const stores = useSelector(makeStores);

  const dispatch = useDispatch();

  const styles = useStyles();

  const {
    store,
    sizes,
    account,
    profile,
    proxies,
    mode,
    rate,
    paypal,
    discount,
    oneCheckout,
    restockMode,
    password,
    startTime,
    endTime,
    minPrice,
    maxPrice,
    amount,
    quantity
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
      account: yup.string(),
      amount: yup.string(),
      // advanced details
      password: yup.string(),
      rate: yup.object(),
      minPrice: yup.string(),
      maxPrice: yup.string(),
      startTime: yup.string(),
      endTime: yup.string(),
      captcha: yup.string(),
      quantity: yup.number()
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
              <AccountField
                account={account}
                accounts={accounts}
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
              />
            </div>
            <div className={styles.fieldset}>
              <div className={styles.flex}>
                <ProductField
                  product={task?.product}
                  isEditing={isEditing}
                  label={
                    !isEditing && useMassVariants ? 'Mass Variants' : 'Product'
                  }
                  useMassVariants={!isEditing && useMassVariants}
                  task={task}
                  onChange={_editTask}
                  stores={stores}
                />
                <FormGroup
                  className={classNames(
                    styles.formGroupTwo,
                    styles.flexOne,
                    styles.marginAuto
                  )}
                >
                  <Tooltip
                    TransitionComponent={Fade}
                    placement="top"
                    title={!isEditing ? 'Mass Variants' : 'Disabled'}
                  >
                    <Checkbox
                      disabled={isEditing}
                      checked={useMassVariants}
                      onChange={() => setUseMassVariants(!useMassVariants)}
                      value={useMassVariants ? 'true' : 'false'}
                      color="primary"
                    />
                  </Tooltip>
                </FormGroup>
              </div>
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
                <NumberOfTasksField
                  onChange={_editTask}
                  isEditing={isEditing}
                  task={task}
                  amount={amount}
                />

                <DiscountField
                  discount={discount}
                  isEditing={isEditing}
                  onChange={_editTask}
                  task={task}
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
              <div className={styles.flex}>
                <PasswordField
                  task={task}
                  isEditing={isEditing}
                  password={password}
                  onChange={_editTask}
                />
                <QuantityField
                  onChange={_editTask}
                  quantity={quantity}
                  task={task}
                />
              </div>
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
              <div className={styles.flex}>
                <OneCheckoutField
                  label="One Checkout"
                  onChange={_editTask}
                  oneCheckout={oneCheckout}
                  task={task}
                />
                <PaypalField
                  label="Paypal"
                  onChange={_editTask}
                  paypal={paypal}
                  task={task}
                />
              </div>
            </div>
            <div className={styles.fieldset}>
              <RatesField
                rate={rate}
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
              />
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
              <RestockMode
                label="24/7 Restocks"
                onChange={_editTask}
                restockMode={restockMode}
                task={task}
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
              <AccountField
                account={account}
                accounts={accounts}
                isEditing={isEditing}
                task={task}
                onChange={_editTask}
              />
            </div>
            <div className={styles.fieldset}>
              <div className={styles.flex}>
                <ProductField
                  product={task?.product}
                  isEditing={isEditing}
                  label={
                    !isEditing && useMassVariants ? 'Mass Variants' : 'Product'
                  }
                  useMassVariants={!isEditing && useMassVariants}
                  task={task}
                  onChange={_editTask}
                  stores={stores}
                />
                <FormGroup
                  className={classNames(
                    styles.formGroupTwo,
                    styles.flexOne,
                    styles.marginAuto
                  )}
                >
                  <Tooltip
                    TransitionComponent={Fade}
                    placement="top"
                    title={!isEditing ? 'Mass Variants' : 'Disabled'}
                  >
                    <Checkbox
                      disabled={isEditing}
                      checked={useMassVariants}
                      onChange={() => setUseMassVariants(!useMassVariants)}
                      value={useMassVariants ? 'true' : 'false'}
                      color="primary"
                    />
                  </Tooltip>
                </FormGroup>
              </div>
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
              <NumberOfTasksField
                onChange={_editTask}
                isEditing={isEditing}
                task={task}
                amount={amount}
              />
            </div>
          </DialogContent>
        </FormikProvider>
      );
  }
};

export default ShopifyForm;
