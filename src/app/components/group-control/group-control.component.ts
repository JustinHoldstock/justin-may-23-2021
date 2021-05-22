import { Component, OnInit, Output, EventEmitter } from '@angular/core';

const GROUPS = [0.5, 1.0, 2.5, 5.0, 10.0, 25.0, 100, 250, 500, 1000, 2500];

@Component({
  selector: 'app-group-control',
  templateUrl: './group-control.component.html',
  styleUrls: ['./group-control.component.scss'],
})
export class GroupControlComponent implements OnInit {
  @Output() groupChanged: EventEmitter<number> = new EventEmitter();

  groupIndex = 0;
  readonly groups = GROUPS;
  groupVal: string;

  ngOnInit(): void {
    this.groupUpdated(0);
  }

  groupUpdated(direction: number): void {
    this.groupIndex = Math.max(
      0,
      Math.min(this.groups.length - 1, this.groupIndex + direction)
    );

    this.groupChanged.emit(this.groups[this.groupIndex]);
    this.groupVal = this.groups[this.groupIndex].toFixed(2);
  }
}
