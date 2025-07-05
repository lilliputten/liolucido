import { bot } from './core/botSinglton';

// DEBUG: Mirror all the texts
bot.on('message:text', async (ctx) => {
  await ctx.reply(
    // Send bold text
    `*${ctx.message.text}*`,
    { parse_mode: 'MarkdownV2' },
  );
});
