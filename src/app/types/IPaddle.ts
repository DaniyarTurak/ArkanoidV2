export enum BallMode {
  Speed = 'speed',
  Power = 'power',
  Default = '',
}

export interface IPaddle {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  direction: number;
  mode: BallMode;
}
