import Captchas from '../components/Captchas/Loadable';
import Tasks from '../components/Tasks/Loadable';
import Profiles from '../components/Profiles/Loadable';

import ReportBugs from '../components/ReportBugs/Loadable';
import Progressbar from '../components/Progressbar/Loadable';
import PrivacyPolicy from '../components/Legal/PrivacyPolicy/Loadable';
import TermsOfService from '../components/Legal/TermsOfService/Loadable';
import Proxies from '../components/Proxies/Loadable';

export const routes = [
  // {
  //   path: '/',
  //   exact: true,
  //   name: 'Home',
  //   img: 'Sidebar/market.svg',
  //   component: Analytics
  // },
  // {
  //   path: '/analytics',
  //   exact: true,
  //   name: 'Analytics',
  //   img: 'Sidebar/market.svg',
  //   component: Analytics
  // },
  // {
  //   path: '/calendar',
  //   exact: true,
  //   name: 'Calendar',
  //   img: 'Sidebar/market.svg',
  //   component: Calendar
  // },
  {
    path: '/captchas',
    exact: false,
    name: 'Captchas',
    img: 'Sidebar/market.svg',
    component: Captchas
  },
  {
    path: '/',
    exact: true,
    name: 'Tasks',
    img: 'Sidebar/market.svg',
    component: Tasks
  },
  {
    path: '/profiles',
    exact: true,
    name: 'Profiles',
    img: 'Sidebar/market.svg',
    component: Profiles
  },
  {
    path: '/proxies',
    exact: true,
    name: 'Proxies',
    img: 'Sidebar/market.svg',
    component: Proxies
  },
  {
    path: '/reportBugsPage',
    exact: true,
    component: ReportBugs,
    name: 'ReportBugsPage'
  },
  {
    path: '/progressbarPage',
    exact: true,
    component: Progressbar,
    name: 'ProgressbarPage'
  },
  {
    path: '/privacyPolicy',
    exact: true,
    component: PrivacyPolicy,
    name: 'PrivacyPolicy'
  },
  {
    path: '/termsOfService',
    exact: true,
    component: TermsOfService,
    name: 'TermsOfService'
  }
];

export const routeTo = (name: string) => {
  const route = routes.find(r => r.name === name);

  if (!route) {
    // eslint-disable-next-line
    console.warn('route name not found: ', name);
    return '';
  }

  return route.path;
};
