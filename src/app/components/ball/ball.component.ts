import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  Output,
  EventEmitter,
} from '@angular/core';
import { BallService } from 'src/app/services/ball.service';
import { Store } from '@ngrx/store';
import { selectPaddle } from 'src/app/store/paddle/paddle.selectors';
import { BallMode, IPaddle } from 'src/app/types/IPaddle';
import { setBallCoordinates } from 'src/app/store/ball/ball.actions';
import { BricksService } from 'src/app/services/bricks.service';
import { IBrick } from 'src/app/types/IBrick';
import { selectBricks } from 'src/app/store/bricks/bricks.selectors';
import { Board } from 'src/app/constants/Board';
import { setModeBall } from 'src/app/store/paddle/paddle.actions';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements OnChanges, OnInit {
  @Input() id!: number;
  @Input() isGameStarted: boolean = false;
  @Output() destroyBall = new EventEmitter();

  dx: number = 5;
  dy: number = -5;
  ballX: number = 0;
  ballY: number = 0;
  paddle: IPaddle = null;
  bricks: IBrick[] = [];

  constructor(
    private ballService: BallService,
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store,
    private bricksService: BricksService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.isGameStarted) {
      const { x } = this.el.nativeElement
        .querySelector('.ball')
        .getBoundingClientRect();
      this.ballX = x;
      this.store.select(selectBricks).subscribe((bricks) => {
        this.bricks = bricks;
      });

      this.ballService.moveBall(() => this.moveBall());
    } else {
      this.ballY = 10;
      this.dx = 5;
      this.dy = -5;
      this.ballService.stopBall();
    }
  }

  moveBall(): void {
    this.ballX += this.dx;
    this.ballY += this.dy;
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.ball'),
      'transform',
      `translate(${this.ballX}px, ${this.ballY}px)`
    );

    let ballRadius = 10;

    // Get the position and dimensions of the ball and paddle
    const ball = this.el.nativeElement
      .querySelector('.ball')
      .getBoundingClientRect();
    const board = Board.Instance;

    if (ball.bottom >= board.height) {
      this.removeBall();
    } else {
      if (ball.x + ballRadius > board.width || ball.x - ballRadius < 0) {
        // Check for collisions with walls
        this.dx = -this.dx; // Reverse x-velocity
      }
      if (ball.y - ballRadius < 0) {
        this.dy = -this.dy; // Reverse y-velocity
      }

      this.ballPaddleCollusion(ball);
      this.ballBricksCollusion(ball);
    }
  }

  //todo: change
  ballPaddleCollusion(ball: DOMRect): void {
    this.store.select(selectPaddle).subscribe((paddle) => {
      this.paddle = paddle;
    });

    if (this.paddle.mode === BallMode.Speed) {
      this.dx = this.dx * 1.5;
      this.dy = this.dy * 1.5;
      setTimeout(() => {
        this.dx = this.dx / 1.5;
        this.dy = this.dy / 1.5;
        this.store.dispatch(setModeBall({ mode: BallMode.Default }));
      }, 100);
    } else if (this.paddle.mode === BallMode.Power) {
      setTimeout(() => {
        this.store.dispatch(setModeBall({ mode: BallMode.Default }));
      }, 2000);
    }

    if (
      ball.left >= this.paddle.left &&
      ball.right <= this.paddle.right &&
      ball.bottom >= this.paddle.top
    ) {
      let ballHitPosition = ball.left + ball.width / 2 - this.paddle.left;
      let hitPercentage = ballHitPosition / this.paddle.width;

      let sameDirection =
        (this.paddle.direction > 0 && this.dx > 0) ||
        (this.paddle.direction < 0 && this.dx < 0);

      if (sameDirection) {
        if (hitPercentage >= 0.45 && hitPercentage <= 0.55) {
          this.dy = -this.dy;
        } else if (hitPercentage > 0.55) {
          this.dx = this.dx / hitPercentage;
          this.dy = -this.dy * hitPercentage;
        } else {
          this.dx = this.dx / (1 - hitPercentage);
          this.dy = -this.dy * (1 - hitPercentage);
        }
      } else {
        if (hitPercentage >= 0.45 && hitPercentage <= 0.55) {
          this.dx = -this.dx;
          this.dy = -this.dy;
        } else if (hitPercentage > 0.55) {
          this.dx = -this.dx * hitPercentage;
          this.dy = -this.dy / hitPercentage;
        } else {
          this.dx = -this.dx * (1 - hitPercentage);
          this.dy = -this.dy / (1 - hitPercentage);
        }
      }
    } else if (
      ball.bottom >= this.paddle.top &&
      ball.left < this.paddle.right &&
      ball.right > this.paddle.left
    ) {
      this.dy = -this.dy;
      this.dx = -this.dx;
    }
  }

  ballBricksCollusion(ball: DOMRect): void {
    this.bricks.forEach(({ id, brick, status }) => {
      if (
        ball.right >= brick.left &&
        ball.left <= brick.right &&
        ball.bottom >= brick.top &&
        ball.top <= brick.bottom &&
        status
      ) {
        this.bricksService.destroyBrick(id, this.paddle.mode);

        if (this.paddle.mode === BallMode.Power) {
          return;
        }

        // determine the side of the collision
        const ballCenterX = ball.left + ball.width / 2;
        const ballCenterY = ball.top + ball.height / 2;
        const blockCenterX = brick.left + brick.width / 2;
        const blockCenterY = brick.top + brick.height / 2;

        const dx = ballCenterX - blockCenterX;
        const dy = ballCenterY - blockCenterY;
        const width = (ball.width + brick.width) / 2;
        const height = (ball.height + brick.height) / 2;
        const crossWidth = width * dy;
        const crossHeight = height * dx;
        let collisionSide = null;

        if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
          if (crossWidth > crossHeight) {
            collisionSide = crossWidth > -crossHeight ? 'bottom' : 'left';
          } else {
            collisionSide = crossWidth > -crossHeight ? 'right' : 'top';
          }
        }

        // react to the collision
        switch (collisionSide) {
          case 'bottom':
            // ball hits the bottom of the block
            this.dy = -this.dy;
            break;
          case 'top':
            // ball hits the top of the block
            this.dy = -this.dy;
            break;
          case 'left':
            // ball hits the left side of the block
            this.dx = -this.dx;
            break;
          case 'right':
            // ball hits the right side of the block
            this.dx = -this.dx;
            break;
        }
      }
    });
  }

  removeBall(): void {
    this.ballX = 100;
    this.ballY = 10;
    this.dx = 5;
    this.dy = -5;
    this.ballService.stopBall();
    this.destroyBall.emit(this.id);
  }
}
