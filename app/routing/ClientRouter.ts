import { renderRoutes } from 'react-router-config';
import { routes } from './routes';

const ClientRouter = () => {
  return renderRoutes(routes);
};

export default ClientRouter;
