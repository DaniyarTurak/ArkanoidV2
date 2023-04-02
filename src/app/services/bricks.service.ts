import { Injectable } from '@angular/core';
import { IBrick } from '../types/IBrick';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { deleteBrick } from '../store/bricks/bricks.actions';
import { BallMode } from '../types/IPaddle';

@Injectable({
  providedIn: 'root',
})
export class BricksService {
  bricks: IBrick[] = [
    {
      id: 1,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 2,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 3,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 4,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 5,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 6,
      bonusName: BallMode.Power,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 7,
      bonusName: BallMode.Power,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 8,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 9,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 10,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 11,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 12,
      bonusName: BallMode.Power,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 13,
      bonusName: BallMode.Power,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 14,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 15,
      bonusName: BallMode.Speed,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 16,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 17,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 18,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 19,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 20,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
    {
      id: 21,
      bonusName: BallMode.Default,
      brick: null,
      status: true,
      hitCount: 2,
    },
  ];

  constructor(private store: Store) {}

  // setBricks(id: number, bricks: DOMRect[]): void {}

  getBricks(): Observable<any[]> {
    return of(this.bricks);
  }

  destroyBrick(id: number, mode: BallMode = BallMode.Default): void {
    const objIndex = this.bricks.findIndex((obj) => obj.id === id);
    this.bricks[objIndex].hitCount -= 1;
    console.log('mode: ', mode);

    if (this.bricks[objIndex].hitCount === 0 || mode === BallMode.Power) {
      this.bricks[objIndex].hitCount = 0;
      this.bricks[objIndex] = { ...this.bricks[objIndex], status: false };
      this.store.dispatch(deleteBrick({ id }));
    }
  }
}
