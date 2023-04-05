import {
  Component,
  EventEmitter,
  Output,
  OnChanges,
  OnInit,
} from '@angular/core';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game-over-content',
  templateUrl: './game-over-content.component.html',
  styleUrls: ['./game-over-content.component.scss'],
})
export class GameOverContentComponent implements OnInit, OnChanges {
  @Output() restartGame = new EventEmitter();
  faArrowLeftLong = faArrowLeftLong;
  list_top_scorers = [];

  pauseFlag: boolean = false;
  aboutFlag: boolean = false;

  ngOnInit(): void {
    this.list_top_scorers = JSON.parse(
      localStorage.getItem('top_scorers')
    ).sort((a, b) => b.score - a.score);

    console.log('Top_Scorer: ', this.list_top_scorers);
  }

  ngOnChanges(): void {}

  handleRestartClick(): void {
    this.restartGame.emit();
  }
}
