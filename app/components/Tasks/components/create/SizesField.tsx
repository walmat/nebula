import React from 'react';
import { useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { WindowedMenuList } from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup } from '@material-ui/core';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import { createSize, getAllSizes } from '../../../../constants';
import { styles } from '../../styles/createDialog';
import { TASK_FIELDS } from '../../actions';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

type Props = {
  sizes: any;
  isEditing: boolean;
  task: any;
  onChange: Function;
};
const SizesField = ({ onChange, isEditing, task, sizes }: Props) => {
  const styles = useStyles();
  const theme = useSelector((state: RootState) => state.Theme);

  const sizesValue = sizes?.map((size: any) => ({ value: size, label: size }));

  const handleCreateSize = (event: any) => {
    const newSize = createSize(event);

    if (!newSize) {
      return null;
    }

    return onChange({
      id: task.id,
      field: TASK_FIELDS.SIZES,
      value: sizes ? [...sizes, newSize] : [newSize]
    });
  };

  const handleChangeSize = (event: any) => {
    if (!event) {
      return onChange({ id: task.id, field: TASK_FIELDS.SIZES, value: event });
    }

    return onChange({
      id: task.id,
      field: TASK_FIELDS.SIZES,
      value: event.map(({ value }: { value: string }) => value)
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Size(s)
        </Typography>

        <CreatableSelect
          required
          isMulti
          isClearable
          closeMenuOnSelect={false}
          menuPortalTarget={document.body}
          menuPlacement="auto"
          classNamePrefix="select"
          placeholder={isEditing ? 'No change' : 'None'}
          components={{
            MenuList: WindowedMenuList,
            IndicatorSeparator
          }}
          value={sizesValue}
          onCreateOption={e => handleCreateSize(e)}
          options={getAllSizes()}
          key="tasks--sizes"
          styles={colorStyles(theme)}
          onChange={(e: any) => handleChangeSize(e)}
        />
      </FormGroup>
    </div>
  );
};

export default SizesField;
