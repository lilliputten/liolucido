import { randomBytes } from 'crypto';

import {
  BOT_ADMIN_USERNAME,
  PUBLIC_URL,
  USE_ALLOWED_USERS,
  WEBHOOK_HOST,
} from '@/config/envServer';
import { prisma } from '@/lib/db';
import { isDev } from '@/config';
import { minuteMs } from '@/constants';
import { getAllAllowedTelegramIds } from '@/features/allowed-users/actions/getAllAllowedTelegramIds';
import { TCommandContext } from '@/features/bot/core/botTypes';
import { getTelegramUserAvatarUrl } from '@/features/bot/helpers/getTelegramUserAvatarUrl';

const expireTime = 60 * minuteMs;

export async function authorizeCommand(ctx: TCommandContext) {
  const { from } = ctx;
  const id = from?.id;

  if (!id) {
    return await ctx.reply('Unable to identify user. Please try again.');
  }

  if (USE_ALLOWED_USERS) {
    const allowedTelegramIds = await getAllAllowedTelegramIds();
    if (!allowedTelegramIds.includes(id)) {
      return await ctx.reply(
        [
          'The bot is running in test mode, and only whitelisted users are allowed to participate.',
          `Reach the administrator (@${BOT_ADMIN_USERNAME}), and ask him to whitelist your ID (${id}).`,
        ].join('\n\n'),
      );
    }
  }

  const {
    // is_bot, // false
    first_name, // 'Ig'
    last_name,
    language_code, // 'en'
    username, // 'lilliputten'
  } = from;

  try {
    // Generate verification token
    const token = randomBytes(32).toString('hex');
    const now = Date.now();
    const expires = new Date(now + expireTime);

    const name = [first_name, last_name].filter(Boolean).join(' ') || `@${username}`;

    const image = await getTelegramUserAvatarUrl(id);

    // Store verification token in database
    await prisma.verificationToken.create({
      // TODO: Add name, language and other parameters?
      data: {
        token,
        expires,
        identifier: String(id),
        name,
        locale: language_code,
        image,
      },
    });

    // Create authorization URL
    const callbackUrl = encodeURIComponent('/');
    const urlPath = `/api/auth/callback/telegram?callbackUrl=${callbackUrl}&token=${token}`;
    const authUrl = `${WEBHOOK_HOST}${urlPath}`;
    const localUrl = `${PUBLIC_URL}${urlPath}`;

    // TODO: To use `useFormattedDuration` or whatever else
    const expiredMins = Math.round(expireTime / minuteMs);

    const helloStr = ['Hello', name].filter(Boolean).join(' ') + '!';

    // @see https://core.telegram.org/bots/api#sendmessage
    await ctx.reply(
      [
        helloStr,
        'Now you can sign-in in the application with the following authorization code:',
        token,
        `Or, just click the link below:`,
        authUrl,
        isDev && localUrl,
        `This link will expire in ${expiredMins} minutes.`,
      ]
        .filter(Boolean)
        .join('\n\n'),
      {
        // parse_mode: 'Markdown',
        link_preview_options: { is_disabled: true },
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🔐 Sign In',
                url: authUrl,
              },
            ],
          ],
        },
      },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[src/app/api/bot/authorize.ts:authorizeCommand]', {
      error,
    });
    // eslint-disable-next-line no-debugger
    debugger;
    await ctx.reply(
      'An error occurred while generating your authorization link. Please try again.',
    );
  }
}
