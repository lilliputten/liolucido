import { CallbackQueryContext, CommandContext } from 'grammy';

import { defaultLocale } from '@/i18n/types';

import { BotContext } from '../core/botTypes';

export function getContextLocale(
  ctx: CommandContext<BotContext> | CallbackQueryContext<BotContext>,
) {
  /* console.log('[getContextLocale]', {
   *   session: ctx.session,
   *   from: ctx.update.message?.from,
   * });
   */
  const session = ctx.session;
  if (session?.language_code) {
    return session.language_code;
  }
  const from = ctx.from; // ctx.update.message?.from;
  if (from?.language_code) {
    return from.language_code;
  }
  return defaultLocale;
}
