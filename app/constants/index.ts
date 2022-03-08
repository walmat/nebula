import { generate } from 'shortid';
import { parseURL } from 'whatwg-url';

/**
 * Constants
 * Note: Don't import log helper file from utils here
 */
import { APP_NAME, APP_VERSION, AUTHOR_EMAIL } from './meta';
import sizes from './sizes';
import countries from './countries.json';
import regexes from './regexes';

export const TERMS_OF_SERVICE_TITLE = `Terms of Service`;

export const PRIVACY_POLICY_PAGE_TITLE = `Privacy Policy`;

export const EFFECTIVE_DATE = 'February 20th, 2020';

const subject = `Error Logs for ${APP_NAME} | Version: ${APP_VERSION}`;
const body = subject;

export const mailTo = `mailto:${AUTHOR_EMAIL}?Subject=${subject}&Body=${body}.`;

export const mailToInstructions = (zippedLogFileBaseName: string) =>
  `%0D%0A %0D%0A Attach the generated error report file "${zippedLogFileBaseName}" (which is found in your Desktop folder) along with this email.`;

export const reportGenerateError = `Error report generation failed. Try again!`;

export const LOG_FILE_ROTATION_CLEANUP_THRESHOLD = 30; // in days

export const ENABLE_BACKGROUND_AUTO_UPDATE = false;

export const AUTO_UPDATE_CHECK_FIREUP_DELAY = 10000; // in ms

export const HookTypes = {
  aycd: 'aycd',
  slack: 'slack',
  discord: 'discord'
};

export const sanitize = (string: string) =>
  [].filter.call(string, (c: any) => c.charCodeAt() !== 8203).join('');

export const strip = (string: string) => string.trim();

// TODO - consume from api
export const getCountry = (countryCode: string) =>
  Object.assign(
    {},
    countries.find(country => country.code === countryCode)
  );

export const getProvinces = (countryCode: string) => {
  const country = getCountry(countryCode);
  return country && country.provinces;
};

export const getAllCountries = () => countries;

export const isProvinceDisabled = (country: any, disabled?: boolean) => {
  if (country && country.value) {
    const { provinces } = getCountry(country.value);
    if (!provinces || !provinces.length) {
      return true;
    }
  }
  return disabled;
};

export const buildCountryOptions = () =>
  buildOptions(getAllCountries(), 'code', 'name');

export const buildProvinceOptions = (country: any) => {
  if (country && country.value) {
    return buildOptions(getProvinces(country.value), 'code', 'name');
  }
  return null;
};

export const Platforms = {
  Shopify: 'Shopify',
  Footsites: 'Footsites',
  YeezySupply: 'YeezySupply',
  Pokemon: 'Pokemon'
};

export const HarvesterOptions = {
  Shopify: 'https://checkout.shopify.com',
  Footsites: 'https://geo.captcha-delivery.com?footsites',
  YeezySupply: 'https://www.yeezysupply.com',
  Pokemon: 'https://geo.captcha-delivery.com?pokemon'
};

export const imgForStore: any = {
  'https://checkout.shopify.com': 'Shopify',
  'https://www.yeezysupply.com': 'YeezySupply',
  'https://geo.captcha-delivery.com': 'Footsites'
};

export const HarvesterTypes = {
  Login: 'Login',
  Checkout: 'Checkout',
  Checkpoint: 'Checkpoint'
};

export const FootsiteTypes = {
  RESTOCK: 'RESTOCK',
  RELEASE: 'RELEASE'
};

export const YeezySupplyTypes = {
  REQUEST: 'REQUEST'
};

export const PokemonTypes = {
  NORMAL: 'NORMAL',
  PRELOAD: 'PRELOAD'
};

export const ShopifyTypes = {
  RESTOCK: 'RESTOCK',
  FAST: 'FAST',
  SAFE: 'SAFE',
  PRELOAD: 'PRELOAD',
  PFUTILE: 'PFUTILE'
};

export const States = {
  Running: 'RUNNING',
  Stopped: 'STOPPED'
};

