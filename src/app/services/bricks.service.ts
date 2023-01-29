import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBrick } from '../types/brick.interface';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class BricksService {
  private api = 'http://localhost:3000/bricks';

  constructor(private http: HttpClient) {}

  getBricks(): Observable<IBrick[]> {
    return this.http.get<IBrick[]>(this.api);
  }

  changeStatus(brick: IBrick): Observable<IBrick[]> {
    const url = `${this.api}/${brick.id}`;
    return this.http.put<IBrick[]>(url, brick, httpOptions);
  }
}
