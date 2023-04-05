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

enum BallSpeed {
  generalSpeed = 5,
  speedBoosted = 10,
}

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements OnChanges, OnInit {
  @Input() id!: number;
  @Input() isGameStarted: boolean = false;
  @Output() destroyBall = new EventEmitter();

  dx: number = BallSpeed.generalSpeed;
  dy: number = -BallSpeed.generalSpeed;
  ballX: number = 0;
  ballY: number = 0;
  paddle: IPaddle = null;
  bricks: IBrick[] = [];
  BallMode = BallMode;
  speedMode: boolean = false;
  powerMode: boolean = false;

  ballPressed: boolean = false;

  constructor(
    private ballService: BallService,
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store,
    private bricksService: BricksService
  ) {}

  ngOnInit(): void {}

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.store.select(selectBricks).subscribe((bricks) => {
        this.bricks = bricks;
      });

      const { x, y } = this.el.nativeElement
        .querySelector('.ball')
        .getBoundingClientRect();
      this.ballX = x;

      console.log('BallX:', this.ballX);

      const previousBall =
        this.el.nativeElement.previousElementSibling.querySelector('.ball');

      if (previousBall) {
        const { x, y } = previousBall.getBoundingClientRect();
        this.ballX = -x;
        this.ballY = -y;
      }

      this.moveBall();
    }
  }

  ngOnChanges(): void {
    // else {
    //   this.dx = BallSpeed.generalSpeed;
    //   this.dy = -BallSpeed.generalSpeed;
    //   this.ballService.stopBall();
    // }
  }

  moveBall(): void {
    this.ballX += this.dx;
    this.ballY += this.dy;
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.ball'),
      'transform',
      `translate(${this.ballX}px, ${this.ballY}px)`
    );

    // Get the position and dimensions of the ball and paddle
    const ball = this.el.nativeElement
      .querySelector('.ball')
      .getBoundingClientRect();

    const board = Board.Instance;
    let ballRadius = ball.width / 2;

    if (ball.bottom >= board.height) {
      this.removeBall();
    } else {
      if (ball.right + ballRadius >= board.width || ball.left <= 0) {
        this.dx = -this.dx;
      }
      if (ball.top <= 0) {
        this.dy = -this.dy;
      }

      this.ballPaddleCollusion(ball);
      this.ballBricksCollusion(ball);
      requestAnimationFrame(() => this.moveBall());
    }
  }

  //todo: change
  ballPaddleCollusion(ball: DOMRect): void {
    this.store.select(selectPaddle).subscribe((paddle) => {
      this.paddle = paddle;
    });

    if (this.paddle.mode === BallMode.Speed) {
      this.dx = this.dx * 5; //? BallSpeed.speedBoosted : -BallSpeed.speedBoosted;
      this.dy = this.dy * 5; //? BallSpeed.speedBoosted : -BallSpeed.speedBoosted;
      this.speedMode = true;
      setTimeout(() => {
        this.dx = this.dx * 1.5;
        //this.dx > 0 ? BallSpeed.generalSpeed : -BallSpeed.generalSpeed;
        this.dy = this.dy * 1.5;
        //this.dy > 0 ? BallSpeed.generalSpeed : -BallSpeed.generalSpeed;

        this.speedMode = false;
        this.store.dispatch(setModeBall({ mode: BallMode.Default }));
      }, 100);
    } else if (this.paddle.mode === BallMode.Power) {
      this.powerMode = true;
      setTimeout(() => {
        this.powerMode = false;
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
          this.dy = -BallSpeed.generalSpeed;
        } else if (hitPercentage > 0.55) {
          this.dx =
            this.paddle.direction > 0
              ? BallSpeed.speedBoosted
              : -BallSpeed.generalSpeed;
          this.dy =
            -BallSpeed.generalSpeed +
            (BallSpeed.speedBoosted / BallSpeed.generalSpeed) *
              this.paddle.direction;
        } else {
          this.dx =
            this.paddle.direction > 0
              ? BallSpeed.generalSpeed
              : -BallSpeed.speedBoosted;
          this.dy =
            -BallSpeed.generalSpeed -
            (BallSpeed.speedBoosted / BallSpeed.generalSpeed) *
              this.paddle.direction;
        }
      } else {
        if (hitPercentage >= 0.45 && hitPercentage <= 0.55) {
          this.dy = -BallSpeed.generalSpeed;
          this.dx = BallSpeed.generalSpeed * this.paddle.direction;
        } else if (hitPercentage > 0.55) {
          this.dx =
            this.paddle.direction > 0
              ? BallSpeed.speedBoosted
              : -BallSpeed.generalSpeed;
          this.dy =
            -BallSpeed.generalSpeed +
            (BallSpeed.speedBoosted / BallSpeed.generalSpeed) *
              this.paddle.direction;
        } else {
          this.dx =
            this.paddle.direction > 0
              ? BallSpeed.generalSpeed
              : -BallSpeed.speedBoosted;
          this.dy =
            -BallSpeed.generalSpeed -
            (BallSpeed.speedBoosted / BallSpeed.generalSpeed) *
              this.paddle.direction;
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
        ball.bottom >= brick.top &&
        ball.top <= brick.bottom &&
        ball.left - ball.width >= brick.left &&
        ball.right + ball.width <= brick.right &&
        status
      ) {
        this.bricksService.destroyBrick(id, this.paddle.mode);
        if (this.paddle.mode === BallMode.Power) {
          return;
        }
        this.dy = -this.dy;
      } else if (
        ball.bottom >= brick.top &&
        ball.top <= brick.bottom &&
        ball.left + ball.width <= brick.right &&
        ball.right - ball.width >= brick.left &&
        status
      ) {
        this.bricksService.destroyBrick(id, this.paddle.mode);
        if (this.paddle.mode === BallMode.Power) {
          return;
        }
        this.dx = -this.dx;
      }

      // if (
      //   ball.right >= brick.left &&
      //   ball.left <= brick.right &&
      //   ball.bottom >= brick.top &&
      //   ball.top <= brick.bottom &&
      //   status
      // ) {
      //   console.log('Top Bottom');
      //   console.log(`BallTop: ${ball.top}, BallBottom: ${ball.bottom}`);
      //   console.log(`BrickTop: ${brick.top}, BrickBottom: ${brick.bottom}`);
      //   console.log(`BallLeft: ${ball.left}, BallRight: ${ball.right}`);
      //   console.log(`BrickLeft: ${brick.left}, BrickRight: ${brick.right}`);
      // }

      // if (
      //   ball.right >= brick.left &&
      //   ball.left <= brick.right &&
      //   ball.bottom >= brick.top &&
      //   ball.top <= brick.bottom &&
      //   status
      // ) {
      //   this.bricksService.destroyBrick(id, this.paddle.mode);

      //   if (this.paddle.mode === BallMode.Power) {
      //     return;
      //   }

      //   const ballCenterX = ball.left + ball.width / 2;
      //   const ballCenterY = ball.top + ball.height / 2;
      //   const brickCenterX = brick.left + brick.width / 2;
      //   const brickCenterY = brick.top + brick.height / 2;

      //   const dx = ballCenterX - brickCenterX;
      //   const dy = ballCenterY - brickCenterY;
      //   const width = (ball.width + brick.width) / 2;
      //   const height = (ball.height + brick.height) / 2;
      //   const crossWidth = width * dy;
      //   const crossHeight = height * dx;
      //   let collisionSide = null;

      //   if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
      //     if (crossWidth > crossHeight) {
      //       collisionSide = crossWidth > -crossHeight ? 'bottom' : 'left';
      //     } else {
      //       collisionSide = crossWidth > -crossHeight ? 'right' : 'top';
      //     }
      //   }

      //   switch (collisionSide) {
      //     case 'bottom':
      //       this.dy = -this.dy;
      //       break;
      //     case 'top':
      //       this.dy = -this.dy;
      //       break;
      //     case 'left':
      //       this.dx = -this.dx;
      //       break;
      //     case 'right':
      //       this.dx = -this.dx;
      //       break;
      //   }
      // }
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
