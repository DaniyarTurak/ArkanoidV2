import { AppState } from '../app.state';
import { createReducer, createSelector } from '@ngrx/store';
import { BricksCoordinateState } from './bricks.reducer';

const select = (state: AppState) => state.bricks;

export const selectBricks = createSelector(
  select,
  (state: BricksCoordinateState) => state.bricks
);
