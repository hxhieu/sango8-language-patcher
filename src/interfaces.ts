export type LogType = 'info' | 'warn' | 'error' | 'success';
export type SourceVariant = 'zh-tw' | 'zh-cn';

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

export interface RecordFilterModel {
  search?: string;
  pageIndex: number;
  pageSize: number;
  exact: boolean;
}

export type FetchRecordArgs = { clearCache?: boolean } & PackListModel &
  RecordFilterModel;

export interface PatchHeader {
  full: any[];
  part: any[];
}
