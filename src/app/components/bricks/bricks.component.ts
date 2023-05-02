import {
  Component,
  OnInit,
  ElementRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription, map } from 'rxjs';
import { BricksService } from 'src/app/services/bricks.service';
import { Store } from '@ngrx/store';
import { selectBricks } from 'src/app/store/bricks/bricks.selectors';
import { setBrickCoordinates } from 'src/app/store/bricks/bricks.actions';
import { selectGameFlags } from 'src/app/store/game/game.selectors';

@Component({
  selector: 'app-bricks',
  templateUrl: './bricks.component.html',
  styleUrls: ['./bricks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BricksComponent implements OnInit, OnChanges {
  isGameStarted: boolean;
  bricks$ = null;
  _subscription = new Subscription();

  constructor(
    private bricksService: BricksService,
    private el: ElementRef,
    private store: Store,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.select(selectGameFlags).subscribe((gameFlags) => {
      this.isGameStarted = gameFlags.startFlag;
      if (this.isGameStarted) {
        this.bricks$ = this.bricksService
          .getBricks()
          .pipe(map((bricks) => bricks.filter((b) => b.status)));
        this.cd.detectChanges();
      } else {
        this.bricks$ = null;
      }
    });

    this.store.select(selectBricks).subscribe((bricks) => {
      this.cd.detectChanges();
    });
  }

  ngOnChanges(): void {}
}
