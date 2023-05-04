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
  @Input() startFlag: boolean;
  @Input() pauseFlag: boolean;
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
    }
  }

  ngOnInit(): void {
    this.store.select(selectPaddle).subscribe((res) => {
      this.paddle = res;
    });
    this.store.select(selectBricks).subscribe((bricks) => {
      this.bricks = bricks;
    });
  }

  ngOnChanges(): void {
    const ball = this.el.nativeElement.querySelector('.ball');

    if (!this.startFlag) {
      this.renderer.setStyle(ball, 'transform', `translateX(-50%)`);
      this.renderer.addClass(ball, 'center');
    } else {
      this.renderer.removeClass(ball, 'center');
    }

    if (!this.pauseFlag && this.ballMoveFlag) {
      this.moveBall();
    }
  }

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
    const { paddle, mode, direction } = this.paddle;

    if (mode === BallMode.Speed) {
      this.dx = this.dx * 1.05; //? BallSpeed.speedBoosted : -BallSpeed.speedBoosted;
      this.dy = this.dy * 1.05; //? BallSpeed.speedBoosted : -BallSpeed.speedBoosted;
      this.speedMode = true;
      setTimeout(() => {
        this.store.dispatch(setModeBall({ mode: BallMode.Default }));
      }, 250);
    }

    if (mode === BallMode.Power) {
      this.powerMode = true;
      setTimeout(() => {
        this.powerMode = false;
        this.store.dispatch(setModeBall({ mode: BallMode.Default }));
      }, 3000);
    }

    if (
      ball.left >= paddle.left &&
      ball.right <= paddle.right &&
      ball.bottom >= paddle.top
    ) {
      let ballHitPosition = ball.left + ball.width / 2 - paddle.left;
      let hitPercentage = ballHitPosition / paddle.width;
      if (this.speedMode) this.speedMode = false;

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
      const ballRadius = ball.width / 2;
      const { mode } = this.paddle;

      //ball not connected to bricks
      if (
        ball.x + ballRadius < brick.x ||
        ball.x - ballRadius > brick.x + brick.width ||
        ball.y + ballRadius < brick.y ||
        ball.y - ballRadius > brick.y + brick.height
      ) {
        return;
      }

      if (status) {
        this.bricksService.destroyBrick(id, mode);
        if (mode === BallMode.Power) {
          return;
        }
        const topCollision = Math.abs(ball.y + ballRadius - brick.y);
        const bottomCollision = Math.abs(
          ball.y - ballRadius - (brick.y + brick.height)
        );
        const leftCollision = Math.abs(ball.x + ballRadius - brick.x);
        const rightCollision = Math.abs(
          ball.x - ballRadius - (brick.x + brick.width)
        );

        if (
          topCollision <= bottomCollision &&
          topCollision <= leftCollision &&
          topCollision <= rightCollision
        ) {
          // Handle top collision
          this.dy = -this.dy;
        } else if (
          bottomCollision <= topCollision &&
          bottomCollision <= leftCollision &&
          bottomCollision <= rightCollision
        ) {
          // Handle bottom collision
          this.dy = -this.dy;
        } else if (
          leftCollision <= topCollision &&
          leftCollision <= bottomCollision &&
          leftCollision <= rightCollision
        ) {
          // Handle left collision
          this.dx = -this.dx;
        } else {
          // Handle right collision
          this.dx = -this.dx;
        }
      }
    });
  }

  removeBall(): void {
    //this.ballService.stopBall();
    this.destroyBall.emit(this.id);
  }
}
