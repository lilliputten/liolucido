'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { APIError, TPropsWithClassName } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { TActionMenuItem } from '@/components/dashboard/DashboardActions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import {
  maxNameLength,
  maxTextLength,
  minNameLength,
} from '@/components/pages/ManageTopicsPage/constants';
import { EditTopicForm } from '@/components/pages/ManageTopicsPage/EditTopicCard/EditTopicForm';
import { TFormData } from '@/components/pages/ManageTopicsPage/EditTopicCard/types';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import { updateTopic } from '@/features/topics/actions';
import { useTopicsBreadcrumbsItems } from '@/features/topics/components/TopicsBreadcrumbs';
import { TAvailableTopic, TTopicId } from '@/features/topics/types';
import {
  selectTopicEventName,
  TSelectTopicLanguageData,
} from '@/features/topics/types/TSelectTopicLanguageData';
import {
  useAvailableTopicById,
  useAvailableTopicsByScope,
  useGoBack,
  useGoToTheRoute,
} from '@/hooks';
import { useManageTopicsStore } from '@/stores/ManageTopicsStoreProvider';

interface TEditTopicPageProps extends TPropsWithClassName {
  topicId: TTopicId;
  availableTopicsQuery: ReturnType<typeof useAvailableTopicsByScope>;
  availableTopicQuery: ReturnType<typeof useAvailableTopicById>;
}

