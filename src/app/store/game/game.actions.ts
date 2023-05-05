import { createAction, props } from '@ngrx/store';

export const setStartFlag = createAction(
  '[Game] Set Start Flag',
  props<{ res: boolean }>()
);

export const setPauseFlag = createAction(
  '[Game] Set Pause Flag',
  props<{ res: boolean }>()
);

export const setGameOverFlag = createAction(
  '[Game] Set Game Over Flag',
  props<{ res: boolean }>()
);

export const setBallMoveFlag = createAction(
  '[Game] Set Ball Move Flag',
  props<{ res: boolean }>()
);

export const restartFlags = createAction('[Game] Restart Flag');
