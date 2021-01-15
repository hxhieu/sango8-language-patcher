import { TranslationRecord } from './translationRecord';

export interface PackArchive {
  version: any;
  [key: string]: TranslationRecord[];
}
