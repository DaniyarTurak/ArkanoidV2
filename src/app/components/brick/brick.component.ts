import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'mc-brick',
  templateUrl: './brick.component.html',
  styleUrls: ['./brick.component.scss'],
})
export class BrickComponent implements OnInit {
  @Input() color!: string;
  @Input() width!: string;
  @Input() height!: string;
  @Input() status!: boolean;
  @Input() id!: number;
  @Output() changeStatusEvent = new EventEmitter<number>();

  curStatus: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.curStatus = this.status;
  }

  changeStatus(): void {
    this.curStatus = false;
    this.changeStatusEvent.emit(this.id);
  }
}
