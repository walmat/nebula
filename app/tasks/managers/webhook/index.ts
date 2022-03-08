import { app, ipcMain, IpcMainEvent } from 'electron';
import { WebhookClient, MessageEmbed } from 'discord.js';
import SlackWebhook from 'slack-webhook';
import { AycdClient, build as buildAycd } from './aycd';
import { build as buildDiscord } from './discord';
import { build as buildSlack } from './slack';

import { Webhook, Webhooks, WebhookData, TestProps } from '../typings';

import { IPCKeys } from '../../../constants/ipc';

export const validURL = (str: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.,~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );

  return !!pattern.test(str);
};

export const getColor = (success: boolean, asNumber = false) => {
  if (success) {
    if (asNumber) {
      return 9339892;
    }
    return '#8E83F4';
  }

  if (asNumber) {
    return 15679838;
  }

  return '#EF415E';
};

export class WebhookManager {
  webhooks: Webhooks;

  constructor() {
    this.webhooks = {};

    ipcMain.on(IPCKeys.TestWebhook, this.test);
    ipcMain.on(IPCKeys.AddWebhooks, this.registerAll);
    ipcMain.on(IPCKeys.RemoveWebhooks, this.deregisterAll);
  }

  /**
   * Registers a webhook object on the main process
   * @param webhook - webhook object
   */
  register = (webhook: Webhook) => {
    if (webhook.type === 'discord') {
      const [, , , , , id, token] = webhook.url.split('/');
      this.webhooks[webhook.id] = {
        ...webhook,
        client: new WebhookClient({ id, token })
      };
    } else if (webhook.type === 'aycd') {
      this.webhooks[webhook.id] = {
        ...webhook,
        client: new AycdClient(webhook.url)
      };
    } else if (webhook.type === 'slack') {
      this.webhooks[webhook.id] = {
        ...webhook,
        client: new SlackWebhook(webhook.url)
      };
    }
  };

  /**
   * Deregisters a webhook object from the main process
   * @param id - webhook id to deregister
   */
  deregister = ({ id }: Webhook) => {
    if (!this.webhooks[id]) {
      return;
    }

    delete this.webhooks[id];
  };

  /**
   * Registers a webhook (or list of) on the main process
   * @param webhooks list of webhooks (or webhook) to register
   */
  registerAll = (_: IpcMainEvent, webhooks: Webhook | Webhook[]) => {
    if (Array.isArray(webhooks)) {
      return Promise.allSettled(webhooks.map(w => this.register(w)));
    }
    return this.register(webhooks);
  };

  /**
   * Deregisters a webhook (or list of) from the main process
   * @param webhooks list of webhooks (or webhook) to deregister
   */
  deregisterAll = (_: IpcMainEvent, webhooks: Webhook | Webhook[]) => {
    if (Array.isArray(webhooks)) {
      return Promise.allSettled(webhooks.map(w => this.deregister(w)));
    }
    return this.deregister(webhooks);
  };

  build(data: WebhookData, type: string) {
    switch (type) {
      default:
      case 'discord':
        return buildDiscord(data);
      case 'slack':
        return buildSlack(data);
      case 'aycd':
        return buildAycd(data);
    }
  }

  log(data: WebhookData) {
    const { success } = data;

    Object.values(this.webhooks).forEach(({ client, declines, type }) => {
      const embed = this.build({ ...data, date: new Date() }, type);

      // if success, or !!success and we want declines sent
      if (success || (!success && (declines || declines === undefined))) {
        client.send({ embeds: [embed] });
      }
    });
  }

  test = (_: IpcMainEvent, { id }: TestProps) => {
    const webhook = this.webhooks[id];
    if (!webhook) {
      return;
    }

    const date = new Date();

    const { client, type } = webhook;

    let embed = {};
    switch (type) {
      default:
      case 'discord': {
        embed = new MessageEmbed()
          .setColor(9339892)
          .setTitle("Yup! You're connected and ready to go. 😎")
          .setDescription(
            'Please be aware that Discord rate limits webhook\n messages to 5 messages per 10 seconds.'
          )
          .setTimestamp(date.valueOf())
          .setFooter(
            `Nebulabots v${app.getVersion()} © ${date.getFullYear()}`,
            'https://nebulabots.s3.amazonaws.com/nebula-logo.png'
          );
        break;
      }

      case 'aycd': {
        embed = {
          color: 9339892,
          title: "Yup! You're connected and ready to go. 😎",
          description:
            'Please be aware that Discord rate limits webhook\n messages to 5 messages per 10 seconds.',
          timestamp: date.toISOString(),
          footer: {
            text: `Nebulabots v${app.getVersion()} © ${date.getFullYear()}`,
            icon_url: 'https://nebulabots.s3.amazonaws.com/nebula-logo.png'
          }
        };
        break;
      }

      case 'slack': {
        embed = {
          attachments: [
            {
              title: "Yup! You're connected and ready to go. 😎",
              text:
                'Please be aware that Discord rate limits webhook\n messages to 5 messages per 10 seconds.',
              color: 9339892,
              fields: [],
              footer: `Nebulabots v${app.getVersion()} @ ${date.getFullYear()}`,
              footer_icon:
                'https://nebulabots.s3.amazonaws.com/nebula-logo.png',
              ts: date.valueOf()
            }
          ]
        };
        break;
      }
    }

    return client.send({ embeds: [embed] });
  };
}
