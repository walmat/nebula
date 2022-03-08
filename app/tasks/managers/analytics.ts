import { ipcMain } from 'electron';
import { parse } from 'json2csv';
import { stat } from 'fs';

import { appendFileSync, writeFileSync } from 'fs-extra';
import { IPCKeys } from '../../constants/ipc';

type Data = {
  success: boolean;
  store: string;
  date: string;
  order: string;
  product: string;
  price: string;
  size: string;
  name: string;
  email: string;
  card: string;
  proxy: string;
};

export class AnalyticsManager {
  file: string;

  newLine: string;

  fields: string[];

  constructor() {
    this.file = '';

    this.newLine = '\r\n';

    this.fields = [
      'success',
      'store',
      'date',
      'order',
      'product',
      'price',
      'size',
      'name',
      'email',
      'card',
      'proxy'
    ];

    ipcMain.on(IPCKeys.AddAnalyticsFile, (_, file) => {
      this.file = file;
    });

    ipcMain.on(IPCKeys.RemoveAnalyticsFile, () => {
      this.file = '';
    });
  }

  log = ({
    success,
    store,
    date,
    order,
    product,
    price,
    size,
    name,
    email,
    card,
    proxy
  }: Data) => {
    if (this.file) {
      try {
        stat(this.file, (err: any) => {
          if (err == null) {
            // write the actual data and end with newline
            const csv =
              parse(
                {
                  success,
                  store,
                  date,
                  order,
                  product,
                  price,
                  size,
                  name,
                  email,
                  card,
                  proxy
                },
                { fields: this.fields, header: false }
              ) + this.newLine;

            return appendFileSync(this.file, csv);
          }

          const csv =
            parse(
              {
                success,
                store,
                date,
                order,
                product,
                price,
                size,
                name,
                email,
                card,
                proxy
              },
              { fields: this.fields }
            ) + this.newLine;

          writeFileSync(this.file, csv);
        });
      } catch (err) {
        console.error(err);
      }
    }
  };
}
