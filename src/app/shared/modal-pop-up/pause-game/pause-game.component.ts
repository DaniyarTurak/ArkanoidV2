import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export enum PauseResponse {
  Restart = 'Restart',
  Cancel = 'Cancel',
}

@Component({
  selector: 'app-pause-game',
  templateUrl: './pause-game.component.html',
  styleUrls: ['./pause-game.component.scss'],
})
export class PauseGameComponent implements OnInit {
  today = new Date();
  constructor(private dialogRef: MatDialogRef<PauseGameComponent>) {}

  ngOnInit(): void {}

  handleRestartClick(): void {
    this.dialogRef.close(PauseResponse.Restart);
  }

  handleCancelClick(): void {
    this.dialogRef.close(PauseResponse.Cancel);
  }
}
