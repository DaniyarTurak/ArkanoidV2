import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  Input,
  Output,
  EventEmitter,
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
export class BrickComponent implements OnInit {
  @Input() brick = null;

  constructor(
    private store: Store,
    private renderer: Renderer2,
    private el: ElementRef,
    private brickService: BricksService
  ) {}

  ngOnInit(): void {
    if (this.brick.status) {
      this.store.dispatch(
        setBrickCoordinates({
          id: this.brick.id,
          brick: this.el.nativeElement.getBoundingClientRect(),
          status: this.brick.status,
        })
      );
    }

    // this.brickService.setBricks(
    //   this.brick.id,
    //   this.el.nativeElement.getBoundingClientRect()
    // );
  }
}
