import { Component, EventEmitter, Output } from '@angular/core';
import { faArrowLeftLong, faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pause-game-content',
  templateUrl: './pause-game-content.component.html',
  styleUrls: ['./pause-game-content.component.scss'],
})
export class PauseGameContentComponent {
  @Output() restartGame = new EventEmitter();
  @Output() closePauseMenu = new EventEmitter();
  faArrowLeftLong = faArrowLeftLong;
  faClose = faClose;

  aboutFlag: boolean = false;

  handleRestartClick(): void {
    console.log('Restart Pause');
    this.restartGame.emit();
  }

  handleAboutClick(): void {
    this.aboutFlag = true;
  }

  handleBackClick(): void {
    this.aboutFlag = false;
  }

  handleClose(): void {
    this.closePauseMenu.emit();
  }
}
