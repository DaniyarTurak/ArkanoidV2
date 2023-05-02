import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnChanges,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { BricksService } from 'src/app/services/bricks.service';
import { selectBalls } from 'src/app/store/ball/ball.selectors';
import { setBrickCoordinates } from 'src/app/store/bricks/bricks.actions';
import { IBall } from 'src/app/types/IBall';

@Component({
  selector: 'app-brick',
  templateUrl: './brick.component.html',
  styleUrls: ['./brick.component.scss'],
})
export class BrickComponent implements OnInit, OnChanges {
  @Input() isGameStarted: boolean;
  @Input() brick = null;
  @Input() ballMoveFlag: boolean;

  constructor(
    private store: Store,
    private renderer: Renderer2,
    private el: ElementRef,
    private brickService: BricksService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.brick.status) {
      //console.log('Id: ', this.brick.id);
      //console.log(
      //   'Coordinated: ',
      //   this.el.nativeElement.getBoundingClientRect()
      // );
      this.store.dispatch(
        setBrickCoordinates({
          id: this.brick.id,
          brick: this.el.nativeElement.getBoundingClientRect(),
          status: this.brick.status,
          hitCount: this.brick.hitCount,
          bonusName: this.brick.bonusName,
        })
      );
    }
    //this.cd.detectChanges();
  }

  ngOnChanges(): void {
    if (this.isGameStarted) {
      ////console.log('Changes');
    }

    //this.cd.detectChanges();
  }

  ngDoCheck(): void {
    if (this.brick.bonusName) {
      if (this.brick.hitCount <= 0) {
        this.cd.detectChanges();
      }
    }
  }
}
