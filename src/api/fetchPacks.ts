import { checkCreatePackDir } from './dirUtils';
import {
  EVENT_DOWNLOAD_PROGRESS,
  packDownloadUrl,
  packExt,
  workDir,
} from './const';
import { createWriteStream } from 'fs';
import { join } from 'path';
import axios from 'axios';
import { WebContents } from 'electron';

const fetchPacks = async (sender: WebContents, locale: string) =>
  new Promise<void>((resolve, reject) => {
    const packFileName = `${locale}.${packExt}`;
    checkCreatePackDir()
      .then(() => {
        axios
          .get(`${packDownloadUrl}/${packFileName}`, {
            responseType: 'stream',
          })
          .then(response => {
            const { data, headers } = response;
            let current = 0;
            const total = parseInt(headers['content-length'], 10);

            data.on('data', (chunk: any) => {
              current += chunk.length;
              sender.send(EVENT_DOWNLOAD_PROGRESS, current, total);
            });

            const file = createWriteStream(join(workDir, `${packFileName}`));

            file.on('error', err => {
              file.close();
              reject(err);
            });

            file.on('close', () => {
              resolve();
            });

            data.pipe(file);
          })
          .catch(downloadErr => reject(downloadErr));
      })
      .catch(dirErr => reject(dirErr));
  });

export { fetchPacks };
