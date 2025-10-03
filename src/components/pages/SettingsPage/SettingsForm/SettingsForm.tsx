'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';

import { removeNullUndefinedValues } from '@/lib/helpers/objects';
import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/Form';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { useSettingsContext } from '@/contexts/SettingsContext';
import { settingsSchema, TSettings } from '@/features/settings/types';
import { selectTopicEventName, TSelectTopicLanguageData } from '@/features/topics/types';
import { TDefinedUserId } from '@/features/users/types/TUser';

import { SettingsFormActions } from './SettingsFormActions';
import { SettingsFormFields } from './SettingsFormFields';
import { TFormData } from './types';

interface TSettingsFormProps {
  settings: TSettings;
  className?: string;
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
  userId?: TDefinedUserId;
}

export function SettingsForm(props: TSettingsFormProps) {
  const { settings, className, userId, toolbarPortalRef } = props;
  const { updateAndSaveSettings, inited, userInited } = useSettingsContext();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const formSchema = React.useMemo(() => settingsSchema, []);

  // @see https://react-hook-form.com/docs/useform
  const form = useForm<TFormData>({
    mode: 'onChange', // 'all', // Validation strategy before submitting behaviour.
    criteriaMode: 'all', // Display all validation errors or one at a time.
    resolver: zodResolver(formSchema),
    values: settings,
  });
  // @see https://react-hook-form.com/docs/useform/formstate
  const { isDirty, isValid } = form.formState;

  // Listen for the select language modal custom event
  React.useEffect(() => {
    const handleLanguageSelected = (event: CustomEvent<TSelectTopicLanguageData>) => {
      const { langCode, langName, langCustom } = event.detail;
      // Update the form fields
      const opts = { shouldDirty: true, shouldValidate: true };
      form.setValue('langCode', langCode, opts);
      form.setValue('langName', langName, opts);
      form.setValue('langCustom', langCustom, opts);
    };
    window.addEventListener(selectTopicEventName, handleLanguageSelected as EventListener);
    return () => {
      window.removeEventListener(selectTopicEventName, handleLanguageSelected as EventListener);
    };
  }, [form]);

  // Select language modal trigger
  const selectLanguage = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      const [langCode, langName, langCustom] = form.watch(['langCode', 'langName', 'langCustom']);
      const params = new URLSearchParams();
      if (langCode) params.append('langCode', langCode);
      if (langName) params.append('langName', langName);
      if (langCustom) params.append('langCustom', String(langCustom));
      router.push(`/settings/select-language?${params.toString()}`);
    },
    [form, router],
  );

  const isReady = userId ? userInited : inited;
  const isSubmitEnabled = isReady && !isPending && isDirty && isValid;
  const isWaiting = isPending || !isReady;

  const handleFormSubmit = React.useCallback(
    (formData: TFormData) => {
      const editedSettings: TSettings = {
        ...settings,
        ...formData,
      };
      startTransition(() => {
        const savePromise = updateAndSaveSettings(editedSettings);
        return savePromise
          .then((result) => {
            const updatedSettings = result.ok && result.data ? result.data : editedSettings;
            const settings: TSettings = settingsSchema.parse(
              removeNullUndefinedValues(updatedSettings),
            );
            form.reset(settings);
          })
          .catch((error) => {
            const message = getErrorText(error);
            // eslint-disable-next-line no-console
            console.error('[SettingsForm:handleFormSubmit]', message, {
              error,
            });
          });
      });
    },
    [form, updateAndSaveSettings, settings],
  );

  const handleCancel = undefined;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className={cn(
            isDev && '__SettingsForm', // DEBUG
            'flex w-full flex-col gap-4 overflow-hidden',
            isWaiting && 'pointer-events-none opacity-50',
            className,
          )}
        >
          <ScrollArea>
            <SettingsFormFields
              settings={settings}
              form={form}
              isSubmitEnabled={isSubmitEnabled}
              isPending={isWaiting}
              onCancel={handleCancel}
              selectLanguage={selectLanguage}
            />
          </ScrollArea>
        </form>
      </Form>
      {toolbarPortalRef.current &&
        createPortal(
          <SettingsFormActions
            settings={settings}
            form={form}
            isSubmitEnabled={isSubmitEnabled}
            isPending={isPending}
            onCancel={handleCancel}
            onSubmit={handleFormSubmit}
          />,
          toolbarPortalRef.current,
        )}
    </>
  );
}
