import { UserRole } from '@prisma/client';
import { User } from 'next-auth';
// NOTE: False-positive eslint error for extending existed type (see below)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt';

export type ExtendedUser = User & {
  role: UserRole;
};

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole;
  }
}

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
