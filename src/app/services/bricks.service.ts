import { Injectable } from '@angular/core';
import { IBrick } from '../types/IBrick';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { deleteBrick } from '../store/bricks/bricks.actions';

@Injectable({
  providedIn: 'root',
})
export class BricksService {
  bricks: IBrick[] = [
    {
      id: 1,
      bonus: 'speed',
      brick: null,
      status: true,
    },
    {
      id: 2,
      bonus: 'power',
      brick: null,
      status: true,
    },
    {
      id: 3,
      bonus: null,
      brick: null,
      status: true,
    },
    {
      id: 4,
      bonus: null,
      brick: null,
      status: true,
    },
    {
      id: 5,
      bonus: null,
      brick: null,
      status: true,
    },
    {
      id: 6,
      bonus: null,
      brick: null,
      status: true,
    },
    {
      id: 7,
      bonus: null,
      brick: null,
      status: true,
    },
  ];

  constructor(private store: Store) {}

  // setBricks(id: number, brick: DOMRect): void {
  //   const objIndex = this.bricks.findIndex((obj) => obj.id === id);
  //   this.bricks[objIndex] = { ...this.bricks[objIndex], brick };
  // }

  getBricks(): Observable<any[]> {
    return of(this.bricks);
  }

  destroyBrick(id: number): void {
    const objIndex = this.bricks.findIndex((obj) => obj.id === id);
    console.log('Destroy Id: ' + id);
    this.bricks[objIndex] = { ...this.bricks[objIndex], status: false };
    this.store.dispatch(deleteBrick({ id }));
  }
}
