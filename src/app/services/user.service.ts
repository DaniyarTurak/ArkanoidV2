import { Injectable } from '@angular/core';
import { IUser } from '../types/IUser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: IUser = null;
  constructor() {}

  setInitialUser(userName: string, id: string): void {
    console.log('setInitialUser: ', userName);
    this.user = {
      id,
      name: userName,
      score: 0,
    };
  }

  setScore(score: number): void {
    this.user = { ...this.user, score };
  }

  getUser(): IUser {
    return this.user;
  }
}
