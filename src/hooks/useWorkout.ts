import React from 'react';

import { isDev } from '@/constants';
import { TWorkoutData } from '@/features/workouts/types';

import { useSessionUser } from './useSessionUser';

export function useWorkout(topicId: string, questionIds: string[] = []) {
  const [workout, setWorkout] = React.useState<TWorkoutData | null>(null);
  const [initialized, setInitialized] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const [activeWorkout, setActiveWorkout] = React.useState(false);
  const user = useSessionUser();

  const shuffleQuestions = React.useCallback((ids: string[]) => {
    return [...ids].sort(() => Math.random() - 0.5).join(' ');
  }, []);

  const fetchWorkout = React.useCallback(() => {
    startTransition(async () => {
      if (isDev) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      if (user?.id) {
        // Fetch from server for authenticated user
        try {
          const response = await fetch(`/api/workouts/${topicId}`);
          if (response.ok) {
            const data = await response.json();
            setWorkout(data);
          } else {
            setWorkout(null);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch workout:', error);
          setWorkout(null);
        }
      } else if (typeof localStorage === 'object') {
        // Fetch from localStorage for unauthenticated user
        try {
          const stored = localStorage.getItem(`workout-${topicId}`);
          if (stored) {
            const data = JSON.parse(stored);
            setWorkout(data);
          } else {
            setWorkout(null);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse workout from localStorage:', error);
          setWorkout(null);
        }
      }
      setInitialized(true);
    });
  }, [topicId, user?.id, startTransition]);

  const createWorkout = React.useCallback(() => {
    startTransition(async () => {
      const questionsOrder = shuffleQuestions(questionIds);
      const workoutData: TWorkoutData = { questionsOrder, finished: false };

      if (user?.id) {
        // Save to server
        try {
          const response = await fetch('/api/workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topicId, questionsOrder }),
          });
          if (response.ok) {
            const data = await response.json();
            setWorkout(data);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to create workout:', error);
        }
      } else if (typeof localStorage === 'object') {
        // Save to localStorage
        localStorage.setItem(`workout-${topicId}`, JSON.stringify(workoutData));
        setWorkout(workoutData);
      }
    });
  }, [topicId, user?.id, shuffleQuestions, questionIds, startTransition]);

  const deleteWorkout = React.useCallback(() => {
    startTransition(async () => {
      if (user?.id) {
        // Delete from server
        try {
          await fetch(`/api/workouts/${topicId}`, { method: 'DELETE' });
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to delete workout:', error);
        }
      } else if (typeof localStorage === 'object') {
        // Remove from localStorage
        localStorage.removeItem(`workout-${topicId}`);
      }
      setWorkout(null);
    });
  }, [topicId, user?.id, startTransition]);

  const restartWorkout = React.useCallback(() => {
    if (!workout) return;

    startTransition(async () => {
      const questionsOrder = shuffleQuestions(questionIds);
      const updatedWorkout = { ...workout, questionsOrder, finished: false, stepIndex: 0 };

      if (user?.id) {
        // Update on server
        try {
          const response = await fetch(`/api/workouts/${topicId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedWorkout),
          });
          if (response.ok) {
            const data = await response.json();
            setWorkout(data);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to restart workout:', error);
        }
      } else if (typeof localStorage === 'object') {
        // Update localStorage
        localStorage.setItem(`workout-${topicId}`, JSON.stringify(updatedWorkout));
        setWorkout(updatedWorkout);
      }
    });
  }, [topicId, user?.id, workout, shuffleQuestions, questionIds, startTransition]);

  React.useEffect(() => {
    fetchWorkout();
  }, [fetchWorkout]);

  const saveQuestionResultAndGoTheTheNext = React.useCallback(
    (result: string) => {
      if (!workout) return;

      startTransition(async () => {
        const currentResults = workout.questionResults || '';
        const newResults = currentResults ? `${currentResults} ${result}` : result;
        const newStepIndex = (workout.stepIndex || 0) + 1;

        const updatedWorkout = {
          ...workout,
          questionResults: newResults,
          stepIndex: newStepIndex,
        };

        if (user?.id) {
          // Update on server
          try {
            const response = await fetch(`/api/workouts/${topicId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                questionResults: newResults,
                stepIndex: newStepIndex,
              }),
            });
            if (response.ok) {
              const data = await response.json();
              setWorkout(data);
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to update workout step:', error);
          }
        } else if (typeof localStorage === 'object') {
          // Update localStorage
          localStorage.setItem(`workout-${topicId}`, JSON.stringify(updatedWorkout));
          setWorkout(updatedWorkout);
        }
      });
    },
    [topicId, user?.id, workout, startTransition],
  );

  return {
    topicId,
    workout,
    pending: isPending || !initialized,
    activeWorkout,
    setActiveWorkout,
    createWorkout,
    deleteWorkout,
    restartWorkout,
    saveQuestionResultAndGoTheTheNext,
    refetch: fetchWorkout,
  };
}
