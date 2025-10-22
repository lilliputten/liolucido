import { isDev } from '@/constants';

/** Pagination limit */
export const itemsLimit = isDev ? 10 : 50;
