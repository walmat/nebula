/* eslint-disable camelcase */
import { app, session } from 'electron';
import { request } from '../../common/utils/request';

import { WebhookData } from '../typings';
import { getColor, validURL } from '.';

export const build = ({
  success = false,
  url,
  date = new Date(),
  mode,
  product,
  store,
  delays,
  proxy,
  profile,
  quantity
}: WebhookData) => {
  const color = getColor(success, true) as number;

  const embed: any = {
    color,
    timestamp: (date as any).toISOString(),
    footer: {
      text: `Nebulabots v${app.getVersion()} © ${(date as any).getFullYear()}`,
      icon_url: 'https://nebulabots.s3.amazonaws.com/nebula-logo.png'
    },
    url: store.url,
    fields: []
  };

  const { name: storeName } = store;
  if (success) {
    embed.title = `Checkout Success - ${storeName} (${mode})`;
  } else {
    embed.title = `Checkout Failed - ${storeName} (${mode})`;
  }

  if (url) {
    embed.url = url;
  }

  const { name: productName, url: productUrl, image, size, price } = product;
  if (validURL(image)) {
    embed.thumbnail = {
      url: image
    };
  }

  if (productName && productUrl) {
    embed.fields.push({
      name: 'Product',
      value: `[${productName}](${productUrl})`,
      inline: false
    });
  } else if (productName) {
    embed.fields.push({
      name: 'Product',
      value: productName,
      inline: false
    });
  } else {
    embed.fields.push({
      name: 'Product',
      value: `N/A`,
      inline: false
    });
  }

  if (price && Number.isNaN(price)) {
    embed.fields.push({
      name: 'Price',
      value: `N/A`,
      inline: true
    });
  } else if (price) {
    embed.fields.push({
      name: 'Price',
      value: price,
      inline: true
    });
  }

  if (quantity) {
    embed.fields.push({
      name: 'Quantity',
      value: `${quantity}`,
      inline: true
    });
  }

  if (size) {
    embed.fields.push({
      name: 'Size',
      value: size,
      inline: true
    });
  } else {
    embed.fields.push({
      name: 'Size',
      value: 'N/A',
      inline: true
    });
  }

  if (profile) {
    const { name: profileName } = profile;
    embed.fields.push({
      name: 'Profile',
      value: `||${profileName}||`,
      inline: true
    });
  }

  if (proxy) {
    embed.fields.push({
      name: 'Proxy',
      value: `||${proxy}||`,
      inline: true
    });
  } else {
    embed.fields.push({
      name: 'Proxy',
      value: 'None',
      inline: true
    });
  }

  if (delays) {
    const { monitor, retry, checkout } = delays;
    let delay = '';
    if (monitor || monitor === 0) {
      delay += `M: ${monitor}`;
    }

    if (retry || retry === 0) {
      delay += ` / R: ${retry}`;
    }

    if (checkout || checkout === 0) {
      delay += ` / C: ${checkout}`;
    }

    embed.fields.push({
      name: 'Delays',
      value: `||${delay}||`,
      inline: true
    });
  }

  return embed;
};

export class AycdClient {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  send = async (embed: any) =>
    request(session.defaultSession, {
      url: this.url,
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      json: {
        embeds: [embed]
      }
    });
}
