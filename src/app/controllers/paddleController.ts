export class PaddleController {
  stopFlag: boolean = false;
  progress: number = 0;
  constructor() {}

  changeFlag(value: boolean): void {
    this.stopFlag = value;
  }
}
