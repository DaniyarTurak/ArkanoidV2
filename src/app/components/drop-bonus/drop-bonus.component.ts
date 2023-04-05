import {
  Component,
  Input,
  OnInit,
  OnChanges,
  Output,
  ElementRef,
  EventEmitter,
  Renderer2,
} from '@angular/core';
import { Board } from 'src/app/constants/Board';
import { IBrick } from 'src/app/types/IBrick';
import { Store } from '@ngrx/store';
import { selectPaddle } from 'src/app/store/paddle/paddle.selectors';
import { Subscription } from 'rxjs';
import { BallMode, IPaddle } from 'src/app/types/IPaddle';
import { setModeBall } from 'src/app/store/paddle/paddle.actions';

@Component({
  selector: 'app-drop-bonus',
  templateUrl: './drop-bonus.component.html',
  styleUrls: ['./drop-bonus.component.scss'],
})
export class DropBonusComponent implements OnInit {
  @Input() brick!: IBrick;
  @Output() bonusConnected = new EventEmitter();
  progressY: number = 1;
  board = null;
  paddle: IPaddle = null;
  _subscription: Subscription;

  constructor(
    private store: Store,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    if (!this.brick.status) {
      this._subscription = this.store
        .select(selectPaddle)
        .subscribe((paddle) => (this.paddle = paddle));
      this.dropBonus();
    }
  }

  dropBonus(): void {
    this.board = Board.Instance;
    const drop = this.el.nativeElement.querySelector('.drop-bonus'),
      { y, bottom, left, right } = drop.getBoundingClientRect();
    this.progressY += 3;
    this.renderer.setStyle(drop, 'margin-top', `${this.progressY}px`);

    const { paddle, mode, direction } = this.paddle;
    if (bottom >= paddle.top && left >= paddle.left && right <= paddle.right) {
      this._subscription.unsubscribe();

      this.store.dispatch(setModeBall({ mode: this.brick.bonusName }));
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    } else if (bottom >= this.board.height) {
      this._subscription.unsubscribe();
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    } else {
      requestAnimationFrame(() => this.dropBonus());
    }
  }
}
