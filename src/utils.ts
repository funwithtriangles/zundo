// TODO: make this a better type
export const filterState = <TState>(
  state: TState,
  ignored: string[]
): Partial<TState> => {
  const filteredState: Partial<TState> = {};
  Object.keys(state).forEach((key: string) => {
    if (!ignored.includes(key)) {
      filteredState[key as keyof TState] = state[key as keyof TState];
    }
  });
  return filteredState;
};
