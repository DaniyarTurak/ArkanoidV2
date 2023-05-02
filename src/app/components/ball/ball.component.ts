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
import { selectGameFlags } from 'src/app/store/game/game.selectors';

enum BallSpeed {
  generalSpeed = 3,
  speedBoosted = 5,
}

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements OnChanges, OnInit {
  @Input() id!: number;
  //@Input() startFlag: boolean;
  //@Input() pauseFlag: boolean;
  startFlag: boolean;
  pauseFlag: boolean;

  @Output() destroyBall = new EventEmitter();

  dx: number = BallSpeed.generalSpeed;
  dy: number = -BallSpeed.generalSpeed;
  ballX: number = 0;
  ballY: number = 0;
  paddle: IPaddle = null;
  bricks: IBrick[] = [];
  speedMode: boolean = false;
  powerMode: boolean = false;
  ballMoveFlag: boolean = false;

  constructor(
    private ballService: BallService,
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store,
    private bricksService: BricksService
  ) {}

  @HostListener('document:keydown', ['$event'])
  handleBallEnter(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      if (this.startFlag) {
        this.ballMoveFlag = true;
      }
    }
  }

  ngOnInit(): void {
    this.store.select(selectPaddle).subscribe((res) => {
      this.paddle = res;
    });
    this.store.select(selectBricks).subscribe((bricks) => {
      this.bricks = bricks;
      //console.log('Bricks: ', this.bricks);
    });
    this.store.select(selectGameFlags).subscribe((gameFlags) => {
      const ball = this.el.nativeElement.querySelector('.ball');

      this.startFlag = gameFlags.startFlag;
      this.pauseFlag = gameFlags.pauseFlag;
      this.ballMoveFlag = gameFlags.ballMoveFlag;

      if (this.startFlag && this.ballMoveFlag) {
        const { x: ballX, y: ballY } = this.el.nativeElement
          .querySelector('.ball')
          .getBoundingClientRect();

        const previousBall =
          this.el.nativeElement.previousElementSibling.querySelector('.ball');

        if (previousBall) {
          const { x: previousBallX, y: previousBallY } =
            previousBall.getBoundingClientRect();
          this.ballX = -previousBallX;
          this.ballY = -previousBallY;
        } else {
          this.ballX = ballX;
        }

        this.moveBall();
      }

      if (!this.startFlag) {
        this.renderer.setStyle(ball, 'transform', `translateX(-50%)`);
        this.renderer.addClass(ball, 'center');
      } else {
        this.renderer.removeClass(ball, 'center');
      }

      if (!this.pauseFlag && this.ballMoveFlag) {
        this.moveBall();
      }
    });
  }

  ngOnChanges(): void {}

  moveBall(): void {
    if (!this.startFlag || this.pauseFlag) {
      return;
    }
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
      if (ball.top < 0) {
        this.dy = -this.dy;
      }

      this.ballPaddleCollusion(ball);
      this.ballBricksCollusion(ball);
      requestAnimationFrame(() => this.moveBall());
    }
  }

  //todo: change
  ballPaddleCollusion(ball: DOMRect): void {
    const { paddle, mode, direction } = this.paddle;

    if (mode === BallMode.Speed) {
      this.dx = this.dx * 1.05; //? BallSpeed.speedBoosted : -BallSpeed.speedBoosted;
      this.dy = this.dy * 1.05; //? BallSpeed.speedBoosted : -BallSpeed.speedBoosted;
      this.speedMode = true;
      setTimeout(() => {
        this.speedMode = false;
        this.store.dispatch(setModeBall({ mode: BallMode.Default }));
      }, 200);
    }

    if (mode === BallMode.Power) {
      this.powerMode = true;
      setTimeout(() => {
        this.powerMode = false;
        this.store.dispatch(setModeBall({ mode: BallMode.Default }));
      }, 1000);
    }

    if (
      ball.left >= paddle.left &&
      ball.right <= paddle.right &&
      ball.bottom >= paddle.top
    ) {
      // let ballHitPosition = ball.left + ball.width / 2 - paddle.left;
      // let ballHitPositionPercent = ballHitPosition / paddle.width;

      // let paddleDirection = direction;
      // let generalSpeed = BallSpeed.generalSpeed;
      // let speedBoosted = BallSpeed.speedBoosted;

      // let dx, dy;

      // if (paddleDirection * this.dx > 0) {
      //   if (ballHitPositionPercent >= 0.35 && ballHitPositionPercent <= 0.65) {
      //     dy = -generalSpeed;
      //   } else if (ballHitPositionPercent > 0.65) {
      //     dx = paddleDirection > 0 ? speedBoosted : -generalSpeed;
      //     dy = -generalSpeed + (speedBoosted / generalSpeed) * paddleDirection;
      //   } else {
      //     dx = paddleDirection > 0 ? generalSpeed : -speedBoosted;
      //     dy = -generalSpeed - (speedBoosted / generalSpeed) * paddleDirection;
      //   }
      // } else {
      //   if (ballHitPositionPercent >= 0.35 && ballHitPositionPercent <= 0.65) {
      //     dy = -generalSpeed;
      //     dx = generalSpeed * paddleDirection;
      //   } else if (ballHitPositionPercent > 0.65) {
      //     dx = paddleDirection > 0 ? speedBoosted : -generalSpeed;
      //     dy = -generalSpeed + (speedBoosted / generalSpeed) * paddleDirection;
      //   } else {
      //     dx = paddleDirection > 0 ? generalSpeed : -speedBoosted;
      //     dy = -generalSpeed - (speedBoosted / generalSpeed) * paddleDirection;
      //   }
      // }

      // this.dx = dx;
      // this.dy = dy;

      let ballHitPosition = ball.left + ball.width / 2 - paddle.left;
      let hitPercentage = ballHitPosition / paddle.width;

      let sameDirection =
        (direction > 0 && this.dx > 0) || (direction < 0 && this.dx < 0);

      if (sameDirection) {
        if (hitPercentage >= 0.45 && hitPercentage <= 0.55) {
          this.dy = -BallSpeed.generalSpeed;
        } else if (hitPercentage > 0.55) {
          this.dx =
            direction > 0 ? BallSpeed.speedBoosted : -BallSpeed.generalSpeed;
          this.dy =
            -BallSpeed.generalSpeed +
            (BallSpeed.speedBoosted / BallSpeed.generalSpeed) * direction;
        } else {
          this.dx =
            direction > 0 ? BallSpeed.generalSpeed : -BallSpeed.speedBoosted;
          this.dy =
            -BallSpeed.generalSpeed -
            (BallSpeed.speedBoosted / BallSpeed.generalSpeed) * direction;
        }
      } else {
        if (hitPercentage >= 0.45 && hitPercentage <= 0.55) {
          this.dy = -BallSpeed.generalSpeed;
          this.dx = BallSpeed.generalSpeed * direction;
        } else if (hitPercentage > 0.55) {
          this.dx =
            direction > 0 ? -BallSpeed.speedBoosted : -BallSpeed.generalSpeed;
          this.dy =
            -BallSpeed.generalSpeed +
            (BallSpeed.speedBoosted / BallSpeed.generalSpeed) * direction;
        } else {
          this.dx =
            direction > 0 ? BallSpeed.generalSpeed : -BallSpeed.speedBoosted;
          this.dy = -BallSpeed.generalSpeed;
          // this.dy =
          //   -BallSpeed.generalSpeed -
          //   (BallSpeed.speedBoosted / BallSpeed.generalSpeed) * direction;
        }
      }
    } else if (
      ball.bottom >= paddle.top &&
      ball.left - ball.width / 2 < paddle.right &&
      ball.right + ball.width / 2 > paddle.left
    ) {
      this.dy = -this.dy;
      this.dx = -this.dx;
    }
  }

  ballBricksCollusion(ball: DOMRect): void {
    this.bricks.forEach(({ id, brick, status }) => {
      const { mode } = this.paddle;
      if (
        ball.bottom >= brick.top &&
        ball.top <= brick.bottom &&
        ball.left >= brick.left &&
        ball.right <= brick.right &&
        status
      ) {
        //  //console.log('TopBottom: ', ball, brick);
        this.bricksService.destroyBrick(id, mode);
        if (mode === BallMode.Power) {
          return;
        }
        this.dy = -this.dy;
        this.ballY += 1.5 * this.dy;
        return;
      } else if (
        ball.bottom - ball.width / 2 >= brick.top &&
        ball.top + ball.width / 2 <= brick.bottom &&
        ball.left + ball.width / 2 <= brick.right &&
        ball.right - ball.width / 2 >= brick.left &&
        status
      ) {
        //  //console.log('LEftRight: ', ball, brick);
        this.bricksService.destroyBrick(id, mode);
        if (mode === BallMode.Power) {
          return;
        }
        this.dx = -this.dx;
        this.ballX += this.dx;
        return;
      }
    });
  }

  removeBall(): void {
    //this.ballService.stopBall();
    this.destroyBall.emit(this.id);
  }
}
