export interface TranslationService {
  translate: (text: string, to?: string) => Promise<string>;
  maxRequestCharacters: number;
}
