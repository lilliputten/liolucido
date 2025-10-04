import { CommandsFlavor } from '@grammyjs/commands';
import { Bot, CallbackQueryContext, CommandContext, Context, SessionFlavor } from 'grammy';

export interface SessionData {
  language_code?: string;
}

export type BotContext = Context & SessionFlavor<SessionData> & CommandsFlavor;

export type TCommandContext = CommandContext<BotContext>;
export type TCallbackContext = CallbackQueryContext<BotContext>;

export type TBot = Bot<BotContext>;
