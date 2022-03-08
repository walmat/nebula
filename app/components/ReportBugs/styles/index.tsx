import { mixins } from '../../../styles/js';

export const styles = () => ({
  root: {
    textAlign: `center`,
    ...mixins().center,
    width: 500,
    marginTop: 77
  }
});
