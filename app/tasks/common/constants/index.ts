const TaskManagerEvents = {
  Abort: 'ABORT',
  StartHarvest: 'START_CAPTCHA_HARVEST',
  StopHarvest: 'STOP_CAPTCHA_HARVEST',
  Harvest: 'CAPTCHA_HARVEST',
  StartSecure: 'START_SECURE',
  StopSecure: 'STOP_SECURE',
  Secure: 'SECURE',
  SendProxy: 'SEND_PROXY',
  DeregisterProxy: 'DEREGISTER_PROXY',
  ChangeDelay: 'CHANGE_DELAY',
  UpdateHook: 'UPDATE_HOOK',
  ProductFound: 'PRODUCT_FOUND',
  Webhook: 'WEBHOOK',
  Success: 'SUCCESS'
};

const TaskEvents = {
  All: 'ALL',
  TaskStatus: 'TASK_STATUS',
  MonitorStatus: 'MONITOR_STATUS',
  SwapTaskProxy: 'SWAP_TASK_PROXY',
  SwapMonitorProxy: 'SWAP_MONITOR_PROXY',
  ReceiveProxy: 'RECEIVE_PROXY'
};

const MonitorEvents = {
  Error: 'ERROR',
  Restart: 'RESTART'
};

const SharedStates = {
  WAIT_FOR_PRODUCT: 'WAIT_FOR_PRODUCT',
  SWAP: 'SWAP',
  DONE: 'DONE',
  ERROR: 'ERROR',
  ABORT: 'ABORT',
  CAPTCHA: 'CAPTCHA',
  RESTOCK: 'RESTOCK',
  NOOP: 'NOOP' // do not use this!
};

const Platforms = {
  Shopify: 'Shopify',
  Footsites: 'Footsites',
  Supreme: 'Supreme',
  Mesh: 'Mesh',
  Adidas: 'Adidas',
  YeezySupply: 'YeezySupply',
  NewBalance: 'NewBalance',
  EmilioPucci: 'EmilioPucci',
  Pokemon: 'Pokemon',
  Walmart: 'Walmart'
};

const ErrorCodes = {
  NoStylesFound: 'Style not found',
  NoStockLoaded: 'Stock not loaded',
  NoMatchesFound: 'Product not matched',
  PasswordPage: 'Password page',
  VariantsNotAvailable: 'Variant not available',
  VariantNotFound: 'Variant not found',
  ProductNotFound: 'Product not found',
  ProductNotLive: 'Product not live',
  InvalidParseType: 'Invalid parse type'
};

const DelayTypes = {
  checkout: 'checkoutDelay',
  error: 'errorDelay',
  monitor: 'monitorDelay'
};

const HookTypes = {
  slack: 'slack',
  discord: 'discord'
};

const ParseType = {
  Unknown: 'UNKNOWN',
  Variant: 'VARIANT',
  Url: 'URL',
  Keywords: 'KEYWORDS'
};

const SiteKeyForPlatform = {
  [Platforms.Shopify]: '6LeoeSkTAAAAAA9rkZs5oS82l69OEYjKRZAiKdaF',
  [Platforms.Supreme]: '6LeWwRkUAAAAAOBsau7KpuC9AV-6J8mhw4AjC3Xz',
  [Platforms.YeezySupply]: '6Lcoe9wUAAAAAOtgfc4c6rnvgptxiBZwDBX3Tqvl',
  [Platforms.Footsites]: '6LccSjEUAAAAANCPhaM2c-WiRxCZ5CzsjR_vd8uX',
  [Platforms.Walmart]: '6Lcj-R8TAAAAABs3FrRPuQhLMbp5QrHsHufzLf7b',
  [Platforms.Pokemon]: '6LcSzk8bAAAAAOTkPCjprgWDMPzo_kgGC3E5Vn-T'
};

const HostForPlatform = {
  [Platforms.Shopify]: 'http://checkout.shopify.com',
  [Platforms.Supreme]: 'http://www.supremenewyork.com',
  [Platforms.YeezySupply]: 'https://www.yeezysupply.com'
};

const Manager = {
  Events: TaskManagerEvents
};

const Monitor = {
  ParseType,
  DelayTypes,
  States: SharedStates,
  Events: MonitorEvents
};

const Task = {
  Events: TaskEvents,
  DelayTypes,
  HookTypes,
  Types: { Normal: 'normal', Rates: 'rates' },
  States: SharedStates
};

export {
  Manager,
  Task,
  Monitor,
  ErrorCodes,
  Platforms,
  SiteKeyForPlatform,
  HostForPlatform
};
