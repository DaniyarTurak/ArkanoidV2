import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BricksService } from 'src/app/services/bricks.service';
import { selectBall } from 'src/app/store/ball/ball.selectors';
import { IBall } from 'src/app/types/IBall';

@Component({
  selector: 'app-brick',
  templateUrl: './brick.component.html',
  styleUrls: ['./brick.component.scss'],
})
export class BrickComponent implements OnInit {
  constructor(
    private store: Store,
    private renderer: Renderer2,
    private el: ElementRef,
    private brickService: BricksService
  ) {}

  ngOnInit(): void {
    this.brickService.setBricks(this.el.nativeElement.getBoundingClientRect());
  }
}
