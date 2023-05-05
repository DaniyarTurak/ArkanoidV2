import { createAction, props } from '@ngrx/store';
import { BallMode } from 'src/app/types/IPaddle';

export const setBrickCoordinates = createAction(
  '[Bricks Coordinates] Set Brick Coordinates',
  props<{
    id: number;
    brick: DOMRect;
    status: boolean;
    hitCount: number;
    bonusName: BallMode;
  }>()
);

export const deleteBrick = createAction(
  '[Bricks Coordinates] Delete Brick',
  props<{ id: number; hitCount: number }>()
);

export const restartBricksCoordinates = createAction(
  '[Bricks Coordinates] Restart'
);
