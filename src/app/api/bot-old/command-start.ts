import { InlineKeyboard } from 'grammy';
import { getTranslations } from 'next-intl/server';

import { TCommandContext } from '@/features/bot/core/botTypes';
import { getBot } from '@/features/bot/core/getBot';
import { getContextLocale } from '@/features/bot/helpers/getContextLocale';

import { webAppUrl } from './core/botConstants';

const bot = getBot();

bot.command('start', async (ctx: TCommandContext) => {
  const locale = getContextLocale(ctx);
  const t = await getTranslations({ locale, namespace: 'Bot' });
  const keyboard = new InlineKeyboard().webApp(t('openApp'), webAppUrl);
  await ctx.reply(t('start'), {
    // parse_mode: 'MarkdownV2',
    reply_markup: keyboard,
  });
});
