import { join } from 'path';
import { v2 } from '@google-cloud/translate';
import { workDir } from '../const';

const client = new v2.Translate({
  keyFilename: join(workDir, 'google-service-account.json'),
});

const maxRequestCharacters = 4000;

const translate = async (text: string, to = 'en') => {
  const [translations] = await client.translate(text, to);
  return translations;
};

const getAvailableLanguages = async () => {
  const [languages] = await client.getLanguages();
  const result: { [key: string]: string } = {};
  languages.forEach(x => {
    result[x.code] = x.name;
  });
  return result;
};

export { translate, maxRequestCharacters, getAvailableLanguages };
