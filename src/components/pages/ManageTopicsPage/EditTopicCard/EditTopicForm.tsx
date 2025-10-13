'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Form } from '@/components/ui/Form';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { isDev } from '@/constants';
import { TTopic } from '@/features/topics/types';

import { EditTopicFormFields } from './EditTopicFormFields';
import { TFormData } from './types';

const __debugShowData = false;

interface TEditTopicFormProps {
  topic: TTopic;
  className?: string;
  onCancel?: () => void;
  handleCancel: (ev: React.MouseEvent) => void;
  form: UseFormReturn<TFormData>;
  handleFormSubmit: (formData: TFormData) => void;
  selectLanguage: (ev: React.MouseEvent) => void;
  isPending: boolean;
  // toolbarPortalRef: React.RefObject<HTMLDivElement>;
}

export function EditTopicForm(props: TEditTopicFormProps) {
  const { topic, className, handleCancel, form, handleFormSubmit, selectLanguage, isPending } =
    props;

  const { isDirty, isValid } = form.formState;

  const isSubmitEnabled = !isPending && isDirty && isValid;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className={cn(
          isDev && '__EditTopicForm', // DEBUG
          'flex w-full flex-col gap-4 overflow-hidden',
          isPending && 'pointer-events-none opacity-50',
          className,
        )}
      >
        <ScrollArea>
          <EditTopicFormFields
            topic={topic}
            form={form}
            isSubmitEnabled={isSubmitEnabled}
            isPending={isPending}
            onCancel={handleCancel}
            selectLanguage={selectLanguage}
          />
        </ScrollArea>
      </form>
    </Form>
  );
}
