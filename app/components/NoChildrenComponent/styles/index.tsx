import { variables, mixins } from '../../../styles/js';

export const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  background: {
    flexDirection: 'row',
    display: 'flex',
    height: '100%'
  },
  alignCenter: {
    alignSelf: 'center',
    height: '100%'
  },
  center: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  text: {
    color: '#919191'
  }
});
