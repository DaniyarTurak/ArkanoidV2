import { Component, OnInit, OnDestroy } from '@angular/core';
import { BricksService } from 'src/app/services/bricks.service';
import { IBrick } from 'src/app/types/brick.interface';

@Component({
  selector: 'mc-bricks-container',
  templateUrl: './bricks-container.component.html',
  styleUrls: ['./bricks-container.component.scss'],
})
export class BricksContainerComponent implements OnInit, OnDestroy {
  bricksList: IBrick[][] = [];
  _subs: any = null;

  constructor(private bricksService: BricksService) {}

  ngOnInit() {
    this._subs = this.bricksService.getBricks().subscribe((data) => {
      let rowCount = data.length / 10;
      let prevIndex = 0;
      let currentIndex = 9;
      for (let i = 0; i < rowCount; i++) {
        this.bricksList[i] = data.slice(prevIndex, currentIndex);
        prevIndex = currentIndex;
        currentIndex += 10;
      }
    });
  }

  changeStatus(id: number) {
    let brick = this.bricksList
      .flat(1)
      .filter((brick: IBrick) => brick.id === id)[0];
    brick = { ...brick, status: false };
    this._subs = this.bricksService.changeStatus(brick).subscribe();
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }
}
