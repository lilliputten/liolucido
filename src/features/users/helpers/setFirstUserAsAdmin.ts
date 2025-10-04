import { prisma } from '@/lib/db';
import { UserRoles } from '@/lib/db/TUserRole';
import { DatabaseError } from '@/lib/errors';
import { getErrorText } from '@/lib/helpers';

/** Check if this is the first user and set them as admin */
export async function setFirstUserAsAdmin(userId: string): Promise<boolean> {
  try {
    // Count users other than the current one
    const otherUserCount = await prisma.user.count({
      where: { id: { not: userId } },
    });
    // If no other users exist, set this user as admin
    if (otherUserCount === 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { role: UserRoles.ADMIN },
      });
      return true;
    }
    return false;
  } catch (error) {
    const nextMessage = ['Error checking the first user', getErrorText(error)]
      .filter(Boolean)
      .join(': ');
    const nextError = new DatabaseError(nextMessage);
    // eslint-disable-next-line no-console
    console.error('[setFirstUserAsAdmin]', nextMessage, {
      nextError,
      error,
      userId,
    });
    debugger; // eslint-disable-line no-debugger
    // NOTE: Re-throw an error
    throw nextError;
  }
}
