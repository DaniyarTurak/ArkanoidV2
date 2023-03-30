import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isGameStarted: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('document:keydown', ['$event'])
  startGame(e: KeyboardEvent): void {
    if (e.code === 'Enter') {
      this.isGameStarted = true;
    } else if (e.code === 'Space') this.isGameStarted = false;
  }
}
