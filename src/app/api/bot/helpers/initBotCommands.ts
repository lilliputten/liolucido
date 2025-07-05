import { CommandGroup } from '@grammyjs/commands';
import { CallbackQueryContext, CommandContext } from 'grammy';
import { getTranslations } from 'next-intl/server';

import { bot, botCommands } from '../core/botSinglton';
import { BotContext } from '../core/botTypes';

export async function initBotCommands(
  locale?: string,
  ctx?: CommandContext<BotContext> | CallbackQueryContext<BotContext>,
) {
  const t = await getTranslations({ locale: locale || 'en', namespace: 'BotMenu' });
  const tRu = await getTranslations({ locale: 'ru', namespace: 'BotMenu' });

  function addCommand(commandsGroup: CommandGroup<BotContext>, id: string) {
    if (locale) {
      commandsGroup.command(id, t(id));
    } else {
      commandsGroup.command(id, t(id)).localize('ru', id, tRu(id));
    }
  }

  addCommand(botCommands, 'start');
  addCommand(botCommands, 'help');
  addCommand(botCommands, 'language');
  addCommand(botCommands, 'status');

  await botCommands.setCommands(bot);

  if (ctx) {
    await ctx.setMyCommands(botCommands);
  }
}
