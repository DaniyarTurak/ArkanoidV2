import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Board } from './constants/Board';
import { Store } from '@ngrx/store';
import { Subscription, ReplaySubject } from 'rxjs';
import { UserService } from './services/user.service';
import { BallService } from './services/ball.service';
import { BricksService } from './services/bricks.service';
import { map, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { StartGameComponent } from './shared/modal-pop-up/start-game/start-game.component';
import {
  PauseGameComponent,
  PauseResponse,
} from './shared/modal-pop-up/pause-game/pause-game.component';
import { GameOverComponent } from './shared/modal-pop-up/game-over/game-over.component';
import { selectBricks } from './store/bricks/bricks.selectors';
import { IBrick } from './types/IBrick';

enum GameEnded {
  YouWon = 'Congratulations!',
  YouLose = 'Game Over!',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('board', { static: false }) private board: ElementRef;

  balls = [{ id: 1 }];
  _subscription: Subscription;
  startFlag: boolean = false;
  pauseFlag: boolean = false;
  gameOverFlag: boolean = false;
  ballMoveFlag: boolean = false;

  resizeFlag: boolean = false;

  destroyed$ = new ReplaySubject(1);

  constructor(
    private store: Store,
    private el: ElementRef,
    private userService: UserService,
    private ballService: BallService,
    private bricksService: BricksService,
    private matdialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  openPopUp(): void {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeFlag = true;
    const { width: boardWidth, height: boardHeight } =
      this.board.nativeElement.getBoundingClientRect();

    const board = Board.Instance;
    board.setValues(boardWidth, boardHeight);
  }

  ngAfterViewInit(): void {
    const { width: boardWidth, height: boardHeight } =
      this.board.nativeElement.getBoundingClientRect();

    const board = Board.Instance;
    board.setValues(boardWidth, boardHeight);

    this.startGame();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent): void {
    if (e.code === 'Enter') {
      this._subscription = this.store
        .select(selectBricks)
        .subscribe((bricks) => {
          if (
            bricks.filter((brick: IBrick) => brick.status === true).length ===
              0 &&
            !this.resizeFlag
          ) {
            if (this.startFlag) this.gameOver(GameEnded.YouWon);
          }

          this.resizeFlag = false;
        });

      this.ballMoveFlag = true;
    } else if (e.code == 'KeyK') {
      //this.balls.push({ id: this.balls[this.balls.length - 1].id + 1 });
    } else if (e.code === 'Escape' && this.startFlag) {
      if (this.pauseFlag) return;
      const popup = this.matdialog.open(PauseGameComponent, {
        disableClose: true,
      });

      popup.afterOpened().subscribe(() => {
        this.pauseFlag = true;
      });

      popup.afterClosed().subscribe((mes) => {
        this.pauseFlag = false;

        if (mes === PauseResponse.Restart) this.restartGame();
      });
    }
  }

  playGame() {
    this._subscription = this.store
      .select(selectBricks)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((bricks) => {
        if (
          this.startFlag &&
          !bricks.filter((brick: IBrick) => brick.status === true).length
        ) {
          this.gameOver(GameEnded.YouWon);
        }
      });

    this.ballMoveFlag = true;
  }

  gameOver(text: GameEnded) {
    //alert(text);
    this.startFlag = false;
    this.gameOverFlag = true;

    const popup = this.matdialog.open(GameOverComponent, {
      disableClose: true,
      exitAnimationDuration: '100ms',
      data: {
        result: text,
      },
    });

    popup.afterClosed().subscribe(() => {
      this.restartGame();
    });
    //this._subscription.unsubscribe();
  }

  removeBall(id: number): void {
    this.balls = this.balls.filter((ball) => ball.id !== id);
    if (this.balls.length === 0) {
      this.gameOver(GameEnded.YouLose);
    }
  }

  startGame(): void {
    const popup = this.matdialog.open(StartGameComponent, {
      disableClose: true,
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
    });

    popup.afterClosed().subscribe(() => {
      this.startFlag = true;
    });
  }

  restartGame(): void {
    this.balls = [{ id: 1 }];
    this.pauseFlag = false;
    this.gameOverFlag = false;
    this.startFlag = false;
    this.ballMoveFlag = false;
    this.bricksService.restartBricks();
    this.startGame();
    this.cd.detectChanges();
  }

  closeMenu(): void {
    this.pauseFlag = false;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
