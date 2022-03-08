import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
  FormGroup,
  Tooltip,
  Checkbox,
  FormControlLabel
} from '@material-ui/core';

import { styles } from '../../styles/createDialog';

const useStyles = makeStyles(styles);

type Props = {
  useMocks: boolean;
  setUseMocks: Function;
};

export const MockToggle = ({ useMocks, setUseMocks }: Props) => {
  const styles = useStyles();

  const handleChange = (event: any) => {
    const { checked } = event.target;

    setUseMocks(checked);
  };

  return (
    <div className={styles.block}>
      <FormGroup style={{ margin: `auto 0 0 32px`, height: 38 }}>
        <Tooltip title="'Enable this to use mock responses'">
          <FormControlLabel
            control={
              <Checkbox
                checked={useMocks}
                onChange={handleChange}
                value={useMocks ? 'true' : 'false'}
                color="primary"
              />
            }
            label={
              <Typography variant="subtitle2" className={styles.subtitle}>
                Use Mocks
              </Typography>
            }
          />
        </Tooltip>
      </FormGroup>
    </div>
  );
};
