import {
  Component,
  EventEmitter,
  Output,
  OnChanges,
  OnInit,
} from '@angular/core';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-game-over-content',
  templateUrl: './game-over-content.component.html',
  styleUrls: ['./game-over-content.component.scss'],
})
export class GameOverContentComponent implements OnInit, OnChanges {
  @Output() restartGame = new EventEmitter();
  faArrowLeftLong = faArrowLeftLong;
  list_top_scorers = [];
  current_user_id: string;

  aboutFlag: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.current_user_id = this.userService.getUser().id;

    this.list_top_scorers = JSON.parse(
      localStorage.getItem('top_scorers')
    ).sort((a, b) => b.score - a.score);
  }

  ngOnChanges(): void {}

  handleRestartClick(): void {
    this.restartGame.emit();
  }
}
