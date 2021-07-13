import createVanilla, { GetState, SetState } from 'zustand/vanilla';
import { Options, UndoState } from './middleware';
import { filterState } from './utils';

// use immer patches? https://immerjs.github.io/immer/patches/

export interface UndoStoreState<TState extends UndoState> {
  prevStates: Partial<TState>[];
  futureStates: Partial<TState>[];
  undo: () => void;
  redo: () => void;
  clear: () => void;
  // handle on the parent store's setter
  setStore: SetState<TState>;
  // handle on the parent store's getter
  // TODO: make this not optional
  getStore?: GetState<TState>;
  options?: Options;
}

// factory to create undoStore. contains memory about past and future states and has methods to traverse states
export const createUndoStore = <TState extends UndoState>() => {
  return createVanilla<UndoStoreState<TState>>(
    (set, get): UndoStoreState<TState> => {
      return {
        prevStates: [],
        futureStates: [],
        undo: () => {
          const {
            prevStates,
            futureStates,
            setStore,
            getStore,
            options,
          } = get();
          if (prevStates.length > 0) {
            const filteredState = filterState(
              getStore?.(),
              options?.omit || []
            );
            if (filteredState) {
              futureStates.push(filteredState);
            }
            const prevState = prevStates.pop();
            // TODO: this is incorrect casting but it works
            prevState && setStore(prevState as Pick<TState, keyof TState>);
          }
        },
        redo: () => {
          const {
            prevStates,
            futureStates,
            setStore,
            getStore,
            options,
          } = get();
          if (futureStates.length > 0) {
            const filteredState = filterState(
              getStore?.(),
              options?.omit || []
            );
            if (filteredState) {
              prevStates.push(filteredState);
            }
            const futureState = futureStates.pop();
            futureState && setStore(futureState as Pick<TState, keyof TState>);
          }
        },
        clear: () => {
          set({ prevStates: [], futureStates: [] });
        },
        setStore: () => {},
        getStore: undefined,
        options: {},
      };
    }
  );
};
