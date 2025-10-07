import { isDev } from '@/config';

/** Pagination limit */
export const itemsLimit = isDev ? 2 : 20;
