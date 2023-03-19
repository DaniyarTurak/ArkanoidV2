import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  Input,
} from '@angular/core';
import { BallService } from 'src/app/services/ball.service';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements OnInit {
  @Input() outlier: number = 0;
  dx: number = 1;
  dy: number = -1;
  step: number = 3;
  speedMode: boolean = false;
  strongMode: boolean = false;

  constructor(
    private ballService: BallService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    const { x, y } = this.el.nativeElement.getBoundingClientRect();
    this.dx += this.outlier;
    this.dy += this.outlier;
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.ball'),
      'transform',
      `translate(${this.dx}px, ${this.dy}px)`
    );
    //console.log('X: ' + x, 'Y: ' + y);
  }

  @HostListener('document:keypress', ['$event'])
  handleKeypress(e: KeyboardEvent) {
    if (e.code === 'Enter') {
      this.step = this.speedMode ? 10 : 3;

      this.dx += this.step;
      this.dy += this.step;
      console.log(this.dx, this.dy);
      this.renderer.setStyle(
        this.el.nativeElement.querySelector('.ball'),
        'transform',
        `translate(${this.dx}px, ${this.dy}px)`
      );
    } else if (e.code === 'KeyK') {
      console.log('Speed mode activated');
      this.speedMode = true;
      setTimeout(() => {
        this.speedMode = false;
        console.log('Speed mode deactivated');
      }, 3000);
    }
  }
}
