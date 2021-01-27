export interface TranslationService {
  translate: (text: string, to?: string) => Promise<string>;
  maxRequestCharacters: number;
  getAvailableLanguages: () => Promise<{ [key: string]: string }>;
}
