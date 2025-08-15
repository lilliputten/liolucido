import React from 'react';
import { toast } from 'sonner';

import { isDev } from '@/constants';
import { TTopic } from '@/features/topics/types';
import { TWorkoutData } from '@/features/workouts/types';

import { useSessionUser } from './useSessionUser';

const _shuffleQuestionsStr = (ids: string[]) => {
  return [...ids].sort(() => Math.random() - 0.5).join(' ');
};

// TODO: Move to helpers
function safeJsonParse<T = unknown>(data: string, defaultValue: T) {
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

export function useWorkout(topic: TTopic, questionIds: string[] = []) {
  const topicId = topic.id;
  const [workout, setWorkout] = React.useState<TWorkoutData | null>(null);
  const [initialized, setInitialized] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const user = useSessionUser();

  // const memo = React.useMemo<TMemo>(() => ({}), []);
  // memo.topicId = topicId;

  /** Helper function to save the workout data to the server or local storage */
  const _updateWorkoutData = React.useCallback(
    async (data: Partial<TWorkoutData>, method: 'POST' | 'PUT' | 'DELETE' = 'PUT') => {
      const isDelete = method === 'DELETE';
      const isNew = method === 'POST';
      if (user?.id) {
        try {
          const url = isNew ? '/api/workouts' : `/api/workouts/${topicId}`;
          const requestData = isDelete ? undefined : isNew ? { topicId, ...data } : data;
          const requestInit: RequestInit = {
            method,
            headers: !isDelete ? { 'Content-Type': 'application/json' } : {},
            body: requestData != undefined ? JSON.stringify(requestData) : undefined,
          };
          const res = await fetch(url, requestInit);
          const body = await res.text();
          if (!res.ok) {
            const error = new Error('Cannot update a workout data on the server');
            // prettier-ignore
            console.warn('[useWorkout:_updateWorkoutData]', error.message, { // eslint-disable-line no-console
              error,
              body,
              res,
              requestInit,
              url,
              isNew,
              isDelete,
              data,
              method,
            });
            toast.error(error.message);
            debugger; // eslint-disable-line no-debugger
          } else if (!isDelete) {
            const result = safeJsonParse(body, null);
            setWorkout(result);
            return result;
          } else if (isDelete) {
            setWorkout(null);
          }
        } catch (error) {
          const msg = 'Failed to save workout data';
          // eslint-disable-next-line no-console
          console.error(msg, error);
          debugger; // eslint-disable-line no-debugger
          toast.error(msg);
        }
      } else if (typeof localStorage === 'object') {
        if (isDelete) {
          localStorage.removeItem(`workout-${topicId}`);
          setWorkout(null);
        } else {
          const updatedWorkout = workout ? { ...workout, ...data } : data;
          localStorage.setItem(`workout-${topicId}`, JSON.stringify(updatedWorkout));
          setWorkout(updatedWorkout as TWorkoutData);
          return updatedWorkout;
        }
      }
    },
    [topicId, user?.id, workout],
  );

  /** Retrieve workout data from the server or local storage.
   * In case of authentificated user, will be invoked twice, 'cause the session user will be initialized with a delay.
   */
  const fetchWorkout = React.useCallback(() => {
    const userId = user?.id;
    return new Promise<void>((resolve) => {
      if (!topicId) {
        // ???
        return resolve();
      }
      startTransition(async () => {
        if (isDev) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        if (userId) {
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
            const msg = 'Failed to fetch workout';
            // eslint-disable-next-line no-console
            console.error(msg, error);
            debugger; // eslint-disable-line no-debugger
            setWorkout(null);
            toast.error(msg);
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
            const msg = 'Failed to parse workout from local storage';
            // eslint-disable-next-line no-console
            console.error(msg, error);
            debugger; // eslint-disable-line no-debugger
            setWorkout(null);
            // toast.error(msg);
          }
        }
        setInitialized(true);
        resolve();
      });
    });
  }, [topicId, user?.id]);

  const createWorkout = React.useCallback(() => {
    return new Promise<void>((resolve) => {
      // if (!workout) return resolve();
      startTransition(async () => {
        const questionsOrder = _shuffleQuestionsStr(questionIds);
        await _updateWorkoutData({ questionsOrder, finished: false }, 'POST');
        resolve();
      });
    });
  }, [questionIds, _updateWorkoutData]);

  const deleteWorkout = React.useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!workout) return resolve();
      startTransition(async () => {
        await _updateWorkoutData({}, 'DELETE');
        resolve();
      });
    });
  }, [workout, _updateWorkoutData]);

  const goPrevQuestion = React.useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!workout || !workout.stepIndex) return resolve();
      startTransition(async () => {
        const newStepIndex = workout.stepIndex ? workout.stepIndex - 1 : 0;
        await _updateWorkoutData({
          stepIndex: newStepIndex,
        });
        resolve();
      });
    });
  }, [workout, _updateWorkoutData]);

  const goNextQuestion = React.useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!workout) return resolve();
      startTransition(async () => {
        const newStepIndex = (workout.stepIndex || 0) + 1;
        const finished = newStepIndex >= questionIds.length;
        await _updateWorkoutData({
          stepIndex: finished ? 0 : newStepIndex,
          finished,
        });
        resolve();
      });
    });
  }, [workout, _updateWorkoutData, questionIds.length]);

  const saveResult = React.useCallback(
    (result: boolean | undefined) => {
      return new Promise<void>((resolve) => {
        if (!workout) return resolve();
        startTransition(async () => {
          const currentResults = workout.questionResults || '[]';
          const resultsList = safeJsonParse(currentResults, []);
          resultsList[workout.stepIndex || 0] = result == undefined ? null : Number(result);
          const newResults = JSON.stringify(resultsList);
          await _updateWorkoutData({
            questionResults: newResults,
          });
          resolve();
        });
      });
    },
    [workout, _updateWorkoutData],
  );

  const saveResultAndGoNext = React.useCallback(
    (result: boolean | undefined) => {
      return new Promise<void>((resolve) => {
        if (!workout) return resolve();
        startTransition(async () => {
          await saveResult(result);
          await goNextQuestion();
          resolve();
        });
      });
    },
    [workout, saveResult, goNextQuestion],
  );

  const startWorkout = React.useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!workout) return resolve();
      startTransition(async () => {
        await _updateWorkoutData({
          started: true,
          finished: false,
          stepIndex: 0,
          questionResults: '',
        });
        resolve();
      });
    });
  }, [workout, _updateWorkoutData]);

  const finishWorkout = React.useCallback(() => {
    return new Promise<void>((resolve) => {
      if (!workout) return resolve();
      startTransition(async () => {
        await _updateWorkoutData({ started: false, finished: true });
        resolve();
      });
    });
  }, [workout, _updateWorkoutData]);

  React.useEffect(() => {
    fetchWorkout();
  }, [fetchWorkout]);

  return {
    topicId,
    topic,
    workout,
    pending: isPending || !initialized,
    createWorkout,
    deleteWorkout,
    startWorkout,
    finishWorkout,
    saveResult,
    saveResultAndGoNext,
    goPrevQuestion,
    goNextQuestion,
  };
}
