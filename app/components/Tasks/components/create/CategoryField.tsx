import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import WindowedSelect from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup } from '@material-ui/core';
import { TASK_FIELDS } from '../../actions';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import { buildCategoryOptions } from '../../../../constants';

import { styles } from '../../styles/createDialog';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Props = {
  task: any;
  isEditing: boolean;
  onChange: Function;
  category: any;
};
const CategoryField = ({ task, isEditing, onChange, category }: Props) => {
  const styles = useStyles();
  const theme = useSelector((state: RootState) => state.Theme);

  const handleChangeCategory = (event: any) => {
    if (!event) {
      return onChange({
        id: task.id,
        field: TASK_FIELDS.CATEGORY,
        value: event
      });
    }

    return onChange({
      id: task.id,
      field: TASK_FIELDS.CATEGORY,
      value: event.value
    });
  };

  const getCategoryValue = () => {
    if (category) {
      return {
        value: category,
        label: category
      };
    }
    return null;
  };

  return (
    <FormGroup className={classNames(styles.formGroupOne)}>
      <Typography variant="subtitle2" className={styles.subtitle}>
        Category
      </Typography>

      <WindowedSelect
        required
        isClearable
        menuPortalTarget={document.body}
        menuPlacement="auto"
        classNamePrefix="select"
        placeholder={isEditing ? 'No change' : 'None'}
        components={{
          IndicatorSeparator
        }}
        value={getCategoryValue()}
        options={buildCategoryOptions()}
        key="tasks--category"
        styles={colorStyles(theme)}
        onChange={handleChangeCategory}
      />
    </FormGroup>
  );
};

export default CategoryField;
