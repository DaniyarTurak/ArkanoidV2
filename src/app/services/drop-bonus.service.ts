import { Injectable } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DropBonusService {
  _subscriptions: Subscription;

  constructor() {}

  startDropping(drop: Function): void {
    const oneSecond = 1000,
      frames = 60;

    this._subscriptions = interval(oneSecond / frames).subscribe((time) => {
      drop();
    });
  }

  stopDropping(): void {
    this._subscriptions.unsubscribe();
  }
}
