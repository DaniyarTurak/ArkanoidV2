import { createAction, props } from '@ngrx/store';
import { IBall } from 'src/app/types/IBall';

export const setBallCoordinates = createAction(
  '[Ball] Set Ball Coordinates',
  props<{ id: number; ball: DOMRect }>()
);
