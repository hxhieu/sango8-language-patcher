export type LogType = 'info' | 'warn' | 'error' | 'success';

export interface LogMessage {
  message?: string;
  type: LogType;
}
