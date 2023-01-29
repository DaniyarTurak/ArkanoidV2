import { Component, Input, OnInit, HostListener } from '@angular/core';
import { BallController } from 'src/app/controllers/ballController';
import { BricksService } from 'src/app/services/bricks.service';

@Component({
  selector: 'mc-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements OnInit {
  ngOnInit(): void {}
}
