import { AuthDataValidator, objectToAuthDataMap } from '@telegram-auth/server';
import CredentialsProvider from 'next-auth/providers/credentials';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { createUserOrUpdateTelegramUser } from '@/features/users/actions/';

export const telegramProvider = CredentialsProvider({
  id: 'telegram-auth',
  name: 'Telegram Login',
  credentials: {},
  async authorize(_credentials, req) {
    const validator = new AuthDataValidator({
      botToken: `${process.env.BOT_TOKEN}`,
    });
    const queryStr = req.url.split('?').pop();
    const sp = new URLSearchParams(queryStr);
    const queryParams = Object.fromEntries(sp);
    const data = objectToAuthDataMap(queryParams);
    /* const text = await req.text(); // Unpacked credentials
     * console.log('[telegram-provider:authorize] Got data', {
     *   data,
     *   text,
     *   _credentials,
     *   queryStr,
     *   sp,
     *   queryParams,
     *   req,
     *   validator,
     * });
     */

    const user = await validator.validate(data);

    const isOk = user.id && user.first_name;

    /* console.log('[telegram-provider:authorize] Got user', {
     *   user,
     *   data,
     * });
     */

    if (isOk) {
      const returned = {
        id: user.id.toString(),
        email: user.id.toString(),
        name: [user.first_name, user.last_name || ''].join(' '),
        image: user.photo_url,
      };
      try {
        /* console.log('[telegram-provider:authorize] Create user', {
         *   user,
         *   data,
         * });
         */
        await createUserOrUpdateTelegramUser(user);
        // TODO: Create account?
      } catch (error) {
        const description = getErrorText(error);
        const title = 'Something went wrong while creating the user.';
        // eslint-disable-next-line no-console
        console.error(title, {
          error,
          description,
        });
        debugger; // eslint-disable-line no-debugger
        toast.error(title, {
          description,
        });
      }
      return returned;
    }
    return null;
  },
});
