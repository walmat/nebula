import { app } from 'electron';
import SlackWebhook from 'slack-webhook';

import { WebhookData } from '../typings';
import { getColor, validURL } from '.';

export const connect = (url: string) => new SlackWebhook(url);

export const buildTitle = (
  success: boolean,
  storeName: string,
  mode: string,
  url?: string
) => {
  if (url) {
    if (success) {
      return `<${url}|Checkout Success - ${storeName} (${mode})>`;
    }
    return `<${url}|Checkout Failed - ${storeName} (${mode})>`;
  }

  if (success) {
    return `Checkout Success - ${storeName} (${mode})`;
  }
  return `Checkout Failed - ${storeName} (${mode})`;
};

export const build = ({
  success = false,
  url,
  date = new Date(),
  mode,
  proxy,
  product,
  store,
  delays,
  profile,
  quantity
}: WebhookData) => {
  const embed: any = {
    attachments: [
      {
        title: buildTitle(success, store.name, mode, url),
        color: getColor(success),
        fields: [],
        footer: `Nebulabots v${app.getVersion()} @ ${(date as any).getFullYear()}`,
        footer_icon: 'https://nebulabots.s3.amazonaws.com/nebula-logo.png',
        ts: (date as any).valueOf()
      }
    ]
  };

  // product
  const { name: productName, url: productUrl, image, size, price } = product;

  if (validURL(image)) {
    embed.attachments[0].thumb_url = image;
  }

  embed.attachments[0].fields.push({
    title: 'Product',
    value: `<${productUrl}|${productName}>`,
    short: false
  });
  embed.attachments[0].fields.push({
    title: 'Price',
    value: price,
    short: true
  });
  embed.attachments[0].fields.push({
    title: 'Size',
    value: size,
    short: true
  });

  if (quantity) {
    embed.attachments[0].fields.push({
      title: 'Quantity',
      value: `${quantity}`,
      short: true
    });
  }

  if (profile) {
    const { name: profileName } = profile;
    embed.attachments[0].fields.push({
      title: 'Profile',
      value: profileName,
      short: false
    });
  }

  if (proxy) {
    embed.attachments[0].fields.push({
      title: 'Proxy',
      value: proxy,
      short: false
    });
  } else {
    embed.attachments[0].fields.push({
      title: 'Proxy',
      value: 'None',
      short: false
    });
  }

  if (delays) {
    const { monitor, retry, checkout } = delays;
    let delay = '';
    if (monitor || monitor === 0) {
      delay += `M: ${monitor}`;
    }

    if (retry || retry === 0) {
      delay += `/ R: ${retry}`;
    }

    if (checkout || checkout === 0) {
      delay += `/ C: ${checkout}`;
    }

    embed.attachments[0].fields.push({
      title: 'Delays',
      value: delay,
      short: false
    });
  }

  return embed;
};
