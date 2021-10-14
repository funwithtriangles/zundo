import createVanilla from 'zustand/vanilla';
import { Options } from './middleware';
import { filterState } from './utils';

// use immer patches? https://immerjs.github.io/immer/patches/

export interface UndoStoreState {
  prevStates: any[];
  futureStates: any[];
  shouldIgnoreNext: boolean,
  undo: () => void;
  redo: () => void;
  clear: () => void;
  // handle on the parent store's setter
  setStore: Function;
  // handle on the parent store's getter
  getStore: Function;
  options?: Options;
}

// factory to create undoStore. contains memory about past and future states and has methods to traverse states
export const createUndoStore = () => {
  return createVanilla<UndoStoreState>((set, get) => {
    return {
      prevStates: [],
      futureStates: [],
      shouldIgnoreNext: false,
      undo: () => {
        const { prevStates, futureStates, setStore, getStore, options } = get();
        if (prevStates.length > 0) {
          futureStates.push(filterState(getStore(), options?.omit || []));
          const prevState = prevStates.pop();
          setStore(prevState);
        }
      },
      redo: () => {
        const { prevStates, futureStates, setStore, getStore, options } = get();
        if (futureStates.length > 0) {
          prevStates.push(filterState(getStore(), options?.omit || []));
          const futureState = futureStates.pop();
          setStore(futureState);
        }
      },
      clear: () => {
        set({ prevStates: [], futureStates: [] });
      },
      setStore: () => {},
      getStore: () => {},
      options: {},
    };
  });
};
