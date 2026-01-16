
export enum TranslationMode {
  WOMEN_TO_MEN = 'WOMEN_TO_MEN',
  MEN_TO_WOMEN = 'MEN_TO_WOMEN'
}

export type AppLanguage = 'en' | 'ru' | 'kk';

export interface TranslationResult {
  literalText: string;
  decodedMeaning: string;
  relationshipTip: string;
  vibe: string;
}

export interface HistoryItem extends TranslationResult {
  id: string;
  mode: TranslationMode;
  language: AppLanguage;
  timestamp: number;
}
