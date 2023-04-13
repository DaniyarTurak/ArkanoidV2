import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-start-game-pop-up',
  templateUrl: './start-game.component.html',
  styleUrls: ['./start-game.component.scss'],
})
export class StartGameComponent implements OnInit {
  constructor(
    private Ref: MatDialogRef<StartGameComponent>,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  handleStartClick(): void {
    let id = Date.now().toString();
    let userName = 'User' + id;
    this.userService.setInitialUser(userName, id);
    this.Ref.close();
  }
}
