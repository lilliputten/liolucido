export type TMessageRole = 'system' | 'user';
export type TPlainMessage = {
  role: TMessageRole;
  content: string;
};
