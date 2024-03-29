import { createReducer, on } from '@ngrx/store';
import {
  deleteBrick,
  restartBricksCoordinates,
  setBrickCoordinates,
} from './bricks.actions';
import { IBrick } from 'src/app/types/IBrick';

export interface BricksCoordinateState {
  bricks: any;
}

export const initialState: BricksCoordinateState = {
  bricks: [],
};

export const bricksReducer = createReducer(
  initialState,
  on(
    setBrickCoordinates,
    (state, { id, brick, status, hitCount, bonusName }) => {
      return {
        ...state,
        bricks: [...state.bricks, { id, brick, status, hitCount, bonusName }],
      };
    }
  ),
  on(deleteBrick, (state, { id, hitCount }) => {
    return {
      ...state,
      bricks: state.bricks.map((b) => {
        if (b.id === id && b.status) {
          if (hitCount === 0) {
            return { ...b, status: false };
          }
          return { ...b, hitCount };
        }
        return b;
      }),
    };
  }),
  on(restartBricksCoordinates, (state) => {
    const temp = [];
    return {
      ...state,
      bricks: temp,
    };
  })
);
