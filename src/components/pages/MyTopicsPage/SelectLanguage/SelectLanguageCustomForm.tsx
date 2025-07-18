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

import { maxIdLength, maxNameLength, minIdLength, minNameLength } from '../constants/inputFields';

type TFormData = TLanguage;

interface TProps {
  // languages: TLanguage[];
  selectLanguage: (language: TSelectLanguageData) => void; // Promise<TLanguage[]>;
  className?: string;
  langCode?: TLanguageId;
  langName?: string;
}

export const SelectLanguageCustomForm: React.FC<TProps> = (props) => {
  const { className, selectLanguage, langCode, langName } = props;
  // const refineLanguageId = React.useCallback(
  //   (value: TLanguageId) => {
  //     const found = languages.find((lang) => lang.id === value);
  //     return !found;
  //   },
  //   [languages],
  // );
  const formSchema = React.useMemo(
    () =>
      z.object({
        id: z.string().min(minIdLength).max(maxIdLength),
        // id: z.string().min(minIdLength).max(maxIdLength).refine(refineLanguageId, {
        //   message:
        //     'This language is not unique: The language id already exists in your languages list',
        // }),
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
    // reset, // UseFormReset<TFieldValues>;
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
            {/*
              <Label className="-sr-only" htmlFor="id">
                ID
              </Label>
              */}
            <Input
              id="id"
              className="flex-1"
              size={maxIdLength}
              placeholder="ID"
              // @see https://react-hook-form.com/docs/useform/register
              {...register('id', { required: true })}
            />
            {errors?.id && <p className="pb-0.5 text-sm text-red-600">{errors.id.message}</p>}
            {/*
              <p className="text-sm text-muted-foreground">
                Should be an unique value. {minIdLength}-{maxIdLength} characters.
              </p>
              */}
          </div>
          <div className="flex w-full flex-col gap-4">
            {/*
              <Label className="-sr-only" htmlFor="name">
                Name
              </Label>
              */}
            <Input
              id="name"
              className="flex-1"
              size={maxNameLength}
              placeholder="Name"
              // @see https://react-hook-form.com/docs/useform/register
              {...register('name', { required: true })}
            />
            {errors?.name && <p className="pb-0.5 text-sm text-red-600">{errors.name.message}</p>}
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
