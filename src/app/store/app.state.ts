import { BallState } from './ball/ball.reducer';
import { PaddleState } from './paddle/paddle.reducer';

export interface AppState {
  paddle: PaddleState;
  ball: BallState;
}
