import { createAction, props } from '@ngrx/store';
import { BallMode } from 'src/app/types/IPaddle';

export const setPaddleCoordinates = createAction(
  '[Paddle] Set Paddle Coordinates',
  props<{
    paddle: DOMRect;
    direction: number;
  }>()
);

export const setModeBall = createAction(
  '[Paddle] Set Mode',
  props<{ mode: BallMode }>()
);
