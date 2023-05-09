import {
  AfterViewInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Board } from 'src/app/constants/Board';
import { setPaddleCoordinates } from 'src/app/store/paddle/paddle.actions';
import { interval, Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaddleComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() startFlag!: boolean;
  @Input() pauseFlag!: boolean;
  @Input() ballMoveFlag!: boolean;

  @ViewChild('paddle', { static: false }) private paddle: ElementRef;
  // @ViewChild("ball", {static: false}) private ball: ElementRef;

  direction: number = 0;
  board: any;
  paddleMoveX: number = 0;
  movementX: number = 1;

  ArrowLeftPressed: boolean;
  ArrowRightPressed: boolean;

  interval;
  _WIDTH: number;

  destroyed$ = new ReplaySubject(1);

  get ball() {
    return this.el?.nativeElement?.parentElement.querySelector('.ball');
  }

  get paddleSize() {
    return this.paddle?.nativeElement?.getBoundingClientRect();
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.interval = interval(1000 / 60)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((time) => {
        this.redraw();
      });
  }

  ngOnChanges(): void {
    if (!this.paddle) {
      return;
    }
    if (!this.startFlag) {
      this.renderer.setStyle(
        this.paddle.nativeElement,
        'transform',
        `translateX(-50%)`
      );
      this.renderer.addClass(this.paddle.nativeElement, 'center');
    } else {
      this.renderer.removeClass(this.paddle.nativeElement, 'center');
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent): void {
    if (e.code === 'ArrowLeft') {
      this.ArrowLeftPressed = true;
      this.ArrowRightPressed = false;
    } else if (e.code === 'ArrowRight') {
      this.ArrowLeftPressed = false;
      this.ArrowRightPressed = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUp(e: KeyboardEvent): void {
    this.ArrowLeftPressed = false;
    this.ArrowRightPressed = false;
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(e: MouseEvent): void {
    //console.log(e.clientX);
    this.paddleMoveX = e.clientX;

    this.movementX = e.movementX;
    this.movePaddle();
  }

  redraw() {
    if (this.ArrowLeftPressed) {
      if (this.paddleMoveX - this.paddleSize.width / 2 >= 0) {
        this.paddleMoveX += -10;
        this.movementX = -1;
      }
      this.movePaddle();
    }

    if (this.ArrowRightPressed) {
      if (this.paddleMoveX <= this._WIDTH - this.paddleSize.width / 2) {
        this.paddleMoveX += 10;
        this.movementX = 1;
      }
      this.movePaddle();
    }
  }

  movePaddle(): void {
    if (!this.startFlag || this.pauseFlag) {
      return;
    }

    if (
      this.paddleMoveX - this.paddleSize.width / 2 >= 0 &&
      this.paddleMoveX <= this._WIDTH - this.paddleSize.width / 2
    ) {
      this.direction = this.movementX >= 0 ? 1 : -1; // right or left

      this.store.dispatch(
        setPaddleCoordinates({
          paddle: this.paddleSize,
          direction: this.direction,
        })
      );

      this.renderer.setStyle(
        this.paddle.nativeElement,
        'transform',
        `translateX(${this.paddleMoveX - this.paddleSize.width / 2}px)`
      );

      if (!this.ballMoveFlag) {
        this.renderer.setStyle(
          this.ball,
          'transform',
          `translateX(${this.paddleMoveX - this.ball.offsetWidth / 2}px)`
        );
      }
    }
  }

  ngAfterViewInit(): void {
    this.board = Board.Instance;
    this._WIDTH = this.board.width - 40;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
