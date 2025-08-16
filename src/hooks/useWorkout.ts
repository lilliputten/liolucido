import React from 'react';
import { toast } from 'sonner';

import { safeJsonParse } from '@/lib/helpers/json';
import { isDev } from '@/constants';
import { TTopic, TTopicId } from '@/features/topics/types';
import { TDefinedUserId } from '@/features/users/types/TUser';
import { TWorkoutData } from '@/features/workouts/types';

/** PUT=Update, POST=Create, DELETE=Delete */
type TMethod = 'POST' | 'PUT' | 'DELETE';

type TDbResult = number | null | undefined;

const _shuffleQuestionsStr = (ids?: string[]) => {
  if (!ids || !ids.length) {
    return '';
  }
  return [...ids].sort(() => Math.random() - 0.5).join(' ');
};

interface TMemo {
  topicId?: TTopicId;
  userId?: TDefinedUserId;
  /** Previous workout */
  workout?: TWorkoutData | null;
  questionIds?: string[];
  stepIndex?: number;
}

export function useWorkout(
  topic: TTopic,
  questionIds: string[] = [],
  userId: TDefinedUserId | undefined,
) {
  const memo = React.useMemo<TMemo>(() => ({}), []);
  const topicId = (memo.topicId = topic.id);
  const [workout, setWorkout] = React.useState<TWorkoutData | null>(null);
  const [initialized, setInitialized] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  memo.userId = userId;
  memo.questionIds = questionIds;
  memo.stepIndex = workout?.stepIndex;

  /** Low-level load data function */
  const _retrieveData = React.useCallback((topicId?: TTopicId, userId?: TDefinedUserId) => {
    // const topicId = memo.topicId;
    // const userId = memo.user?.id;
    return new Promise<TWorkoutData | null>((resolve, reject) => {
      if (!topicId) {
        return resolve(null);
      }
      startTransition(async () => {
        if (isDev) {
          await new Promise((r) => setTimeout(r, 1000));
        }
        if (userId) {
          // Fetch from server for authenticated user
          try {
            const response = await fetch(`/api/workouts/${topicId}`);
            if (response.ok) {
              const data = (await response.json()) as TWorkoutData;
              return resolve(data);
            } else {
              return resolve(null);
            }
          } catch (error) {
            const msg = 'Failed to load workout';
            // eslint-disable-next-line no-console
            console.error(msg, error);
            debugger; // eslint-disable-line no-debugger
            return reject(error);
          }
        } else if (typeof localStorage === 'object') {
          // Fetch from localStorage for unauthenticated user
          try {
            const stored = localStorage.getItem(`workout-${topicId}`);
            const data = safeJsonParse(stored, null);
            return resolve(data);
          } catch (error) {
            const msg = 'Failed to load workout from local storage';
            // eslint-disable-next-line no-console
            console.error(msg, error);
            debugger; // eslint-disable-line no-debugger
            return reject(error);
          }
        }
        resolve(null);
      });
    });
  }, []);

  /** Retrieve workout data from the server or local storage.
   * In case of authentificated user, will be invoked twice, 'cause the session user will be initialized with a delay.
   */
  const fetchWorkout = React.useCallback(async () => {
    try {
      const workout = await _retrieveData(topicId, userId);
      // Parse date value (if still unparsed)
      if (workout?.startedAt && typeof workout.startedAt === 'string') {
        workout.startedAt = new Date(workout.startedAt);
      }
      if (workout?.finishedAt && typeof workout.finishedAt === 'string') {
        workout.finishedAt = new Date(workout.finishedAt);
      }
      // Prevent Updated workout effect
      memo.workout = workout;
      // Store workout data
      setWorkout(workout);
      setInitialized(true);
    } catch (error) {
      const msg = 'Failed to fetch workout';
      // eslint-disable-next-line no-console
      console.error(msg, error);
      debugger; // eslint-disable-line no-debugger
      // Prevent Updated workout effect
      memo.workout = null;
      // Store workout data
      setWorkout(null);
      toast.error(msg);
    }
  }, [memo, _retrieveData, topicId, userId]);

  /** Low-level data store function: for store the workout data to the server or to a local strage */
  const storeData = React.useCallback(
    async (data: Partial<TWorkoutData> | null, method: TMethod = 'PUT') => {
      const topicId = memo.topicId;
      const userId = memo.userId;
      const isDelete = method === 'DELETE';
      const isNew = method === 'POST';
      // const isUpdate = method === 'PUT';
      return new Promise<TWorkoutData | null>((resolve, reject) => {
        if (!topicId) {
          return resolve(null);
        }
        startTransition(async () => {
          if (isDev) {
            await new Promise((r) => setTimeout(r, 1000));
          }
          if (userId) {
            try {
              const url = isNew ? '/api/workouts' : `/api/workouts/${topicId}`;
              const requestData = isDelete ? undefined : isNew ? { topicId, ...data } : data;
              const requestInit: RequestInit = {
                method,
                headers: !isDelete ? { 'Content-Type': 'application/json' } : {},
                body: requestData != undefined ? JSON.stringify(requestData) : undefined,
              };
              /* console.log('[useWorkout:storeData]', method, {
               *   data,
               *   requestData,
               *   isDelete,
               *   isNew,
               *   isUpdate,
               *   requestInit,
               *   url,
               *   memo,
               * });
               */
              // debugger;
              const res = await fetch(url, requestInit);
              const body = await res.text();
              if (!res.ok) {
                const error = new Error('Cannot store a workout data to the server');
                // prettier-ignore
                console.warn('[useWorkout:storeData]', error.message, { // eslint-disable-line no-console
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
                debugger; // eslint-disable-line no-debugger
                reject(error);
              } else if (!isDelete) {
                const result = safeJsonParse(body, null);
                return resolve(result);
              } else if (isDelete) {
                return resolve(null);
              }
            } catch (error) {
              const msg = 'Failed to store workout data';
              // eslint-disable-next-line no-console
              console.error(msg, error);
              debugger; // eslint-disable-line no-debugger
              return reject(error);
            }
          } else if (typeof localStorage === 'object') {
            if (isDelete) {
              localStorage.removeItem(`workout-${topicId}`);
              return resolve(null);
            } else {
              const updatedWorkout = memo.workout ? { ...memo.workout, ...data } : data;
              localStorage.setItem(`workout-${topicId}`, JSON.stringify(updatedWorkout));
              return resolve(updatedWorkout as TWorkoutData);
            }
          }
        });
      });
    },
    [memo],
  );

  /** Helper function to save the workout data to the server or local storage */
  const updateWorkout = React.useCallback(
    async (data: Partial<TWorkoutData> | null, method: TMethod = 'PUT') => {
      try {
        const workout = await storeData(data, method);
        // Parse date value (if still unparsed)
        if (workout?.startedAt && typeof workout.startedAt === 'string') {
          workout.startedAt = new Date(workout.startedAt);
        }
        if (workout?.finishedAt && typeof workout.finishedAt === 'string') {
          workout.finishedAt = new Date(workout.finishedAt);
        }
        memo.workout = workout;
        setWorkout(workout);
      } catch (error) {
        const msg = 'Failed to save workout data';
        // eslint-disable-next-line no-console
        console.error(msg, error);
        debugger; // eslint-disable-line no-debugger
        toast.error(msg);
      }
    },
    [memo, storeData],
  );

  // Effect: Updated workout
  React.useEffect(() => {
    const prevWorkout = memo.workout || null;
    if (prevWorkout !== workout) {
      /** PUT=Update, POST=Create, DELETE=Delete */
      const method: TMethod = !workout ? 'DELETE' : !prevWorkout ? 'POST' : 'PUT';
      /* // DEBUG
       * const __diff = getObjectDiff(prevWorkout as object, workout as object);
       * console.log('[useWorkout:Effect: Updated workout]', method, {
       *   __diff,
       *   prevWorkout,
       *   workout,
       *   memo,
       * });
       */
      // debugger;
      updateWorkout(workout, method);
    }
  }, [memo, workout, updateWorkout]);

  const createWorkout = React.useCallback(() => {
    // Ensure that new workout data will be treated as a new one
    const questionsOrder = _shuffleQuestionsStr(memo.questionIds);
    const now = new Date();
    setWorkout((workout) => {
      const update = {
        questionsCount: memo.questionIds?.length || 0,
        questionsOrder,
        questionResults: '',
        stepIndex: 0,
        started: true,
        finished: false,
        currentRatio: 0, // Current ratio (if finished)
        currentTime: 0, // Current time remained to finish, in seconds (if finished)
        correctAnswers: 0, // Current correct answers count (if finished)
        selectedAnswerId: '', // Answer for the current question. If defined then consider that user already chosen the answer but hasn't went to the next question (show the choice and suggest to go further)
        totalRounds: 0, // Total rounds for this workout
        allRatios: '', // All score ratios through all rounds, json packed list of ints (percent)
        allTimes: '', // All score times through all rounds, in seconds, json packed list of ints (seconds)
        averageRatio: 0, // Average score ratio through all rounds, percent
        averageTime: 0, // Average score time through all rounds, in seconds
        startedAt: now,
        finishedAt: now,
      };
      return { ...workout, ...update } as TWorkoutData;
    });
  }, [memo]);

  const deleteWorkout = React.useCallback(() => {
    setWorkout(null);
  }, []);

  const finishWorkout = React.useCallback(() => {
    setWorkout((workout) => {
      if (!workout) {
        return null;
      }
      const {
        questionResults,
        startedAt,
        totalRounds,
        allRatios,
        allTimes,
        // averageRatio,
        // averageTime,
      } = workout;
      // Calculate and save statistics
      const totalSteps = memo.questionIds?.length || 0;
      const allRatiosList = safeJsonParse<number[]>(allRatios, []);
      const allTimesList = safeJsonParse<number[]>(allTimes, []);
      const newTotalRounds = totalRounds + 1;
      const finishedAt = new Date();
      const results = safeJsonParse<number[]>(questionResults, []);
      const correctAnswers = results.filter(Boolean).length;
      const currentTime = startedAt
        ? Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000)
        : 0;
      const currentRatio = totalSteps ? Math.round((100 * correctAnswers) / totalSteps) : 0;
      allTimesList.push(currentTime);
      allRatiosList.push(currentRatio);
      const averageRatio = Math.round(
        allRatiosList.reduce((summ, val) => summ + val, 0) / newTotalRounds,
      );
      const averageTime = Math.round(
        allTimesList.reduce((summ, val) => summ + val, 0) / newTotalRounds,
      );
      // TODO: Save correct answers count to statistics
      const update: Partial<TWorkoutData> = {
        started: false,
        finished: true,
        selectedAnswerId: '',
        stepIndex: 0,
        correctAnswers,
        finishedAt,
        totalRounds: newTotalRounds,
        allRatios: JSON.stringify(allRatiosList),
        allTimes: JSON.stringify(allTimesList),
        currentTime,
        currentRatio,
        averageRatio,
        averageTime,
      };
      /* console.log('[useWorkout:finishWorkout]', {
       *   update,
       *   memo,
       * });
       */
      return { ...workout, ...update };
    });
  }, [memo]);

  const goPrevQuestion = React.useCallback(() => {
    setWorkout((workout) => {
      const newStepIndex = workout?.stepIndex ? workout.stepIndex - 1 : 0;
      const update: Partial<TWorkoutData> = {
        stepIndex: newStepIndex,
        selectedAnswerId: '',
        finishedAt: new Date(),
      };
      return { ...workout, ...update } as TWorkoutData;
    });
  }, []);

  const goNextQuestion = React.useCallback(() => {
    const totalSteps = memo?.questionIds?.length || 0;
    const stepIndex = memo?.stepIndex || 0;
    if (stepIndex >= totalSteps - 1) {
      return finishWorkout();
    }
    setWorkout((workout) => {
      const newStepIndex = (workout?.stepIndex || 0) + 1;
      const update: Partial<TWorkoutData> = {
        stepIndex: newStepIndex, // finished ? 0 : newStepIndex,
        selectedAnswerId: '',
        finishedAt: new Date(),
      };
      return { ...workout, ...update } as TWorkoutData;
    });
  }, [finishWorkout, memo]);

  const saveResult = React.useCallback((result: boolean | undefined) => {
    setWorkout((workout) => {
      const currentResults = workout?.questionResults || '[]';
      const resultsList = safeJsonParse<TDbResult[]>(currentResults, []);
      const idx = workout?.stepIndex || 0;
      const resultVal = result == undefined ? null : Number(result);
      resultsList[idx] = resultVal;
      const correctAnswers = resultsList.filter(Boolean).length;
      const questionResults = JSON.stringify(resultsList);
      return {
        ...workout,
        questionResults,
        correctAnswers,
        finishedAt: new Date(),
      } as TWorkoutData;
    });
  }, []);

  const saveAnswer = React.useCallback((selectedAnswerId?: string) => {
    setWorkout((workout) => {
      const update: Partial<TWorkoutData> = {
        selectedAnswerId: selectedAnswerId || '',
        finishedAt: new Date(),
      };
      return { ...workout, ...update } as TWorkoutData;
    });
  }, []);

  const saveResultAndGoNext = React.useCallback(
    (result: boolean | undefined) => {
      saveResult(result);
      goNextQuestion();
    },
    [saveResult, goNextQuestion],
  );

  const startWorkout = React.useCallback(() => {
    const now = new Date();
    const update: Partial<TWorkoutData> = {
      startedAt: now, // (new Date()).toISOString()
      finishedAt: now,
      started: true,
      finished: false,
      stepIndex: 0,
      questionResults: '',
      selectedAnswerId: '', // Answer for the current question. If defined then consider that user already chosen the answer but hasn't went to the next question (show the choice and suggest to go further)
      currentRatio: 0, // Current ratio (if finished)
      currentTime: 0, // Current time remained to finish, in seconds (if finished)
      correctAnswers: 0, // Current correct answers count (if finished)
    };
    setWorkout(
      (workout) =>
        ({
          ...workout,
          ...update,
        }) as TWorkoutData,
    );
  }, []);

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
    saveAnswer,
    saveResultAndGoNext,
    goPrevQuestion,
    goNextQuestion,
  };
}
