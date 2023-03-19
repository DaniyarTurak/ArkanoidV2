abstract class BallBase {
  public x: number;
  public y: number;
  public dx: number = 1;
  public dy: number = 1;
  public angleX: number = 3;
  public angleY: number = 3;

  public abstract move(): void;
}

export class Ball extends BallBase {
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  public move(): void {
    this.x += this.angleX * this.dx;
    this.y += this.angleY * this.dy;
  }
}
