'use client';

import { useQuery } from '@tanstack/react-query';

import { TTopicId } from '@/features/topics/types';
import { getWorkoutStatsHistory } from '@/features/workout-stats/actions/getWorkoutStatsHistory';

interface TWorkoutStatsHistoryData {
  totalWorkouts: number;
  averageAccuracy: number;
  bestAccuracy: number;
  worstAccuracy: number;
  averageTime: number;
  fastestTime: number;
  slowestTime: number;
  totalTimeSpent: number;
  streak: number;
  lastWorkout: Date | null;
  recentWorkouts: Array<{
    id: string;
    accuracy: number;
    timeSeconds: number;
    questionsCount: number;
    createdAt: Date;
  }>;
  accuracyTrend: 'improving' | 'declining' | 'stable';
  speedTrend: 'improving' | 'declining' | 'stable';
  consistencyScore: number;
}

export function useWorkoutStatsHistory(topicId?: TTopicId) {
  const query = useQuery({
    queryKey: ['workout-stats-history', topicId],
    queryFn: async () => {
      if (!topicId) return null;

      const workoutStats = await getWorkoutStatsHistory(topicId);

      if (workoutStats.length === 0) {
        return {
          totalWorkouts: 0,
          averageAccuracy: 0,
          bestAccuracy: 0,
          worstAccuracy: 0,
          averageTime: 0,
          fastestTime: 0,
          slowestTime: 0,
          totalTimeSpent: 0,
          streak: 0,
          lastWorkout: null,
          recentWorkouts: [],
          accuracyTrend: 'stable' as const,
          speedTrend: 'stable' as const,
          consistencyScore: 0,
        };
      }

      // Calculate basic metrics
      const totalWorkouts = workoutStats.length;
      const accuracies = workoutStats.map((stat) => stat.ratio);
      const times = workoutStats.map((stat) => stat.timeSeconds);

      const averageAccuracy = Math.round(
        accuracies.reduce((sum, acc) => sum + acc, 0) / totalWorkouts,
      );
      const bestAccuracy = Math.max(...accuracies);
      const worstAccuracy = Math.min(...accuracies);

      const averageTime = Math.round(times.reduce((sum, time) => sum + time, 0) / totalWorkouts);
      const fastestTime = Math.min(...times);
      const slowestTime = Math.max(...times);
      const totalTimeSpent = times.reduce((sum, time) => sum + time, 0);

      // Calculate streak (consecutive days with workouts)
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < workoutStats.length; i++) {
        const workoutDate = new Date(workoutStats[i].createdAt);
        workoutDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor(
          (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysDiff === i) {
          streak++;
        } else {
          break;
        }
      }

      // Get last workout date
      const lastWorkout = workoutStats[0]?.createdAt || null;

      // Prepare recent workouts data
      const recentWorkouts = workoutStats.slice(0, 5).map((stat) => ({
        id: stat.id,
        accuracy: stat.ratio,
        timeSeconds: stat.timeSeconds,
        questionsCount: stat.totalQuestions,
        createdAt: stat.createdAt,
      }));

      // Calculate trends
      const recentAccuracies = workoutStats.slice(0, 5).map((stat) => stat.ratio);
      const olderAccuracies = workoutStats.slice(5, 10).map((stat) => stat.ratio);

      let accuracyTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (recentAccuracies.length >= 3 && olderAccuracies.length >= 3) {
        const recentAvg =
          recentAccuracies.reduce((sum, acc) => sum + acc, 0) / recentAccuracies.length;
        const olderAvg =
          olderAccuracies.reduce((sum, acc) => sum + acc, 0) / olderAccuracies.length;

        if (recentAvg > olderAvg + 5) accuracyTrend = 'improving';
        else if (recentAvg < olderAvg - 5) accuracyTrend = 'declining';
      }

      const recentTimes = workoutStats.slice(0, 5).map((stat) => stat.timeSeconds);
      const olderTimes = workoutStats.slice(5, 10).map((stat) => stat.timeSeconds);

      let speedTrend: 'improving' | 'declining' | 'stable' = 'stable';
      if (recentTimes.length >= 3 && olderTimes.length >= 3) {
        const recentAvg = recentTimes.reduce((sum, time) => sum + time, 0) / recentTimes.length;
        const olderAvg = olderTimes.reduce((sum, time) => sum + time, 0) / olderTimes.length;

        if (recentAvg < olderAvg - 30)
          speedTrend = 'improving'; // Faster (lower time)
        else if (recentAvg > olderAvg + 30) speedTrend = 'declining'; // Slower (higher time)
      }

      // Calculate consistency score (lower standard deviation = higher consistency)
      const accuracyStdDev = Math.sqrt(
        accuracies.reduce((sum, acc) => sum + Math.pow(acc - averageAccuracy, 2), 0) /
          totalWorkouts,
      );
      const consistencyScore = Math.max(0, Math.round(100 - accuracyStdDev));

      return {
        totalWorkouts,
        averageAccuracy,
        bestAccuracy,
        worstAccuracy,
        averageTime,
        fastestTime,
        slowestTime,
        totalTimeSpent,
        streak,
        lastWorkout,
        recentWorkouts,
        accuracyTrend,
        speedTrend,
        consistencyScore,
      } as TWorkoutStatsHistoryData;
    },
    enabled: !!topicId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return query;
}

