import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBricks } from 'src/app/store/bricks/bricks.selectors';
import { IBrick } from 'src/app/types/IBrick';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {
  score: number = 0;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectBricks).subscribe((bricks) => {
      this.score = bricks.filter(
        (brick: IBrick) => brick.status === false
      ).length;
    });
  }
}
