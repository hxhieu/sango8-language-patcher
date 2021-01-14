import { checkCreatePackDir } from './dirUtils';
import { EVENT_DOWNLOAD_PROGRESS, packZip, packDownloadUrl } from './const';
import { createWriteStream } from 'fs';
import axios from 'axios';
import { WebContents } from 'electron';

const fetchPacks = async (sender: WebContents) =>
  new Promise<void>((resolve, reject) => {
    checkCreatePackDir()
      .then(() => {
        axios
          .get(packDownloadUrl, {
            responseType: 'stream',
          })
          .then(response => {
            const { data, headers } = response;
            let current = 0;
            const total = headers['content-length'];

            data.on('data', (chunk: any) => {
              current += chunk.length;
              sender.send(EVENT_DOWNLOAD_PROGRESS, [current, total]);
            });

            const file = createWriteStream(packZip);

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
