import {
  Component,
  OnInit,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BricksService } from 'src/app/services/bricks.service';

@Component({
  selector: 'app-bricks',
  templateUrl: './bricks.component.html',
  styleUrls: ['./bricks.component.scss'],
})
export class BricksComponent implements OnInit, OnChanges {
  @Input() isGameStarted: boolean;
  bricks = [];
  _subscription = new Subscription();

  constructor(private bricksService: BricksService, private el: ElementRef) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.isGameStarted) {
      this.bricksService.getBricks().subscribe((bricks) => {
        this.bricks = bricks;
      });
    }
  }
}
