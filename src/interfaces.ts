export type LogType = 'info' | 'warn' | 'error' | 'success';

export interface LogMessage {
  message?: string;
  type: LogType;
}

export interface TranslationRecord {
  id: number;
  text?: string;
  notes?: string;
  original?: string;
}

export interface PackArchive {
  version: any;
  [key: string]: TranslationRecord[];
}

export interface PackListModel {
  local?: string;
  source?: string;
  fileType?: string;
}
