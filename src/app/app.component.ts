import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Board } from './constants/Board';
import { Store } from '@ngrx/store';
import { selectBricks } from './store/bricks/bricks.selectors';
import { IBrick } from './types/IBrick';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';

enum GameEnded {
  YouWon = 'You Won!',
  YouLost = 'Game Over!',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  balls = [{ id: 1 }];
  _subscription: Subscription;
  startFlag: boolean = false;
  pauseFlag: boolean = false;
  gameOverFlag: boolean = false;

  constructor(
    private store: Store,
    private el: ElementRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  @HostListener('document:keydown', ['$event'])
  startGame(e: KeyboardEvent): void {
    if (e.code === 'Enter') {
      this._subscription = this.store
        .select(selectBricks)
        .subscribe((bricks) => {
          if (
            bricks.filter((brick: IBrick) => brick.status === true).length === 0
          ) {
            this.gameOver(GameEnded.YouWon);
          }
        });
    } else if (e.code === 'Space') {
      //this.gameOverFlag = true;
      //localStorage.clear();
      // const newScore = 13;
      // let arr = [10, 11, 15, 16, 17];
      // arr.push(newScore);
      // arr.sort();
      //localStorage.setItem('top-scorers', JSON.stringify(arr.slice(0, 5)));
      // this.isGameStarted = false;
      // this._subscription.unsubscribe();
    } else if (e.code == 'KeyK') {
      this.balls.push({ id: this.balls[this.balls.length - 1].id + 1 });
    } else if (e.code === 'Escape' && this.startFlag) {
      this.pauseFlag = true;
    }
  }

  gameOver(text: GameEnded) {
    //alert(text);
    this.startFlag = false;
    this.gameOverFlag = true;

    const topScorers = JSON.parse(localStorage.getItem('top_scorers')) || [];
    topScorers.push(this.userService.getUser());

    localStorage.clear();

    topScorers.sort((a, b) => b.score - a.score);
    localStorage.setItem(
      'top_scorers',
      JSON.stringify(topScorers.slice(0, 10))
    );

    this._subscription.unsubscribe();
  }

  removeBall(id: number): void {
    this.balls = this.balls.filter((ball) => ball.id !== id);
    if (this.balls.length === 0) {
      this.gameOver(GameEnded.YouLost);
    }
  }

  startingTheGame(startFlag: boolean): void {
    this.startFlag = startFlag;
    const { width: boardWidth, height: boardHeight } = this.el.nativeElement
      .querySelector('.board')
      .getBoundingClientRect();
    const board = Board.Instance;
    board.setValues(boardWidth, boardHeight);
  }

  stopPauseGame(pauseFlag: boolean): void {
    this.pauseFlag = pauseFlag;
  }
}
