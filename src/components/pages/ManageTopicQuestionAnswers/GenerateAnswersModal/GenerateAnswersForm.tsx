'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/Form';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Slider } from '@/components/ui/Slider';
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import { FormHint } from '@/components/blocks/FormHint';
import { MarkdownHint } from '@/components/blocks/MarkdownHint';
import * as Icons from '@/components/shared/Icons';
import { isDev } from '@/constants';
import {
  generateQuestionAnswersParamsSchema,
  generationTypes,
  generationTypeTexts,
} from '@/features/ai/actions/generateQuestionAnswers';
import { TQuestionId } from '@/features/questions/types';

const formSchema = generateQuestionAnswersParamsSchema.pick({
  debugData: true,
  generationType: true,
  answersCountMin: true,
  answersCountMax: true,
  extraText: true,
});

export type TFormData = z.infer<typeof formSchema>;

export interface TGenerateAnswersFormProps {
  handleGenerateAnswers: (p: TFormData) => Promise<unknown>;
  handleClose?: () => void;
  className?: string;
  isPending?: boolean;
  questionId: TQuestionId; // Is it required here?
}

const __useDebugData = true;

const maxAnswersToGeneration = 20;

export function GenerateAnswersForm(props: TGenerateAnswersFormProps) {
  const {
    className,
    handleGenerateAnswers,
    handleClose,
    isPending,
    // questionId,
  } = props;

  const defaultValues: TFormData = React.useMemo(
    () => ({
      debugData: isDev,
      generationType: generationTypes[0],
      answersCountMin: 1,
      answersCountMax: 5,
      extraText: '',
    }),
    [],
  );

  // @see https://react-hook-form.com/docs/useform
  const form = useForm<TFormData>({
    mode: 'onChange',
    criteriaMode: 'all',
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { formState, handleSubmit } = form;

  const { isValid } = formState;

  const isSubmitEnabled = !isPending && isValid;

  const onSubmit = handleSubmit((formData) => {
    // const { generationType, answersCountMin, answersCountMax, extraText } = formData;
    handleGenerateAnswers(formData);
  });

  const onClose = (ev: React.MouseEvent) => {
    if (handleClose) {
      handleClose();
    }
    ev.preventDefault();
  };

  const generationTypeKey = React.useId();
  const answersCountKey = React.useId();
  const extraTextKey = React.useId();
  const debugDataKey = React.useId();

  const Icon = isPending ? Icons.Spinner : Icons.Check;
  const buttonText = isPending ? 'Generating' : 'Generate';

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
        className={cn(
          isDev && '__GenerateAnswersForm', // DEBUG
          'flex w-full flex-col gap-4',
          className,
        )}
      >
        {__useDebugData && (
          <FormField
            name="debugData"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-4">
                <Label className="m-0" htmlFor={debugDataKey}>
                  Use debug data?
                </Label>
                <FormControl>
                  <Switch
                    id={debugDataKey}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-red-500 data-[state=checked]:hover:bg-red-600"
                  />
                </FormControl>
                <FormHint>
                  Enable to use fake local data instead of making actual API calls.
                </FormHint>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          name="generationType"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label className="m-0" htmlFor={generationTypeKey}>
                Generation Type
              </Label>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={generationTypeKey}>
                    <SelectValue placeholder="Select generation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {generationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {generationTypeTexts[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormHint>Choose the type of answers to generate.</FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="flex w-full flex-col gap-4">
          <Label className="m-0" htmlFor={answersCountKey}>
            Answers Count: {form.watch('answersCountMin')} - {form.watch('answersCountMax')}
          </Label>
          <FormControl>
            <Slider
              id={answersCountKey}
              min={1}
              max={maxAnswersToGeneration}
              step={1}
              // minStepsBetweenThumbs={0}
              value={[form.watch('answersCountMin'), form.watch('answersCountMax')]}
              onValueChange={(value) => {
                form.setValue('answersCountMin', value[0]);
                form.setValue('answersCountMax', value[1]);
              }}
            />
          </FormControl>
          <FormHint>Range of answers to generate (minimum - maximum).</FormHint>
          <FormMessage />
        </FormItem>
        <FormField
          name="extraText"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-4">
              <Label className="m-0" htmlFor={extraTextKey}>
                Extra Instructions (Optional)
              </Label>
              <FormControl>
                <Textarea
                  id={extraTextKey}
                  className="flex-1"
                  placeholder="Additional instructions for answers generation..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormHint>
                Optional additional context or instructions for the AI. <MarkdownHint />
              </FormHint>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col justify-between"></div>
        {/* Actions */}
        <div className="flex w-full gap-4">
          <Button
            type="submit"
            variant={isSubmitEnabled ? 'theme' : 'disabled'}
            disabled={!isSubmitEnabled}
            className="gap-2"
          >
            <Icon className={cn('size-4', isPending && 'animate-spin')} /> <span>{buttonText}</span>
          </Button>
          <Button variant="ghost" onClick={onClose} className="gap-2">
            <Icons.Close className="hidden size-4 opacity-50 sm:flex" />
            <span>Cancel</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
