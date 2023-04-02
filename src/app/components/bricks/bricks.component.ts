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
  @Input() isGameStarted: boolean = false;
  @Output() bonusConnected = new EventEmitter();
  bricks = [];
  _subscription = new Subscription();

  constructor(private bricksService: BricksService, private el: ElementRef) {}

  ngOnInit(): void {
    this._subscription = this.bricksService.getBricks().subscribe((bricks) => {
      this.bricks = bricks;
    });
  }

  ngOnChanges(): void {
    if (this.isGameStarted) {
      const bricksList =
        this.el.nativeElement.children[0].querySelectorAll('.brick');
    }
  }

  bonusConnection(bonusName: string): void {
    this.bonusConnected.emit(bonusName);
  }
}
