export { UndoState, undoMiddleware } from './middleware';
export { UseStore } from 'zustand';

import createStore, { State, StateCreator } from 'zustand';
import undoMiddleware, { Options, UndoState } from './middleware';

// create a store with undo/redo functionality
export const create = <TState extends UndoState>(
  config: StateCreator<TState>,
  options?: Options
) => createStore<TState>(undoMiddleware(config, options));

export default create;
