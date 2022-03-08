import { app } from 'electron';
import { MessageEmbed } from 'discord.js';

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
  const color = getColor(success);

  const embed = new MessageEmbed()
    .setColor(color)
    .setTimestamp((date as any).valueOf())
    .setFooter(
      `Nebulabots v${app.getVersion()} © ${(date as any).getFullYear()}`,
      'https://nebulabots.s3.amazonaws.com/nebula-logo.png'
    );

  const { name: storeName, url: storeUrl } = store;
  if (success) {
    embed.setTitle(`Checkout Success - ${storeName} (${mode})`);
  } else {
    embed.setTitle(`Checkout Failed - ${storeName} (${mode})`);
  }

  if (url) {
    embed.setURL(url);
  } else {
    embed.setURL(storeUrl);
  }

  const { name: productName, url: productUrl, image, size, price } = product;
  if (validURL(image)) {
    embed.setThumbnail(image);
  }

  if (productName && productUrl) {
    embed.addField('Product', `[${productName}](${productUrl})`, false);
  } else if (productName) {
    embed.addField('Product', productName, false);
  } else {
    embed.addField('Product', 'Unknown', false);
  }

  if (price && /nan/i.test(price)) {
    embed.addField('Price', 'Unknown', true);
  } else if (price) {
    embed.addField('Price', price, true);
  }

  if (quantity) {
    embed.addField('Quantity', `${quantity}`, true);
  }

  if (size) {
    embed.addField('Size', size, true);
  } else {
    embed.addField('Size', 'N/A', true);
  }

  if (profile) {
    const { name: profileName } = profile;
    embed.addField('Profile', `||${profileName}||`, true);
  }

  if (proxy) {
    embed.addField('Proxy', `||${proxy}||`, true);
  } else {
    embed.addField('Proxy', 'None', true);
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

    embed.addField('Delays', `||${delay}||`, true);
  }

  return embed;
};
