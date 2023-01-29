import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  movePaddle: number = 600;
  moveBall: number = 600;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    if (e.code == 'ArrowLeft') {
      this.movePaddle -= 10;
    } else if (e.code == 'ArrowRight') {
      this.movePaddle += 10;
    }
    // if (e.code == 'ArrowLeft' || e.code == 'ArrowRight') {
    //   let startAnimation = null;
    //   let duration = 500;
    //   let distance = 50;
    //   let dx = e.code == 'ArrowLeft' ? -1 : 1;

    //   const paddle = document.querySelector<HTMLElement>('.paddle');

    //   requestAnimationFrame(function measure(time) {
    //     if (!startAnimation) {
    //       startAnimation = time;
    //     }
    //     console.log(time);

    //     const progress = (time - startAnimation) / duration;
    //     const translate = progress * distance;
    //     paddle.style.transform = `translateX(${translate * dx}px)`;

    //     if (progress < 1) {
    //       requestAnimationFrame(measure);
    //     }
    //   });

    // }
  }

  // @HostListener('window:keydown.enter', ['$event'])
  // handleEnter(e: KeyboardEvent) {
  //   let startAnimation = null;
  //   let duration = 500;
  //   let distance = 50;

  //   const ball = document.querySelector<HTMLElement>('.ball');

  //   requestAnimationFrame(function measure(time) {
  //     if (!startAnimation) {
  //       startAnimation = time;
  //     }

  //     const progress = (time - startAnimation) / duration;
  //     const translate = progress * distance;
  //     ball.style.transform = `translateX(${translate}px)`;

  //     requestAnimationFrame(measure);
  //   });
  // }
}
