import { createReducer, on } from '@ngrx/store';
import {
  bonusDropped,
  deleteBrick,
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
  on(setBrickCoordinates, (state, { id, brick, status }) => {
    return {
      ...state,
      bricks: [...state.bricks, { id, brick, status }],
    };
  }),
  on(deleteBrick, (state, { id }) => {
    return {
      ...state,
      bricks: state.bricks.map((b) => {
        if (b.id === id) {
          return { ...b, status: false };
        }
        return b;
      }),
      //bricks: state.bricks.filter((b) => b.id !== id),
    };
  })
);
