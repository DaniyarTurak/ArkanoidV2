import {
  AfterViewInit,
  ChangeDetectionStrategy,
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

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaddleComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() startFlag!: boolean;
  @Input() pauseFlag!: boolean;
  @Input() ballMoveFlag!: boolean;

  @ViewChild('paddle', { static: false }) private paddle: ElementRef;
  // @ViewChild("ball", {static: false}) private ball: ElementRef;

  direction: number = 0;
  board: any;
  paddleMoveX: number = 0;
  movementX: number = 1;

  _WIDTH: number;

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

  ngOnInit(): void {}

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
      if (this.paddleMoveX - this.paddleSize.width / 2 >= 0) {
        this.paddleMoveX += -30;
        this.movementX = -1;
      }
      this.movePaddle();
    } else if (e.code === 'ArrowRight') {
      if (this.paddleMoveX <= this._WIDTH - this.paddleSize.width / 2) {
        this.paddleMoveX += 30;
        this.movementX = 1;
      }
      this.movePaddle();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(e: MouseEvent): void {
    //console.log(e.clientX);
    this.paddleMoveX = e.clientX;

    this.movementX = e.movementX;
    this.movePaddle();
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
    this._WIDTH = this.board.width - 30;
  }
}
