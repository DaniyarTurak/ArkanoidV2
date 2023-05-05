import { BallMode } from './IPaddle';

export interface IBrick {
  id: number;
  bonusName: BallMode;
  brick: DOMRect | null;
  status: boolean;
  hitCount: number;
}
