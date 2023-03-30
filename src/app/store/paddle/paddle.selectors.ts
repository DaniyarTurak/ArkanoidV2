import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { PaddleState } from './paddle.reducer';

const select = (state: AppState) => state.paddle;

export const selectPaddle = createSelector(
  select,
  (state: PaddleState) => state.paddle
);
