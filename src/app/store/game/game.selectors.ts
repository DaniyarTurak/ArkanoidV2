import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { GameState } from './game.reducer';

const select = (state: AppState) => state.gameFlags;

export const selectGameFlags = createSelector(
  select,
  (state: GameState) => state.gameFlags
);
