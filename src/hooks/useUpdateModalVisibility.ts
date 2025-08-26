import React from 'react';

export function useUpdateModalVisibility(
  setVisible: (isVisible: boolean) => void,
  shouldBeVisible: boolean = true,
) {
  React.useEffect(() => {
    setVisible(shouldBeVisible);
    if (shouldBeVisible) {
      return () => {
        setVisible(false);
      };
    }
  }, [setVisible, shouldBeVisible]);
}
