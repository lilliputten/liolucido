'use server';

import { isDev } from '@/constants';

import { TTopicId } from '../types';
import { getTopic } from './getTopic';

export async function checkIfTopicExists(id: TTopicId) {
  if (isDev) {
    // DEBUG: Emulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  const topic = getTopic(id);
  return !!topic;
}
