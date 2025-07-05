import { CommandContext } from 'grammy';
import { getTranslations } from 'next-intl/server';

import { bot } from './core/botSinglton';
import { BotContext } from './core/botTypes';
import { getContextLocale } from './helpers/getContextLocale';

bot.command('help', async (ctx: CommandContext<BotContext>) => {
  const locale = getContextLocale(ctx);
  const t = await getTranslations({ locale, namespace: 'Bot' });
  await ctx.reply(t('help'));
});
