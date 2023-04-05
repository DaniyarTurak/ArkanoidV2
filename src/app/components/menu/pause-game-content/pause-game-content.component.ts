import { Component, EventEmitter, Output } from '@angular/core';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pause-game-content',
  templateUrl: './pause-game-content.component.html',
  styleUrls: ['./pause-game-content.component.scss'],
})
export class PauseGameContentComponent {
  @Output() restartGame = new EventEmitter();
  faArrowLeftLong = faArrowLeftLong;

  pauseFlag: boolean = false;
  aboutFlag: boolean = false;

  handleRestartClick(): void {
    this.restartGame.emit();
  }

  handleAboutClick(): void {
    this.aboutFlag = true;
    this.aboutFlag = true;
  }

  handleBackClick(): void {
    this.aboutFlag = false;
  }
}
