import { Platforms } from '../../../constants';
import CAPTCHA_TYPES from '../../../utils/captchaTypes';

export const versionForType = (type: string) => {
  switch (type) {
    default:
    case CAPTCHA_TYPES.RECAPTCHA_V2:
    case CAPTCHA_TYPES.RECAPTCHA_V2C:
      return 0; // v2 checkbox
    case CAPTCHA_TYPES.RECAPTCHA_V2I:
      return 1; // v2 invisible
    case CAPTCHA_TYPES.RECAPTCHA_V3:
      return 2; // v3 / enterprise
  }
};

export const requestAutoSolve = async ({
  autoSolve,
  id,
  platform,
  url,
  proxy,
  siteKey,
  version,
  action,
  renderParameters
}: AutoSolveProps) => {
  if (proxy) {
    return autoSolve.sendTokenRequest({
      taskId: `${id}::${platform}`,
      url,
      siteKey,
      version,
      proxy,
      proxyRequired: platform === Platforms.Shopify, // NOTE: To prevent Cap Monster cancels
      action,
      renderParameters
    });
  }

  return autoSolve.sendTokenRequest({
    taskId: `${id}::${platform}`,
    url,
    siteKey,
    version,
    proxyRequired: false,
    action,
    renderParameters
  });
};

export const cancelAutoSolve = async ({
  id,
  platform,
  autoSolve
}: {
  id: string;
  platform: string;
  autoSolve: any;
}) => {
  try {
    await autoSolve.cancelTokenRequest(`${id}::${platform}`);
  } catch (err) {
    // TODO: Proper error handling
  }
};

type PlatformForUrl = {
  [url: string]: string;
};

export const platformForUrl: PlatformForUrl = {
  'https://checkout.shopify.com': Platforms.Shopify,
  'https://www.supremenewyork.com': Platforms.Supreme,
  'https://www.yeezysupply.com': Platforms.YeezySupply,
  'https://geo.captcha-delivery.com/': Platforms.Footsites,
  'https://geo.captcha-delivery.com?pokemon': Platforms.Pokemon
};
