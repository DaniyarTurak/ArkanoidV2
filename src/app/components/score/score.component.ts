import { Component, OnInit } from '@angular/core';
import { BricksService } from 'src/app/services/bricks.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent implements OnInit {
  score: number = 0;
  constructor(private bricksService: BricksService) {}

  ngOnInit(): void {
    // this.bricksService.getBricks().subscribe((bricks) => {
    //   console.log('Score: ', bricks);
    // });
  }
}
