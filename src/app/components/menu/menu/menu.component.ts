import { Component } from '@angular/core';

enum MenuOptions {
  Start = 'Start',
  About = 'About',
  Default = '',
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  MenuOptions = MenuOptions;
  menuOptions: MenuOptions = MenuOptions.Default;

  constructor() {}

  handleAboutClick(): void {
    this.menuOptions = MenuOptions.About;
  }
}
