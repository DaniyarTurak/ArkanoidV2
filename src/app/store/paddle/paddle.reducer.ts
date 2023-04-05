import { createReducer, on } from '@ngrx/store';
import { BallMode, IPaddle } from 'src/app/types/IPaddle';
import { setModeBall, setPaddleCoordinates } from './paddle.actions';

export interface PaddleState {
  paddle: IPaddle;
}

export const initialState: PaddleState = {
  paddle: {
    paddle: null,
    mode: BallMode.Default,
    direction: 1,
  },
};

export const paddleReducer = createReducer(
  initialState,
  on(setPaddleCoordinates, (state, { paddle, direction }) => {
    return {
      ...state,
      paddle: {
        ...state.paddle,
        paddle,
        direction,
      },
    };
  }),
  on(setModeBall, (state, { mode }) => {
    return {
      ...state,
      paddle: {
        ...state.paddle,
        mode,
      },
    };
  })
);
