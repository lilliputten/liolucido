import { useSessionUser } from '@/hooks';

import { checkIfGenerationAllowedForUser } from '../helpers/checkIfGenerationAllowedForUser';

export function useIfGenerationAllowed() {
  const user = useSessionUser();
  return checkIfGenerationAllowedForUser(user);
}
