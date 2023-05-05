import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-start-game-pop-up',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent {
  constructor(
    private Ref: MatDialogRef<StartGameComponent>,
    private userService: UserService
  ) {}
  handleStartClick(): void {
    let id = Date.now().toString();
    let userName = 'User' + id;
    this.userService.setInitialUser(userName, id);
    this.Ref.close();
  }
}
