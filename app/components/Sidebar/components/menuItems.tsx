import { routeTo } from '../../../routing/routes';

export const SIDEBAR = {
  // USELESS WITHOUT API
  // Dashboard: {
  //   path: routeTo('Home'),
  //   exact: true,
  //   name: 'Dashboard',
  //   img: 'HomeIcon',
  //   subMenu: [
  //     {
  //       path: routeTo('Analytics'),
  //       exact: true,
  //       name: 'Analytics',
  //       img: 'InsertChart'
  //     }
  //   ]
  // },
  Releases: {
    path: '/releases',
    exact: true,
    name: 'Releases',
    img: 'LibraryAdd',
    subMenu: [
      {
        path: routeTo('Tasks'),
        exact: true,
        name: 'Tasks',
        img: 'LibraryAdd'
      },
      {
        path: routeTo('Captchas'),
        exact: true,
        name: 'Harvesters',
        img: 'TimerIcon'
      }
    ]
  },
  Profiles: {
    path: routeTo('Profiles'),
    exact: true,
    name: 'Profiles',
    img: 'Payment'
  },
  Proxies: {
    path: routeTo('Proxies'),
    exact: true,
    name: 'Proxies',
    img: 'AttachMoneyIcon'
  }
};
