import { Injectable } from '@angular/core';
import { Ball } from '../controllers/Ball';

@Injectable({
  providedIn: 'root',
})
export class BallService {
  balls = [];
  constructor() {}
}
