import { variables, mixins } from '../../../styles/js';

export const styles = theme => ({
  root: {
    textAlign: `left`,
    ...mixins().center,
    width: 500,
    marginTop: 10
  },
  progressBodyText: {
    marginBottom: 10
  },
  progressTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 25
  }
});
