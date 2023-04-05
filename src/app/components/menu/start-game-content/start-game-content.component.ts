import { Component, EventEmitter, Output, ElementRef } from '@angular/core';
import {
  faArrowLeft,
  faArrowLeftLong,
  faArrowLeftRotate,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private el: ElementRef, private userService: UserService) {}

  handleStartClick(): void {
    let id = Date.now().toString();
    let userName = this.el.nativeElement.querySelector('#userName').value;
    if (userName.trim().length === 0) {
      userName = 'User' + id;
    }

    this.userService.setInitialUser(userName, id);

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
