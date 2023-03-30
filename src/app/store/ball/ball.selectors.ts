import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { BallState } from './ball.reducer';

const select = (state: AppState) => state.ball;

export const selectBall = createSelector(
  select,
  (state: BallState) => state.ball
);
