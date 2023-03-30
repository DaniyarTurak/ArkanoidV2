import { Injectable } from '@angular/core';
import { IBrick } from '../types/IBrick';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BricksService {
  bricks: DOMRect[] = [];

  constructor() {}

  setBricks(brick: DOMRect): void {
    this.bricks.push(brick);
  }

  getBricks(): Observable<DOMRect[]> {
    return of(this.bricks);
  }
}
