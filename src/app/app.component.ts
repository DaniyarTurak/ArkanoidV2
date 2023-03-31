import { Component, ElementRef, HostListener } from '@angular/core';
import { Board } from './constants/Board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  balls = [{ id: 1 }];
  isGameStarted: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('document:keydown', ['$event'])
  startGame(e: KeyboardEvent): void {
    if (e.code === 'Enter') {
      this.isGameStarted = true;
      const { width: boardWidth, height: boardHeight } = this.el.nativeElement
        .querySelector('.board')
        .getBoundingClientRect();
      const board = Board.Instance;
      board.setValues(boardWidth, boardHeight);
    } else if (e.code === 'Space') this.isGameStarted = false;
  }
}