export const createStore = (value: string) => {
  const URL = parseURL(value);

  if (!URL?.host) {
    return null;
  }

  const { host, scheme } = URL;
  const parts = host.toString().split('.');
  if (!parts?.length) {
    return null;
  }

  const domain = host.toString();
  let name;

  if (parts.length >= 2) {
    const index = parts.length - 2;
    name = parts[index];
  }

  if (/myshopify/i.test(domain)) {
    [name] = parts;
  }

  return { name, url: `${scheme}://${host}` };
};

export const createSize = (value: string) => value || '';

export const platformForStore = (url: string) => {
  if (/yeezysupply/i.test(url)) {
    return Platforms.YeezySupply;
  }

  if (/\?pokemon/i.test(url)) {
    return Platforms.Pokemon;
  }

  if (/\?footsites|footlocker|footaction|eastbay|champssports/i.test(url)) {
    return Platforms.Footsites;
  }

  if (/pokemoncenter/i.test(url)) {
    return Platforms.Pokemon;
  }

  // TODO: more checks for other platforms here...
  return Platforms.Shopify;
};

export const getSitesForCategory = (sites: any[], category: string) =>
  sites.find(cat => cat.label === category).options;

export const getSite = (sites: any[], site: string) =>
  sites.find(t => t.value === site);

export const getCategory = (category: string) =>
  sizes.find((c: any) => c.label === category);

export const buildSizesForCategory = (category: string) =>
  getCategory(category).options.filter((size: any) => size.label !== 'Random');

export const getSize = (size: string, category: string) =>
  getCategory(category).options.find((s: any) => s.label === size).label;

export const getAllSizes = () => sizes;

const buildOptions = (list: any[], value: string, label: string) =>
  list.map(datum => ({ value: datum[value], label: datum[label] }));

export const buildProfileOptions = (profiles: any[], useAll = true) => {
  const opts = buildOptions(profiles, 'id', 'name');

  if (useAll && opts.length > 1) {
    return [{ value: 'All', label: 'All' }, ...opts];
  }
  return opts;
};

export const buildProxiesOptions = (proxies: any[], isEditing: boolean) => {
  let opts = proxies;
  if (isEditing) {
    opts = [
      {
        id: 'None',
        name: 'None'
      },
      ...opts
    ];
  }

  return buildOptions(opts, 'id', 'name');
};

export const buildAccountOptions = (accounts: any[]) =>
  accounts.map(({ id, name, username, password }) => ({
    label: name,
    value: {
      id,
      name,
      username,
      password
    }
  }));

export const buildFootsiteTaskModeOptions = () =>
  [...Object.keys(FootsiteTypes)].map(type => ({
    label: type,
    value: type
  }));

export const buildPokemonTaskModeOptions = () =>
  [...Object.keys(PokemonTypes)].map(type => ({
    label: type,
    value: type
  }));

export const buildYeezySupplyTaskModeOptions = () => {
  const options = [...Object.keys(YeezySupplyTypes)];
  return options.map(type => ({
    label: type,
    value: type
  }));
};

export const buildShopifyTaskModeOptions = () => {
  const options = [
    ...Object.keys({
      FAST: 'FAST',
      SAFE: 'SAFE',
      PRELOAD: 'PRELOAD',
      PFUTILE: 'PFUTILE'
    })
  ];
  return options.map(type => ({
    label: type,
    value: type
  }));
};

export const buildAccountListOptions = (
  accounts: any[],
  isEditing: boolean
) => {
  let opts = accounts;

  if (isEditing) {
    opts = [
      {
        id: 'None',
        name: 'None'
      },
      ...opts
    ];
  }

  return buildOptions(opts, 'id', 'name');
};

export const buildWebhookOptions = (webhooks: any[]) =>
  buildOptions(webhooks, 'id', 'name');
