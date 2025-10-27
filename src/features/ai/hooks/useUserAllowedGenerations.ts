import React from 'react';

import { getErrorText } from '@/lib/helpers';

import { checkUserAllowedGenerations } from '../actions/checkUserAllowedGenerations';

export function useUserAllowedGenerations() {
  const [allowed, setAllowed] = React.useState<boolean | undefined>();
  const [error, setError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkGenerations = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const result = await checkUserAllowedGenerations();
        setAllowed(result);
      } catch (error) {
        const errMsg = getErrorText(error);
        // eslint-disable-next-line no-console
        console.error('[useUserAllowedGenerations]', errMsg, {
          error,
        });
        debugger; // eslint-disable-line no-debugger
        setError(errMsg);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };
    checkGenerations();
  }, []);

  return { allowed, error, loading };
}
