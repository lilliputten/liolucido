import { CommandContext, InlineKeyboard } from 'grammy';
import { getTranslations } from 'next-intl/server';

import { webAppUrl } from './core/botConstants';
import { bot } from './core/botSinglton';
import { BotContext } from './core/botTypes';
import { getContextLocale } from './helpers/getContextLocale';

bot.command('start', async (ctx: CommandContext<BotContext>) => {
  const locale = getContextLocale(ctx);
  const t = await getTranslations({ locale, namespace: 'Bot' });
  const keyboard = new InlineKeyboard().webApp(t('openApp'), webAppUrl);
  await ctx.reply(t('start'), {
    // parse_mode: 'MarkdownV2',
    reply_markup: keyboard,
  });
});
