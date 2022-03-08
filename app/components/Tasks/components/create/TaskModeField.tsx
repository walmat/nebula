import React from 'react';
import { useSelector } from 'react-redux';
import WindowedSelect from 'react-windowed-select';
import { makeStyles } from '@material-ui/styles';
import { Typography, FormGroup } from '@material-ui/core';
import { colorStyles, IndicatorSeparator } from '../../../../styles/select';
import {
  Platforms,
  buildShopifyTaskModeOptions,
  buildYeezySupplyTaskModeOptions,
  buildFootsiteTaskModeOptions,
  buildPokemonTaskModeOptions
} from '../../../../constants';
import { styles } from '../../styles/createDialog';
import { TASK_FIELDS } from '../../actions';
import { RootState } from '../../../../store/reducers';

const useStyles = makeStyles(styles);

const buildOptions = (platform: any) => {
  switch (platform) {
    case Platforms.Shopify:
      return buildShopifyTaskModeOptions();
    case Platforms.YeezySupply:
      return buildYeezySupplyTaskModeOptions();
    case Platforms.Footsites:
      return buildFootsiteTaskModeOptions();
    case Platforms.Pokemon:
      return buildPokemonTaskModeOptions();
    default:
      return buildShopifyTaskModeOptions();
  }
};

type Props = {
  mode: any;
  isEditing: boolean;
  onChange: Function;
  task: any;
};
const TaskModeField = ({ mode, isEditing, onChange, task }: Props) => {
  const styles = useStyles();
  const theme = useSelector((state: RootState) => state.Theme);

  const modeValue = mode
    ? {
        label: mode,
        value: mode
      }
    : null;

  const handleChange = (event: any) => {
    if (!event) {
      return onChange({ id: task.id, field: TASK_FIELDS.MODE, value: event });
    }
    return onChange({
      id: task.id,
      field: TASK_FIELDS.MODE,
      value: event.value
    });
  };

  return (
    <div className={styles.block}>
      <FormGroup className={styles.formGroup}>
        <Typography variant="subtitle2" className={styles.subtitle}>
          Task Mode
        </Typography>

        <WindowedSelect
          required
          isClearable={isEditing}
          menuPortalTarget={document.body}
          menuPlacement="auto"
          classNamePrefix="select"
          placeholder={isEditing ? 'No change' : 'None'}
          components={{
            IndicatorSeparator
          }}
          value={modeValue}
          options={buildOptions(task.platform)}
          key="tasks--mode"
          styles={colorStyles(theme)}
          onChange={(e: any) => handleChange(e)}
        />
      </FormGroup>
    </div>
  );
};

export default TaskModeField;
