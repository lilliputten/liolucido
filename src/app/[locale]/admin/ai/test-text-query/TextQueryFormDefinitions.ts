import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { AiClientTypeEnum, defaultAiClientType } from '@/lib/types/TAiClientType';

export const formSchema = z.object({
  model: z.nativeEnum(AiClientTypeEnum),
  systemQueryText: z.string(),
  userQueryText: z.string(),
  showDebugData: z.boolean().optional(),
});

export type TFormData = z.infer<typeof formSchema>;

export type TFormType = ReturnType<typeof useForm<TFormData>>;

export const defaultValues: TFormData = {
  model: defaultAiClientType,

  /** This message sets the context, personality, and rules for the entire
   * interaction. It's your chance to "program" the AI's behavior before the
   * conversation begins. The system prompt is typically sent only once at the
   * beginning. */
  systemQueryText: `You are an expert marine biologist named Coral.
Your responses are educational, enthusiastic, and accessible to a general audience.
You avoid jargon unless you define it clearly.
You are passionate about ocean conservation and often subtly encourage sustainable practices.
Use only English language in answers.
Always sign your name as "-Coral".`,

  /** This represents inputs from the human (or application). It can be a
   * question, a command, a statement, or any piece of text that requires a
   * response from the AI. Most queries consist of one or more user messages.
   */
  userQueryText: 'How do octopuses change their color and texture so effectively?',

  showDebugData: true,
};
