'use client';

import React from 'react';
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
// import { updateSettings } from '@/features/settings/actions';
import { defaultSettings, settingsSchema, TSettings } from '@/features/settings/types';

import { SettingsFormActions } from './SettingsFormActions';
import { SettingsFormFields } from './SettingsFormFields';
import { TFormData } from './types';

const __debugShowData = false;

interface TSettingsFormProps {
  settings: TSettings;
  className?: string;
  toolbarPortalRef: React.RefObject<HTMLDivElement>;
}

export function SettingsForm(props: TSettingsFormProps) {
  const { settings, className, toolbarPortalRef } = props;
  const { setSettings } = useSettingsContext();
  const [isPending, startTransition] = React.useTransition();

  const formSchema = React.useMemo(() => settingsSchema, []);

  const defaultValues: TFormData = React.useMemo(() => defaultSettings, []);

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

  const handleFormSubmit = React.useCallback(
    (formData: TFormData) => {
      const editedSettings: TSettings = {
        ...settings,
        ...formData,
      };
      startTransition(() => {
        // const savePromise = updateSettings(editedSettings); // TODO!
        const savePromise = new Promise<TSettings>((resolve, _reject) => {
          // setTimeout(reject, 1000, 'Demo error!');
          setTimeout(resolve, 1000, editedSettings);
        });
        toast.promise<TSettings>(savePromise, {
          loading: 'Saving the settings data...',
          success: 'Successfully saved the settings',
          error: 'Can not save the settings data.',
        });
        return savePromise
          .then((updatedSettings) => {
            console.log('[SettingsForm] Settings has been updated', updatedSettings);
            setSettings(updatedSettings);
            form.reset(form.getValues());
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
    [form, setSettings, settings],
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
            isPending && 'pointer-events-none opacity-50',
            className,
          )}
        >
          {__debugShowData && isDev && (
            <pre className="opacity-50">{JSON.stringify(defaultValues, null, 2)}</pre>
          )}
          <ScrollArea>
            <SettingsFormFields
              settings={settings}
              form={form}
              isSubmitEnabled={isSubmitEnabled}
              isPending={isPending}
              onCancel={handleCancel}
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
