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
import NumberOfTasksField from './NumberOfTasksField';
import OneCheckoutField from './OneCheckout';
// advanced fields
import DateField from './DateField';
import { makeCurrentTask, makeEditTask } from '../../selectors';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Values = {};

type FormProps = {
  activeStep: number;
  isEditing: boolean;
};

const YeezySupplyForm = ({ activeStep, isEditing }: FormProps) => {
  let task = useSelector(makeCurrentTask);
  if (isEditing) {
    task = useSelector(makeEditTask);
  }

  const proxyList = useSelector((state: RootState) => state.Proxies);
  const profiles = useSelector(makeProfiles);
  const stores = useSelector(makeStores);

  const dispatch = useDispatch();

  const styles = useStyles();

  const {
    store,
    sizes,
    oneCheckout,
    profile,
    proxies,
    mode,
    startTime,
    endTime,
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
      amount: yup.string(),
      // advanced details
      minPrice: yup.string(),
      maxPrice: yup.string(),
      startTime: yup.string(),
      endTime: yup.string(),
      captcha: yup.string()
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
              <OneCheckoutField
                label="One Checkout For Profile"
                onChange={_editTask}
                oneCheckout={oneCheckout}
                task={task}
              />
            </div>
            <div className={styles.fieldset}>
              <ProductField
                label="Product"
                task={task}
                isEditing={isEditing}
                onChange={_editTask}
                stores={stores}
                product={task?.product}
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
    case 1:
      return (
        <FormikProvider value={formikbag}>
          <DialogContent className={styles.dialogContent}>
            <div className={styles.fieldset}>
              <DateField
                label="Start Schedule"
                value={startTime}
                isEditing={isEditing}
                name={TASK_FIELDS.START_TIME}
                onChange={_editTask}
                task={task}
              />
            </div>
            <div className={styles.fieldset}>
              <DateField
                label="End Schedule"
                value={endTime}
                isEditing={isEditing}
                name={TASK_FIELDS.END_TIME}
                onChange={_editTask}
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
              <OneCheckoutField
                label="One Checkout For Profile"
                onChange={_editTask}
                oneCheckout={oneCheckout}
                task={task}
              />
            </div>
            <div className={styles.fieldset}>
              <ProductField
                label="Product"
                task={task}
                isEditing={isEditing}
                onChange={_editTask}
                stores={stores}
                product={task?.product}
              />
              <SizesField
                onChange={_editTask}
                task={task}
                isEditing={isEditing}
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

export default YeezySupplyForm;
