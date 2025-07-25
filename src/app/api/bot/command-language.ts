import { CommandContext, InlineKeyboard } from 'grammy';
import { getTranslations } from 'next-intl/server';

import { defaultLocale, localesList } from '@/i18n/types';

import { bot } from './core/botSinglton';
import { BotContext } from './core/botTypes';
import { getContextLocale } from './helpers/getContextLocale';

bot.command('language', async (ctx: CommandContext<BotContext>) => {
  const locale = getContextLocale(ctx);
  const tNavLocaleSwitcher = await getTranslations({
    locale: defaultLocale,
    namespace: 'NavLocaleSwitcher',
  });
  const t = await getTranslations({ locale, namespace: 'Bot' });
  const keyboard = new InlineKeyboard();
  localesList.forEach((locale) => {
    const text = tNavLocaleSwitcher('locale', { locale });
    keyboard.text(text, `select-language-${locale}`); // (ctx) => ctx.reply('You pressed A!'));
  });
  await ctx.reply(t('selectLanguage'), {
    reply_markup: keyboard,
  });
});

// Select language callbacks
localesList.forEach(async (locale) => {
  bot.callbackQuery(`select-language-${locale}`, async (ctx) => {
    const session = ctx.session;
    const tNavLocaleSwitcher = await getTranslations({
      locale: defaultLocale,
      namespace: 'NavLocaleSwitcher',
    });
    const t = await getTranslations({ locale, namespace: 'Bot' });
    const localeText = tNavLocaleSwitcher('locale', { locale });
    const text = t('languageChangedFor') + ' ' + localeText;
    session.language_code = locale;
    await ctx.answerCallbackQuery({
      text,
    });
    await ctx.editMessageReplyMarkup();
    // await initBotCommands(locale, ctx);
    await ctx.reply(text);
  });
});
