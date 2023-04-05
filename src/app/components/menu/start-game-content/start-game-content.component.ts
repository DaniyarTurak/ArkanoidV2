import { Component, EventEmitter, Output } from '@angular/core';
import {
  faArrowLeft,
  faArrowLeftLong,
  faArrowLeftRotate,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-start-game-content',
  templateUrl: './start-game-content.component.html',
  styleUrls: ['./start-game-content.component.scss'],
})
export class StartGameContentComponent {
  @Output() startGame = new EventEmitter();
  faArrowLeftLong = faArrowLeftLong;

  startFlag: boolean = true;
  aboutFlag: boolean = false;

  handleStartClick(): void {
    this.startGame.emit(this.startFlag);
  }

  handleAboutClick(): void {
    this.aboutFlag = true;
    this.aboutFlag = true;
  }

  handleBackClick(): void {
    this.aboutFlag = false;
  }
}
