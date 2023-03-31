import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { Board } from 'src/app/constants/Board';
import { DropBonusService } from 'src/app/services/drop-bonus.service';
import { IBrick } from 'src/app/types/IBrick';

@Component({
  selector: 'app-drop-bonus',
  templateUrl: './drop-bonus.component.html',
  styleUrls: ['./drop-bonus.component.scss'],
})
export class DropBonusComponent implements OnInit {
  @Input() brick!: IBrick;
  progressY: number = 1;
  board = null;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private dropBonusService: DropBonusService
  ) {}

  ngOnInit(): void {
    this.board = Board.Instance;

    if (!this.brick.status) {
      this.dropBonus();
      //this.dropBonusService.startDropping(() => this.dropBonus());
    }
  }

  dropBonus(): void {
    const drop = this.el.nativeElement.querySelector('.drop-bonus'),
      { y, bottom } = drop.getBoundingClientRect();
    this.progressY += 1;
    this.renderer.setStyle(drop, 'margin-top', `${this.progressY}px`);

    if (bottom >= this.board.height) {
      //this.dropBonusService.stopDropping();
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    } else {
      requestAnimationFrame(() => this.dropBonus());
    }
  }
}
