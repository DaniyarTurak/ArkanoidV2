import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Board } from './constants/Board';
import { Store } from '@ngrx/store';
import { selectBricks } from './store/bricks/bricks.selectors';
import { IBrick } from './types/IBrick';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';
import { BallService } from './services/ball.service';
import { BricksService } from './services/bricks.service';

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
  ballMoveFlag: boolean = false;

  constructor(
    private store: Store,
    private el: ElementRef,
    private userService: UserService,
    private ballService: BallService,
    private bricksService: BricksService
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

      this.ballMoveFlag = true;
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
    console.log(startFlag);
  }

  restartGame(): void {
    this.balls = [];
    this.balls = [{ id: 1 }];
    this.pauseFlag = false;
    this.startFlag = false;
    this.gameOverFlag = false;
    this.ballMoveFlag = false;
    this.bricksService.restartBricks();
  }

  closeMenu(): void {
    this.pauseFlag = false;
  }
}
