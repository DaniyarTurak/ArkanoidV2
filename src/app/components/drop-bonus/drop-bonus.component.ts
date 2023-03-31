import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { IBrick } from 'src/app/types/IBrick';

@Component({
  selector: 'app-drop-bonus',
  templateUrl: './drop-bonus.component.html',
  styleUrls: ['./drop-bonus.component.scss'],
})
export class DropBonusComponent implements OnInit {
  @Input() brick!: IBrick;

  ngOnInit(): void {
    if (!this.brick.status) {
      requestAnimationFrame(() => this.changeShit());
    }
  }

  changeShit(): void {
    console.log('Changesssss');
  }
}
