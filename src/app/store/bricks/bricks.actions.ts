import { createAction, props } from '@ngrx/store';

export const setBrickCoordinates = createAction(
  '[Bricks Coordinates] Set Brick Coordinates',
  props<{ id: number; brick: DOMRect; status: boolean }>()
);

export const deleteBrick = createAction(
  '[Bricks Coordinates] Delete Brick',
  props<{ id: number }>()
);

export const bonusDropped = createAction(
  '[Bricks Coordinates] Bonus Dropped',
  props<{ id: number; bonusName: string }>()
);