export const buildCategoryOptions = () => {
  const categories = [
    'new',
    'Accessories',
    'Bags',
    'Hats',
    'Jackets',
    'Pants',
    'Shirts',
    'Shoes',
    'Shorts',
    'Skate',
    'Sweatshirts',
    'T-Shirts',
    'Tops/Sweaters'
  ];
  return categories.map(cat => ({ label: cat, value: cat }));
};

export const _getId = (list: any) => {
  let id: string;

  const idCheck = (tasks: any) => tasks[id];

  do {
    id = generate();
  } while (idCheck(list));

  return { id };
};

export const parseProduct = (product: any, platform: string) => {
  if (!product || (product && !product.raw)) {
    return null;
  }

  const sanitized = strip(sanitize(product.raw));
  if (regexes.urlRegex.test(sanitized)) {
    if (platform === Platforms.YeezySupply) {
      // attempt to parse out sku id
      const match = /.*?\/product\/(.*)/i.exec(sanitized);
      if (!match) {
        return null;
      }

      const [, variant] = match;
      if (!variant) {
        return null;
      }

      return {
        ...product,
        variant
      };
    }

    if (platform === Platforms.Footsites) {
      const match = /.*\/(.*)(?=\.html)/i.exec(sanitized);
      if (!match) {
        return null;
      }

      const [, variant] = match;
      if (!variant) {
        return null;
      }

      return {
        ...product,
        variant
      };
    }

    if (platform === Platforms.Footsites) {
      const match = /.*\/(.*)(?=\.html)/i.exec(sanitized);
      if (!match) {
        return null;
      }

      const [, variant] = match;
      if (!variant) {
        return null;
      }

      return {
        ...product,
        variant
      };
    }

    if (platform === Platforms.Pokemon) {
      const parts = sanitized.split('/');
      if (!parts.length) {
        return null;
      }

      const productIndex = parts.findIndex(p => p === 'product');
      if (productIndex < 0) {
        return null;
      }

      const variant = parts[productIndex + 1];
      if (!variant) {
        return null;
      }

      return {
        ...product,
        variant
      };
    }

    return {
      ...product,
      url: sanitized
    };
  }

  const kws = product.raw
    .split(',')
    .reduce((a: string[], x: string) => a.concat(x.trim().split(' ')), []);

  const validKeywords = kws.every((kw: string) =>
    regexes.keywordRegex.test(kw)
  );

  if (validKeywords) {
    // test keyword match
    const posKeywords: string[] = [];
    const negKeywords: string[] = [];
    kws.forEach((kw: string) => {
      if (kw.startsWith('+')) {
        // positive keywords
        posKeywords.push(kw.slice(1, kw.length));
      } else {
        // negative keywords
        negKeywords.push(kw.slice(1, kw.length));
      }
    });

    const modifiedProduct = product;
    delete modifiedProduct.url;

    return {
      ...modifiedProduct,
      raw: product.raw,
      pos: posKeywords,
      neg: negKeywords
    };
  }

  if (sanitized) {
    return {
      ...product,
      variant: sanitized
    };
  }

  return null;
};

export const VIEWS = {
  Weekly: '7',
  Monthly: '30',
  Yearly: '365'
};

export const Groups = {
  None: 'None',
  Store: 'Store',
  Product: 'Product',
  Profile: 'Profile'
};

export const STATS_OPTIONS_LIGHT = {
  chart: {
    type: 'area',
    width: '100%',
    height: 150,
    toolbar: {
      show: false
    },
    sparkline: {
      enabled: true
    },
    selection: {
      enabled: false
    },
    zoom: {
      enabled: false
    }
  },
  colors: ['#a49bff', '#8377F4'],
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0
    }
  },
  stroke: {
    curve: 'smooth',
    width: 1
  },
  yaxis: {
    show: false
  },
  xaxis: {
    show: false,
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  },
  tooltip: {
    theme: 'light',
    intersect: false,
    marker: {
      show: false
    },
    x: {
      show: false
    },
    y: {
      formatter: (val: string) => val,
      show: false
    }
  }
};

