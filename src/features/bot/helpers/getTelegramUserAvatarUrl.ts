import { BOT_TOKEN } from '@/config/envServer';
import { getBot } from '@/features/bot/core/getBot';

export async function getTelegramUserAvatarUrl(userId: number) {
  const bot = getBot();
  const photos = await bot.api.getUserProfilePhotos(userId, { limit: 1 });
  const firstPhoto = photos.photos[0];

  if (firstPhoto) {
    // Selecting smallest photo size, e.g., index 0 or 1 (say 160x160)
    const idx = Math.min(1, firstPhoto.length);
    const fileId = firstPhoto[idx].file_id;
    if (fileId) {
      const file = await bot.api.getFile(fileId);
      if (file) {
        const image = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
        return image;
      }
    }
  }

  return undefined;
}
