// Component used for handling price group changes

import { Component, OnInit, Output, EventEmitter } from '@angular/core';

const GROUPS = [0.5, 1.0, 2.5, 5.0, 10.0, 25.0, 100, 250, 500, 1000, 2500];

@Component({
  selector: 'app-group-control',
  templateUrl: './group-control.component.html',
  styleUrls: ['./group-control.component.scss'],
})
export class GroupControlComponent implements OnInit {
  // Emits the current group value on changes
  @Output() groupChanged: EventEmitter<number> = new EventEmitter();

  // Index of the current selected group
  groupIndex = 0;
  // Mapping of constant to template accessible variable
  readonly groups = GROUPS;
  // Tracks current group value for display
  groupVal: string;

  ngOnInit(): void {
    this.groupUpdated(0);
  }

  /**
   * Update and emit the next group selected.
   * Triggered by UI interaction.
   * @param direction - Direction to move group selector. >0 means larger group, <0 means smaller
   */
  groupUpdated(direction: number): void {
    this.groupIndex = Math.max(
      0,
      Math.min(this.groups.length - 1, this.groupIndex + direction)
    );

    this.groupChanged.emit(this.groups[this.groupIndex]);
    this.groupVal = this.groups[this.groupIndex].toFixed(2);
  }
}
