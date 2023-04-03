import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Board } from './constants/Board';
import { Store } from '@ngrx/store';
import { selectBricks } from './store/bricks/bricks.selectors';
import { IBrick } from './types/IBrick';
import { Subscription } from 'rxjs';

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
  isGameStarted: boolean = false;
  _subscription: Subscription;

  constructor(private store: Store, private el: ElementRef) {}

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
      this.isGameStarted = true;
      const { width: boardWidth, height: boardHeight } = this.el.nativeElement
        .querySelector('.board')
        .getBoundingClientRect();
      const board = Board.Instance;
      board.setValues(boardWidth, boardHeight);
    } else if (e.code === 'Space') {
      this.isGameStarted = false;
      this._subscription.unsubscribe();
    } else if (e.code == 'KeyK') {
      //console.log(this.balls);
      this.balls.push({ id: this.balls[this.balls.length - 1].id + 1 });
    }
  }

  gameOver(text: GameEnded) {
    alert(text);
    this.isGameStarted = false;
    this._subscription.unsubscribe();
  }

  removeBall(id: number): void {
    this.balls = this.balls.filter((ball) => ball.id !== id);
    if (this.balls.length === 0) {
      this.gameOver(GameEnded.YouLost);
    }
  }
}
