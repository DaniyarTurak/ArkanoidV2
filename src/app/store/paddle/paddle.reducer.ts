import { createReducer, on } from '@ngrx/store';
import { IPaddle } from 'src/app/types/IPaddle';
import { setPaddleCoordinates } from './paddle.actions';

export interface PaddleState {
  paddle: IPaddle;
}

export const initialState: PaddleState = {
  paddle: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    direction: 0,
  },
};

export const paddleReducer = createReducer(
  initialState,
  on(
    setPaddleCoordinates,
    (state, { x, y, width, height, top, left, right, bottom, direction }) => {
      return {
        ...state,
        paddle: {
          ...state.paddle,
          x,
          y,
          width,
          height,
          top,
          left,
          right,
          bottom,
          direction,
        },
      };
    }
  )
);
