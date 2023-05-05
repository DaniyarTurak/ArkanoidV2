import { createReducer, on } from '@ngrx/store';
import { IBall } from 'src/app/types/IBall';
import { setBallCoordinates } from './ball.actions';

export interface BallState {
  balls: IBall[];
}

export const initialState: BallState = {
  balls: [],
};

export const ballReducer = createReducer(
  initialState,
  on(setBallCoordinates, (state, { id, ball }) => {
    return {
      ...state,
      balls: [...state.balls, { id, ball }],
    };
  })
);
