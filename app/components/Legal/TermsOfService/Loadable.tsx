import Loadable from 'react-imported-component';
import LoadingIndicator from '../../LoadingIndicator';

/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
export default Loadable(() => import('./index'), {
  LoadingComponent: LoadingIndicator
});
