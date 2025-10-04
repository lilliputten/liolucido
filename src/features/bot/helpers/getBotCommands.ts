import { TLocale } from '@/i18n/types';

export async function getBotCommands(_locale: TLocale) {
  // TODO: Generate commands list for given locale
  const botCommands = [
    {
      command: 'start',
      description: 'Start the bot',
    },
    {
      command: 'help',
      description: 'Get help with the bot',
    },
    {
      command: 'authorize',
      description: 'Get an authorization token to log in to the website',
    },
    {
      command: 'settings',
      description: 'Adjust bot settings',
    },
  ];
  return botCommands;
}
