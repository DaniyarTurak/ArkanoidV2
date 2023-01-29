import { Component, HostListener } from '@angular/core';
import { BallController } from './controllers/ballController';
import { BricksController } from './controllers/bricksController';
import { PaddleController } from './controllers/paddleController';
import { BricksService } from './services/bricks.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  ballController = new BallController();
  bricksController = null;
  paddleController = new PaddleController();

  constructor(private bricksService: BricksService) {
    this.bricksController = new BricksController(bricksService);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      const ball = document.querySelector('.ball') as HTMLElement;
      const ballController = this.ballController;
      const bricks = document.querySelectorAll('.brick');
      const bricksController = this.bricksController;
      const paddle = document.querySelector('.paddle') as HTMLElement;
      const paddleController = this.paddleController;

      requestAnimationFrame(function measure(time) {
        const { x, y } = ball.getBoundingClientRect();
        ballController.progressX += ballController.dx;
        ballController.progressY += ballController.dy;

        const paddleX = paddle.getBoundingClientRect().x;
        const paddleY = paddle.getBoundingClientRect().y;

        ball.style.transform = `translate(${ballController.progressX}px, ${ballController.progressY}px)`;

        if (x > paddleX && x < paddleX + 200 && y > paddleY - 50) {
          ballController.dy = -2;
        }

        if (y < 10) {
          ballController.dy = 2;
        } else if (y > 430 || bricksController.isGameFinished) {
          console.log('Game Over');
          paddleController.progress = 0;
          ballController.progressX = 0;
          ballController.progressY = 0;
          return;
        }

        if (x > 1460) {
          ballController.dx = -2;
        } else if (x < 10) {
          ballController.dx = 2;
        }

        bricks.forEach((brick: HTMLElement, idx) => {
          const brickX = brick.getBoundingClientRect().x;
          const brickY = brick.getBoundingClientRect().y;

          if (
            x >= brickX - 10 &&
            x <= brickX + 80 &&
            y < brickY + 30 &&
            brick.style.opacity !== '0'
          ) {
            ballController.dy = 2;
            brick.style.opacity = '0';
            bricksController.removeBrick(idx + 1);
          }
        });

        if (ballController.progressX < 1050) {
          requestAnimationFrame(measure);
        }
      });
    }
  }
}
