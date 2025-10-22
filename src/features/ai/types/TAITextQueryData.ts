import { AIMessageChunk } from '@langchain/core/messages';

export type TAITextQueryData = Pick<
  AIMessageChunk,
  | 'content'
  | 'name'
  | 'additional_kwargs'
  | 'response_metadata'
  | 'id'
  | 'tool_calls'
  | 'invalid_tool_calls'
  | 'usage_metadata'
>;
