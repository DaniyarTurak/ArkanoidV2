import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mc-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements OnInit {
  @Input() moveBall: number;
  constructor() {}

  ngOnInit(): void {}
}
