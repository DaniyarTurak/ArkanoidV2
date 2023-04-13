import { ChangeDetectionStrategy } from '@angular/core';
import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  HostListener,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Board } from 'src/app/constants/Board';
import { setPaddleCoordinates } from 'src/app/store/paddle/paddle.actions';

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaddleComponent implements OnInit, OnChanges {
  @Input() startFlag!: boolean;
  @Input() pauseFlag!: boolean;
  @Input() ballMoveFlag!: boolean;

  direction: number = 0;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    const paddle = this.el.nativeElement.querySelector('.paddle');

    if (!this.startFlag) {
      this.renderer.setStyle(paddle, 'transform', `translateX(-50%)`);
      this.renderer.addClass(paddle, 'center');
    } else {
      this.renderer.removeClass(paddle, 'center');
      //   this.renderer.removeClass(ball, 'center');
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent): void {
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
      this.direction += e.code === 'ArrowRight' ? 30 : -30;
      this.movePaddleByKeyboard();
    }
  }

  movePaddleByKeyboard(): void {
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.paddle'),
      'margin-left',
      `${this.direction}px`
    );
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(e: MouseEvent): void {
    if (this.startFlag && !this.pauseFlag) {
      const board = Board.Instance;

      const paddle = this.el.nativeElement
        .querySelector('.paddle')
        .getBoundingClientRect();

      if (
        e.clientX - paddle.width / 2 >= 0 &&
        e.clientX <= board.width - paddle.width / 2
      ) {
        if (e.movementX >= 0) this.direction = 1; // right
        else this.direction = -1; // left

        this.store.dispatch(
          setPaddleCoordinates({
            paddle,
            direction: this.direction,
          })
        );

        this.renderer.setStyle(
          this.el.nativeElement.querySelector('.paddle'),
          'transform',
          `translateX(${e.clientX - paddle.width / 2}px)`
        );

        if (!this.ballMoveFlag) {
          this.renderer.setStyle(
            this.el.nativeElement.parentElement.querySelector('.ball'),
            'transform',
            `translateX(${
              e.clientX -
              this.el.nativeElement.parentElement.querySelector('.ball')
                .offsetWidth /
                2
            }px)`
          );
        }
      }
    }
  }
}
