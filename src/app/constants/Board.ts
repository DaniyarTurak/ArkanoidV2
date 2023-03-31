export class Board {
  private static _instance: Board;
  width: number = 0;
  height: number = 0;

  constructor() {}

  setValues(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }
}
