'use server';

import { isDev } from '@/constants';

import { TTopicId } from '../types';
import { getTopic } from './getTopic';

export async function checkIfTopicExists(id: TTopicId) {
  const topic = getTopic(id);
  return !!topic;
}
