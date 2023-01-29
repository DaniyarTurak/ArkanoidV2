import { BricksService } from '../services/bricks.service';
import { IBrick } from '../types/brick.interface';

export class BricksController {
  bricks: IBrick[];
  _service: any;
  isGameFinished: boolean = false;

  constructor(bricksService: BricksService) {
    this._service = bricksService;
    this._service.getBricks().subscribe((data) => {
      this.bricks = data;
    });
  }

  removeBrick(id: number): void {
    let brick = this.bricks.filter((b) => b.id == id)[0];

    brick = { ...brick, status: false };
    this._service.changeStatus(brick).subscribe();

    let isBricksVisible = this.bricks.filter((b) => b.status === true);
    if (!isBricksVisible) {
      this.isGameFinished = true;
    }

    // if (brick.status) {
    //   console.log('ID: ', id);
    //   console.log('Make False');
    //   brick = { ...brick, status: false };
    // }
    //brick = { ...brick, status: false };
    //
  }
}
