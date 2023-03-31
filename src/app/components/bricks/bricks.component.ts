import { Component, OnInit, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BricksService } from 'src/app/services/bricks.service';

@Component({
  selector: 'app-bricks',
  templateUrl: './bricks.component.html',
  styleUrls: ['./bricks.component.scss'],
})
export class BricksComponent implements OnInit {
  bricks = [];
  _subscription = new Subscription();

  constructor(private bricksService: BricksService, private el: ElementRef) {}

  ngOnInit(): void {
    this._subscription = this.bricksService.getBricks().subscribe((bricks) => {
      this.bricks = bricks;
    });

    // this._subscription.unsubscribe();
  }
}