export function EditTopicPage(props: TEditTopicPageProps) {
  const {
    // topicId,
    availableTopicsQuery,
    availableTopicQuery,
  } = props;
  const { manageScope } = useManageTopicsStore();
  const routePath = `/topics/${manageScope}`;
  const goBack = useGoBack(routePath);
  const goToTheRoute = useGoToTheRoute();
  const [isPending, startTransition] = React.useTransition();

  const {
    topic,
    // queryKey: availableTopicQueryKey,
    // isFetched: isTopicFetched,
    // isLoading: isTopicLoading,
    // isCached: isTopicCached,
  } = availableTopicQuery;

  // Error: topic hasn't been found
  if (!topic) {
    throw new Error('No topic found');
  }

  const breadcrumbs = useTopicsBreadcrumbsItems({ topic, scope: manageScope });

  const formSchema = React.useMemo(
    () =>
      z
        .object({
          name: z.string().min(minNameLength).max(maxNameLength),
          // NOTE: It's impossible to limit minimal length (min) for optional strings?
          description: z.string().max(maxTextLength).optional(),
          isPublic: z.boolean().optional(),
          keywords: z.string().optional(),
          langCode: z.string().optional(),
          langName: z.string().optional(),
          langCustom: z.boolean().optional(),
          answersCountRandom: z.boolean().optional(),
          answersCountMin: z.union([z.string().optional(), z.number()]),
          answersCountMax: z.union([z.string().optional(), z.number()]),
        })
        .superRefine((data, ctx) => {
          const { answersCountRandom } = data;
          if (answersCountRandom) {
            const answersCountMin = Number(data.answersCountMin);
            const answersCountMax = Number(data.answersCountMax);
            if (!answersCountMin || answersCountMin < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'It should be a positive number.',
                path: ['answersCountMin'],
              });
            }
            if (!answersCountMax || answersCountMax < 1) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'It should be a positive number.',
                path: ['answersCountMax'],
              });
            }
            if (answersCountMin > answersCountMax) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A minimal value should be less than maximal.',
                path: ['answersCountMin'],
              });
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'A minimal value should be less than maximal.',
                path: ['answersCountMax'],
              });
            }
          }
        }),
    [],
  );

  const defaultValues: TFormData = React.useMemo(
    () => ({
      name: topic.name || '',
      description: topic.description || '',
      isPublic: topic.isPublic || false,
      keywords: topic.keywords || '',
      langCode: topic.langCode || '',
      langName: topic.langName || '',
      langCustom: topic.langCustom || false,
      answersCountRandom: topic.answersCountRandom || false,
      answersCountMin: topic.answersCountMin || undefined,
      answersCountMax: topic.answersCountMax || undefined,
    }),
    [topic],
  );

  // @see https://react-hook-form.com/docs/useform
  const form = useForm<TFormData>({
    // @see https://react-hook-form.com/docs/useform
    mode: 'onChange', // 'all', // Validation strategy before submitting behaviour.
    criteriaMode: 'all', // Display all validation errors or one at a time.
    resolver: zodResolver(formSchema),
    defaultValues, // Default values for the form.
  });

  // @see https://react-hook-form.com/docs/useform/formstate
  const { isDirty, isValid } = form.formState;

  const isSubmitEnabled = !isPending && isDirty && isValid;

  const handleReload = React.useCallback(() => {
    availableTopicQuery
      .refetch()
      .then((res) => {
        const topic = res.data;
        if (topic) {
          form.reset(topic as TFormData);
        }
      })
      .catch((error) => {
        const message = 'Cannot update topic data';
        // eslint-disable-next-line no-console
        console.error('[EditTopicForm:handleReload]', message, {
          error,
        });
        debugger; // eslint-disable-line no-debugger
        toast.error(message);
      });
  }, [availableTopicQuery, form]);

  const handleFormSubmit = React.useCallback(
    (formData: TFormData) => {
      const editedTopic: TAvailableTopic = {
        ...topic,
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        keywords: formData.keywords,
        langCode: formData.langCode,
        langName: formData.langName,
        langCustom: formData.langCustom,
        answersCountRandom: formData.answersCountRandom,
        answersCountMin: formData.answersCountMin,
        answersCountMax: formData.answersCountMax,
      };
      startTransition(async () => {
        const savePromise = updateTopic(editedTopic);
        /* // API Way
         * const url = `/api/topics/${editedTopic.id}`;
         * const savePromise = handleApiResponse<TAvailableTopic>(
         *   fetch(url, {
         *     method: 'PUT',
         *     headers: { 'Content-Type': 'application/json' },
         *     body: JSON.stringify(editedTopic),
         *   }),
         *   {
         *     onInvalidateKeys: invalidateKeys,
         *     debugDetails: {
         *       initiator: 'EditTopicForm',
         *       action: 'updateTopic',
         *       topicId: editedTopic.id,
         *     },
         *   },
         * );
         */
        toast.promise(savePromise, {
          loading: 'Saving topic data...',
          success: 'Successfully saved the topic',
          error: 'Cannot save topic data.',
        });
        try {
          const topic = await savePromise;
          availableTopicQuery.queryClient.setQueryData(availableTopicQuery.queryKey, topic);
          // Add the created item to the cached react-query data
          availableTopicsQuery.updateTopic(topic);
          // Invalidate all other keys...
          availableTopicsQuery.invalidateAllKeysExcept([availableTopicsQuery.queryKey]);
          // form.reset(form.getValues());
          form.reset(topic as TFormData);
          // TODO: Update/invalidate data for `useAvailableTopicsByScope`
          /* // API Way
           * const result = await savePromise;
           * if (result.ok && result.data) {
           *   // const updatedTopic = result.data;
           *   // // Add the created item to the cached react-query data
           *   // availableTopicsQuery.updateTopic(updatedTopic);
           *   // // Invalidate all other keys...
           *   // availableTopicsQuery.invalidateAllKeysExcept([availableTopicsQuery.queryKey]);
           *   // Reset for state with the current values
           *   form.reset(form.getValues());
           * }
           */
        } catch (error) {
          const details = error instanceof APIError ? error.details : null;
          const message = 'Cannot save topic data';
          // eslint-disable-next-line no-console
          console.error('[EditTopicForm]', message, {
            details,
            error,
            topicId: editedTopic.id,
            // url,
            editedTopic,
            formData,
          });
          debugger; // eslint-disable-line no-debugger
        }
      });
    },
    [availableTopicQuery, availableTopicsQuery, form, topic],
  );

  const handleSubmit = form.handleSubmit(handleFormSubmit);

  const handleCancel = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      goBack();
    },
    [goBack],
  );

  // Delete Topic Modal
  const handleDeleteTopic = React.useCallback(() => {
    const url = `${routePath}/delete?topicId=${topic.id}&from=EditTopicForm`;
    goToTheRoute(url);
    /*
     * const hasTopic = allTopics.find(({ id }) => id === topic.id);
     * if (hasTopic) {
     *   const url = `${routePath}/delete?topicId=${topic.id}&from=EditTopicForm`;
     *   goToTheRoute(url);
     * } else {
     *   toast.error('The requested topic does not exist.');
     *   goToTheRoute(routePath, true);
     * }
     */
  }, [goToTheRoute, routePath, topic]);

  // Listen for the select language modal custom event
  React.useEffect(() => {
    const handleLanguageSelected = (event: CustomEvent<TSelectTopicLanguageData>) => {
      const { langCode, langName, langCustom, topicId } = event.detail;
      // Make sure the event is for this topic
      if (topicId === topic.id) {
        // Update the form fields
        const opts = { shouldDirty: true, shouldValidate: true };
        form.setValue('langCode', langCode, opts);
        form.setValue('langName', langName, opts);
        form.setValue('langCustom', langCustom, opts);
      }
    };
    window.addEventListener(selectTopicEventName, handleLanguageSelected as EventListener);
    return () => {
      window.removeEventListener(selectTopicEventName, handleLanguageSelected as EventListener);
    };
  }, [topic, form]);

  // Select language modal trigger
  const selectLanguage = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      const [langCode, langName, langCustom] = form.watch(['langCode', 'langName', 'langCustom']);
      const params = new URLSearchParams();
      if (langCode) params.append('langCode', langCode);
      if (langName) params.append('langName', langName);
      if (langCustom) params.append('langCustom', String(langCustom));
      const url = `${routePath}/${topic.id}/edit/select-language?${params.toString()}`;
      goToTheRoute(url);
    },
    [form, topic, routePath, goToTheRoute],
  );

  const actions: TActionMenuItem[] = React.useMemo(
    () => [
      {
        id: 'Back',
        content: 'Back',
        variant: 'ghost',
        icon: Icons.ArrowLeft,
        visibleFor: 'sm',
        onClick: goBack,
      },
      {
        id: 'Reload',
        content: 'Reload',
        title: 'Reload the data from the server',
        variant: 'ghost',
        icon: Icons.Refresh,
        visibleFor: 'lg',
        pending: availableTopicQuery.isRefetching,
        // hidden: !isDirty,
        onClick: handleReload,
      },
      {
        id: 'Reset',
        content: 'Reset',
        title: 'Reset form fields to original values',
        variant: 'ghost',
        icon: Icons.Close,
        visibleFor: 'lg',
        hidden: !isDirty,
        onClick: form.reset,
      },
      {
        id: 'Delete',
        content: 'Delete topic',
        variant: 'destructive',
        icon: Icons.Trash,
        visibleFor: 'lg',
        onClick: handleDeleteTopic,
      },
      {
        id: 'Save',
        content: 'Save',
        variant: 'theme',
        icon: Icons.Save,
        visibleFor: 'sm',
        pending: isPending,
        disabled: !isSubmitEnabled,
        onClick: handleSubmit,
      },
    ],
    [
      availableTopicQuery,
      form,
      goBack,
      handleDeleteTopic,
      handleSubmit,
      isDirty,
      isPending,
      isSubmitEnabled,
      handleReload,
    ],
  );

  return (
    <>
      <DashboardHeader
        heading="Manage Topic Properties"
        text="Extra long testing text string for text wrap and layout test"
        className={cn(
          isDev && '__EditTopicPage_DashboardHeader', // DEBUG
          'mx-6',
        )}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      {/*
      <EditTopicCard topicId={topicId} />
      */}
      <Card
        className={cn(
          isDev && '__EditTopicCard', // DEBUG
          'relative mx-6 flex flex-1 flex-col overflow-hidden py-6 xl:col-span-2',
        )}
      >
        {/* <CardContent
          className={cn(
            isDev && '__EditTopicCard_Content', // DEBUG
            'relative mt-6 flex flex-1 flex-col overflow-hidden px-0',
          )}
        > */}
        <EditTopicForm
          topic={topic}
          // onCancel={goBack}
          form={form}
          handleFormSubmit={handleFormSubmit}
          handleCancel={handleCancel}
          selectLanguage={selectLanguage}
          isPending={isPending}
        />
        {/* </CardContent> */}
      </Card>
    </>
  );
}
