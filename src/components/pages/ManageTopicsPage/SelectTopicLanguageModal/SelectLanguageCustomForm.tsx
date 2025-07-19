'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { TLanguage, TLanguageId, TSelectLanguageData } from '@/shared/types/language';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/shared/icons';

import { maxIdLength, maxNameLength, minIdLength, minNameLength } from '../constants';

type TFormData = TLanguage;

interface TProps {
  selectLanguage: (language: TSelectLanguageData) => void; // Promise<TLanguage[]>;
  className?: string;
  langCode?: TLanguageId;
  langName?: string;
}

export const SelectLanguageCustomForm: React.FC<TProps> = (props) => {
  const { className, selectLanguage, langCode, langName } = props;
  const formSchema = React.useMemo(
    () =>
      z.object({
        id: z.string().min(minIdLength).max(maxIdLength),
        name: z.string().min(minNameLength).max(maxNameLength),
      }),
    [],
  );

  const defaultValues: TLanguage = React.useMemo(
    () => ({
      id: langCode || '',
      name: langName || '',
    }),
    [langCode, langName],
  );

  const {
    // @see https://react-hook-form.com/docs/useform
    formState, // FormState<TFieldValues>;
    handleSubmit, // UseFormHandleSubmit<TFieldValues, TTransformedValues>;
    register, // UseFormRegister<TFieldValues>;
  } = useForm<TFormData>({
    // @see https://react-hook-form.com/docs/useform
    mode: 'all', // Validation strategy before submitting behaviour.
    criteriaMode: 'all', // Display all validation errors or one at a time.
    resolver: zodResolver(formSchema),
    defaultValues, // Default values for the form.
  });

  const {
    // @see https://react-hook-form.com/docs/useform/formstate
    isDirty, // boolean;
    errors, // FieldErrors<TFieldValues>;
    isValid, // boolean;
  } = formState;

  const isSubmitEnabled = /* !isPending && */ isDirty && isValid;

  const onSubmit = handleSubmit((language) => {
    const topicLang: TSelectLanguageData = {
      langCode: language.id,
      langName: language.name,
      langCustom: true,
    };
    selectLanguage(topicLang);
  });

  // TODO: Update forms accordng to `app/(protected)/dashboard/wordsSets/AddWordsSet/AddWordsSetBlock.tsx`

  return (
    <div className={cn(className, '__SelectLanguageCustomForm', 'py-2')}>
      <p className="Text mb-4 text-sm text-muted-foreground">
        Select your own language with a custom (but unique) identifier and name.
      </p>
      <form onSubmit={onSubmit}>
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full flex-col gap-4">
            <Input
              id="name"
              className="flex-1"
              size={maxNameLength}
              placeholder="Language name"
              // @see https://react-hook-form.com/docs/useform/register
              {...register('name', { required: true })}
            />
            {errors?.name && <p className="pb-0.5 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div className="flex w-full flex-col gap-4">
            <Input
              id="id"
              className="flex-1"
              size={maxIdLength}
              placeholder="Language code"
              // @see https://react-hook-form.com/docs/useform/register
              {...register('id', { required: true })}
            />
            {errors?.id && <p className="pb-0.5 text-sm text-red-600">{errors.id.message}</p>}
          </div>
          <div className="flex w-full gap-4">
            <Button
              type="submit"
              variant={isSubmitEnabled ? 'default' : 'disable'}
              disabled={!isSubmitEnabled}
              className="flex shrink-0 gap-2"
            >
              <Icons.check className="size-4" />
              <span>Select</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
