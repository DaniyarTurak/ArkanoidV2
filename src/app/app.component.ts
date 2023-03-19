import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BallComponent } from './components/ball/ball.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  components = [];
  ballComponentClass = BallComponent;

  constructor() {}

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  @HostListener('document:keypress', ['$event'])
  handleKeypress(e: KeyboardEvent) {
    if (e.code === 'Space') {
      const component = this.container.createComponent(this.ballComponentClass);
      component.setInput('outlier', 20);
      console.log('Component: ', component);
      this.components.push(component);
    }
  }
}
