/* See:
 * Formatting:
 * - https://grammy.dev/ref/types/parsemode
 * - https://grammy.dev/guide/basics
 *
 * Initalize a telgram bot hook via a template:
 *
 * ```bash
 * curl https://api.telegram.org/bot{BOT_TOKEN}/setWebhook?url={APP_URL}/api/bot
 * ```
 *
 * See scripts:
 *
 * - `.scripts/init-tg-bot.sh`
 *
 */

import { webhookCallback } from 'grammy';

import { bot } from './core/botSinglton';
import { initBotCommands } from './helpers/initBotCommands';

import './command-help';
import './command-language';
import './command-start';
import './command-status';
import './message-echo';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

initBotCommands();

export const POST = webhookCallback(bot, 'std/http');
