export enum BallMode {
  Speed = 'speed',
  Power = 'power',
  Default = '',
}

export interface IPaddle {
  paddle: DOMRect;
  mode: BallMode;
  direction: number;
}
