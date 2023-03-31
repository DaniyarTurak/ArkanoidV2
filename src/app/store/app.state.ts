import { BallState } from './ball/ball.reducer';
import { BricksCoordinateState } from './bricks/bricks.reducer';
import { PaddleState } from './paddle/paddle.reducer';

export interface AppState {
  paddle: PaddleState;
  ball: BallState;
  bricks: BricksCoordinateState;
}
