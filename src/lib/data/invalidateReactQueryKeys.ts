export function invalidateReactQueryKeys(keys?: string[]) {
  if (keys && keys.length) {
    console.log('[WorkoutQuestionContainer] Invalidate keys:', keys);
    // TODO: Invalidate react query keys
    // queryClient.invalidateQueries({ queryKey: keys });
  }
}
