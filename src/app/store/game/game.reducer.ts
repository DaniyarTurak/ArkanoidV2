import { createReducer, on } from '@ngrx/store';
import {
  restartFlags,
  setBallMoveFlag,
  setGameOverFlag,
  setPauseFlag,
  setStartFlag,
} from './game.actions';
import { IGameStateFlags } from 'src/app/types/IGameStateFlags';

export interface GameState {
  gameFlags: IGameStateFlags;
}

export const initialState: GameState = {
  gameFlags: {
    startFlag: false,
    pauseFlag: false,
    gameOverFlag: false,
    ballMoveFlag: false,
  },
};

export const gameFlagsReducer = createReducer(
  initialState,
  on(setStartFlag, (state, { res }) => {
    return {
      ...state,
      gameFlags: {
        ...state.gameFlags,
        startFlag: res,
      },
    };
  }),
  on(setPauseFlag, (state, { res }) => {
    return {
      ...state,
      gameFlags: {
        ...state.gameFlags,
        pauseFlag: res,
      },
    };
  }),
  on(setGameOverFlag, (state, { res }) => {
    return {
      ...state,
      gameFlags: {
        ...state.gameFlags,
        gameOverFlag: res,
      },
    };
  }),
  on(setBallMoveFlag, (state, { res }) => {
    return {
      ...state,
      gameFlags: {
        ...state.gameFlags,
        ballMoveFlag: res,
      },
    };
  }),
  on(restartFlags, (state) => {
    return {
      ...state,
      gameFlags: {
        ...state.gameFlags,
        startFlag: false,
        pauseFlag: false,
        gameOverFlag: false,
        ballMoveFlag: false,
      },
    };
  })
);
