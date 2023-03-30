import { createAction, props } from '@ngrx/store';

export const setBallCoordinates = createAction(
  '[Ball] Set Ball Coordinates',
  props<{ ball: DOMRect }>()
);
