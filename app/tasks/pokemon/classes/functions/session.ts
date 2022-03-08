import { Task } from '../../constants';

const { States } = Task;

export const getSession = ({ handler }: { handler: Function }) => {
  return handler({
    endpoint: '/tpci-ecommweb-api/order?type=status&format=zoom.nodatalinks',
    message: 'Visiting homepage',
    from: States.GET_SESSION
  });
};
