import { Context } from 'grammy';
import { PhotoSize, User, UserProfilePhotos } from 'grammy/types';

import { token } from '../core/botConstants';

/*
 * @see:
 * https://api.telegram.org/bot{TOKEN}/getMe
 */

export async function getTelegramUserThumbnailUrl(ctx: Context, userId: User['id']) {
  const photos: UserProfilePhotos = await ctx.api.getUserProfilePhotos(userId);
  // TODO: To fetch minimal/optimal picture size?
  const firstPhoto: PhotoSize | undefined = photos.photos[0][0];
  const photoFile = firstPhoto ? await ctx.api.getFile(firstPhoto.file_id) : undefined;
  const photoPath = photoFile?.file_path;
  const photoUrl = photoPath && `https://api.telegram.org/file/bot${token}/${photoPath}`;
  return photoUrl;
}
