import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

export interface Record {
  id: string;
  name: string;
  score: number;
}

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
})
export class GameOverComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'score'];
  dataSource: Record[] = [];
  current_user_id: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GameOverComponent>,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const topScorers = JSON.parse(localStorage.getItem('top_scorers')) || [];
    topScorers.push(this.userService.getUser());
    localStorage.clear();

    topScorers.sort((a, b) => b.score - a.score);
    this.dataSource = topScorers;

    localStorage.setItem(
      'top_scorers',
      JSON.stringify(topScorers.slice(0, 10))
    );

    this.current_user_id = this.userService.getUser().id;
  }

  handleRestartClick(): void {
    this.dialogRef.close();
  }
}
