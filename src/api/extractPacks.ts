import { EVENT_UNZIP_PROGRESS, packDir, packZip } from './const';
import { existsSync, unlink } from 'fs';
import { WebContents } from 'electron';
import StreamZip from 'node-stream-zip';

const extractPacks = async (sender: WebContents, cleanUp: boolean = true) =>
  new Promise((resolve, reject) => {
    if (!existsSync(packZip)) {
      return;
    }
    const zip = new StreamZip({
      file: packZip,
      skipEntryNameValidation: true,
    });

    zip.on('ready', () => {
      zip.extract(null, packDir, err => {
        zip.close();
        if (err) {
          reject(err);
        } else {
          if (cleanUp) {
            unlink(packZip, () => {
              resolve();
            });
          } else {
            resolve();
          }
        }
      });

      let current = 0;
      const total = zip.entriesCount;

      zip.on('extract', () => {
        current++;
        sender.send(EVENT_UNZIP_PROGRESS, [current, total]);
      });
    });
  });

export { extractPacks };