export const STATS_OPTIONS_DARK = {
  chart: {
    type: 'area',
    width: '100%',
    height: 150,
    toolbar: {
      show: false
    },
    sparkline: {
      enabled: true
    },
    selection: {
      enabled: false
    },
    zoom: {
      enabled: false
    }
  },
  colors: ['#a49bff', '#8377F4'],
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 0
    }
  },
  stroke: {
    curve: 'smooth',
    width: 1
  },
  yaxis: {
    show: false
  },
  xaxis: {
    show: false,
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      show: false
    },
    tooltip: {
      enabled: false
    }
  },
  tooltip: {
    theme: 'dark',
    intersect: false,
    marker: {
      show: false
    },
    x: {
      show: false
    },
    y: {
      formatter: (val: string) => val,
      show: false
    }
  }
};

export const fullDay: any = {
  Su: 'Sunday',
  M: 'Monday',
  Tu: 'Tuesday',
  W: 'Wednesday',
  Th: 'Thursday',
  F: 'Friday',
  Sa: 'Saturday'
};

type StatusMap = string[];

export const failedStatuses: StatusMap = [
  'Error',
  'Invalid',
  'PX blocked',
  'Delaying',
  'No sessions',
  'Max retries',
  'not available',
  'Akamai ban',
  'Banned',
  'Profile already used',
  'Profile not found',
  'Card declined',
  'No cookies available',
  'No size matched',
  'Exceeded max price',
  'No rates available',
  'Variant not live',
  'Unsupported country',
  'Access denied',
  'Account required',
  'Product not live',
  'Payment failed',
  'Out of stock',
  'Checkout failed',
  'Password page',
  'Product not found',
  'retrying',
  'No matching price',
  'IP Banned'
];

export const warningStatuses: StatusMap = [
  'Starting at',
  'Session opened',
  'Sleeping',
  'Polling',
  'Captcha',
  'Calculating',
  'Processing',
  'Waiting',
  'Queue'
];

export const neutralStatuses: StatusMap = ['Duplicate order', 'Checking order'];

export const successStatuses: StatusMap = ['Passed splash', 'Check email'];

export const EXPENSES_OPTIONS_LIGHT = {
  chart: {
    type: 'bar',
    width: '100%',
    height: '100%',
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '55%',
      endingShape: 'flat',
      distributed: true,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: false
  },
  colors: ['#8E83F4'],
  xaxis: {
    categories: ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'],
    labels: {
      style: {
        fontSize: '12px',
        colors: [
          '#979797',
          '#979797',
          '#979797',
          '#979797',
          '#979797',
          '#979797',
          '#979797'
        ]
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    dataLabels: {
      enabled: false,
      offsetY: -20
    }
  },
  yaxis: {
    show: false
  },
  tooltip: {
    enabled: true,
    offsetY: -35,
    x: {
      show: true,
      formatter: (series: string) => fullDay[series]
    },
    y: {
      show: true,
      formatter: (total: string) => `$${total}`
    },
    theme: 'light',
    marker: {
      show: false
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.15,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [100, 0]
    }
  }
};

export const EXPENSES_OPTIONS_DARK = {
  chart: {
    type: 'bar',
    width: '100%',
    height: '100%',
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '55%',
      endingShape: 'flat',
      distributed: true,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: false
  },
  colors: ['#8E83F4'],
  xaxis: {
    categories: ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'],
    labels: {
      style: {
        fontSize: '12px',
        colors: [
          '#979797',
          '#979797',
          '#979797',
          '#979797',
          '#979797',
          '#979797',
          '#979797'
        ]
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    dataLabels: {
      enabled: false,
      offsetY: -20
    }
  },
  yaxis: {
    show: false
  },
  tooltip: {
    enabled: true,
    offsetY: -35,
    x: {
      show: true,
      formatter: (series: string) => fullDay[series]
    },
    y: {
      show: true,
      formatter: (total: string) => `$${total}`
    },
    theme: 'dark',
    marker: {
      show: false
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.15,
      gradientToColors: undefined,
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [100, 0]
    }
  }
};
