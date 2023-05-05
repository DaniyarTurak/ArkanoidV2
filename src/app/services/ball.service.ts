import { Injectable } from '@angular/core';
import { Subscription, interval, timer, takeUntil, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BallService {
  moveFlag: boolean = false;
  constructor() {}

  // moveBall(move: Function): void {
  //   const oneSecond = 1000,
  //     frames = 60;

  //   this._subscriptions = interval(oneSecond / frames).subscribe((time) => {
  //     move();
  //   });
  // }

  // stopBall(): void {
  //   if (!!this._subscriptions) this._subscriptions.unsubscribe();
  // }
}
