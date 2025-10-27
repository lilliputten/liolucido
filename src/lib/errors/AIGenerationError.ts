export type AIGenerationErrorCode = '';

export const AIGenerationErrors = {
  USER_NOT_LOGGED: 'User not logged in',
  GUEST_USERS_ARE_NOT_ALLOWED_TO_GENERATE: 'Guest users are not allowed to perform generations',
  BASIC_USER_HAS_EXCEEDED_GENERATION_LIMIT: 'Basic user has exceeded the total generation limit',
  PRO_USER_HAS_EXCEEDED_GENERATION_LIMIT: 'Pro user has exceeded the monthly generation limit',
  AN_ERROR_OCCURRED: 'An error occurred while checking user generations',
} as const;
export type TAIGenerationErrorCode = keyof typeof AIGenerationErrors;

export class AIGenerationError extends Error {
  code: TAIGenerationErrorCode;
  constructor(code: TAIGenerationErrorCode, message?: string) {
    super(message || AIGenerationErrors[code]);
    this.name = 'AIGenerationError';
    this.code = code;
  }
}
