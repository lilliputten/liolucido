'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { getErrorText } from '@/lib/helpers/strings';
import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/form';
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
  const { saveSettings, inited, userInited } = useSettingsContext();
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
    /* // DEBUG
     * const testPromise = new Promise((resolve) => setTimeout(resolve, 10000));
     * toast.promise(testPromise, {
     *   loading: 'Testing...',
     *   success: 'Successfully tested.',
     *   error: 'Can not test.',
     * });
     */
    const handleLanguageSelected = (event: CustomEvent<TSelectTopicLanguageData>) => {
      const { langCode, langName, langCustom } = event.detail;
      // Update the form fields
      const opts = { shouldDirty: true, shouldValidate: true };
      form.setValue('langCode', langCode, opts);
      form.setValue('langName', langName, opts);
      form.setValue('langCustom', langCustom, opts);
    };
    // XXX: Test theme support
    const html = document.body.parentNode as HTMLElement;
    html?.classList.add('theme-blue');
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
        const savePromise = saveSettings(editedSettings);
        /* // DEBUG
         * const savePromise = new Promise<TSettings>((resolve, _reject) => {
         *   // setTimeout(reject, 1000, 'Demo error!');
         *   setTimeout(resolve, 1000, editedSettings);
         * });
         */
        toast.promise<TSettings>(savePromise, {
          loading: 'Saving settings data...',
          success: 'Successfully saved settings.',
          error: 'Can not save settings data.',
        });
        return savePromise
          .then((updatedSettings) => {
            form.reset(updatedSettings);
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
    [form, saveSettings, settings],
  );

  const handleCancel = undefined;

  const toolbarPortalRoot = toolbarPortalRef.current;

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
      {toolbarPortalRoot &&
        createPortal(
          <SettingsFormActions
            settings={settings}
            form={form}
            isSubmitEnabled={isSubmitEnabled}
            isPending={isPending}
            onCancel={handleCancel}
            onSubmit={handleFormSubmit}
          />,
          toolbarPortalRoot,
        )}
    </>
  );
}
