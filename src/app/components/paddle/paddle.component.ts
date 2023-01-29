import { Component, OnInit, HostListener, Input } from '@angular/core';
import { PaddleController } from 'src/app/controllers/paddleController';

@Component({
  selector: 'mc-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
})
export class PaddleComponent implements OnInit {
  ngOnInit(): void {}

  paddleController: PaddleController = new PaddleController();

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    if (e.code == 'ArrowLeft' || e.code == 'ArrowRight') {
      let dx = e.code == 'ArrowLeft' ? -1 : 1;
      const paddle = document.querySelector<HTMLElement>('.paddle');

      const paddleController = this.paddleController;
      paddleController.changeFlag(false);
      let speed = 5;

      requestAnimationFrame(function measure(time) {
        const { x, y } = paddle.getBoundingClientRect();
        if (x > 10 && dx == -1) {
          paddleController.progress -= speed;
        } else if (x < 1310 && dx == 1) {
          paddleController.progress += speed;
        }
        //paddleController.progress += speed * dx;
        //if (x > 0 && x < 1200) {
        paddle.style.marginLeft = `${paddleController.progress}px`;
        //}
        console.log(paddleController.progress);

        if (!paddleController.stopFlag) {
          requestAnimationFrame(measure);
        }
      });
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleEnter(e: KeyboardEvent) {
    if (e.code == 'ArrowLeft' || e.code == 'ArrowRight') {
      this.paddleController.changeFlag(true);

      //console.log('Keyup: ', this.paddleController);
    }
  }
}
