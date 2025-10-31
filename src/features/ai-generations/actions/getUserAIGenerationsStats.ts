'use server';

import { getAllAIGenerations } from './getAllAIGenerations';

export async function getUserAIGenerationsStats(): Promise<{
  totalGenerations: number;
  lastMonthGenerations: number;
}> {
  const generations = await getAllAIGenerations();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const lastMonthGenerations = generations.filter(
    (gen) => gen.finishedAt && gen.finishedAt >= oneMonthAgo,
  ).length;

  return {
    totalGenerations: generations.length,
    lastMonthGenerations,
  };
}
