import { createReducer, on } from '@ngrx/store';
import { deleteBrick, setBrickCoordinates } from './bricks.actions';

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
        if (b.id === id && b.status) {
          return { ...b, status: false };
        }
        return b;
      }),
    };
  })
);
