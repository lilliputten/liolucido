import { isDev } from '@/config';

/** Pagination limit */
export const itemsLimit = isDev ? 10 : 50;
