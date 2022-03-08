import Loadable from 'react-imported-component';
import LoadingIndicator from '../LoadingIndicator';

export default Loadable(() => import('./Proxies'), {
  LoadingComponent: LoadingIndicator
});
