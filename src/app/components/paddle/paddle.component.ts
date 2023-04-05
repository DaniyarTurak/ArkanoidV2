import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { setPaddleCoordinates } from 'src/app/store/paddle/paddle.actions';

@Component({
  selector: 'app-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
})
export class PaddleComponent implements OnInit {
  @Input() isGameStarted: boolean = false;
  @Output() moveBeforeStart: boolean = true;
  direction: number = 0;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private store: Store
  ) {}

  ngOnInit(): void {}

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent): void {
    if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
      this.direction += e.code === 'ArrowRight' ? 30 : -30;
      this.movePaddleByKeyboard();
    }
  }

  movePaddleByKeyboard(): void {
    this.renderer.setStyle(
      this.el.nativeElement.querySelector('.paddle'),
      'margin-left',
      `${this.direction}px`
    );
  }

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove(e: MouseEvent): void {
    if (this.isGameStarted) {
      const { x, y, width, height, top, left, right, bottom } =
        this.el.nativeElement.querySelector('.paddle').getBoundingClientRect();

      if (e.movementX >= 0) this.direction = 1; // right
      else this.direction = -1; // left

      this.store.dispatch(
        setPaddleCoordinates({
          x,
          y,
          width,
          height,
          top,
          left,
          right,
          bottom,
          direction: this.direction,
        })
      );

      this.renderer.setStyle(
        this.el.nativeElement.querySelector('.paddle'),
        'transform',
        `translateX(${e.clientX - width / 2}px)`
      );

      if (this.moveBeforeStart) {
        this.renderer.setStyle(
          this.el.nativeElement.parentElement.querySelector('.ball'),
          'transform',
          `translateX(${
            e.clientX -
            this.el.nativeElement.parentElement.querySelector('.ball')
              .offsetWidth /
              2
          }px)`
        );
      }
    }
  }
}
