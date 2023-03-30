import { createReducer, on } from '@ngrx/store';
import { IBall } from 'src/app/types/IBall';
import { setBallCoordinates } from './ball.actions';

export interface BallState {
  ball: DOMRect;
}

export const initialState: BallState = {
  ball: null,
};

export const ballReducer = createReducer(
  initialState,
  on(setBallCoordinates, (state, { ball }) => {
    return {
      ...state,
      ball: ball,
    };
  })
);
