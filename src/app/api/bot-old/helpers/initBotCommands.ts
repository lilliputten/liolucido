import { CommandGroup } from '@grammyjs/commands';
import { getTranslations } from 'next-intl/server';

import { BotContext, TCallbackContext, TCommandContext } from '@/features/bot/core/botTypes';
import { botCommands, getBot } from '@/features/bot/core/getBot';

const bot = getBot();

export async function initBotCommands(locale?: string, ctx?: TCommandContext | TCallbackContext) {
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
