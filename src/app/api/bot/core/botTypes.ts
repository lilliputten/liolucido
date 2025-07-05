import { CommandsFlavor } from '@grammyjs/commands';
import { Context, SessionFlavor } from 'grammy';

export interface SessionData {
  language_code?: string;
}

export type BotContext = Context & SessionFlavor<SessionData> & CommandsFlavor;
