import { Component, OnInit, HostListener, Input } from '@angular/core';

@Component({
  selector: 'mc-paddle',
  templateUrl: './paddle.component.html',
  styleUrls: ['./paddle.component.scss'],
})
export class PaddleComponent implements OnInit {
  @Input() movePaddle: number;

  ngOnInit(): void {}
}
