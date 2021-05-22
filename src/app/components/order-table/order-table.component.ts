import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/state/order.model';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
})
export class OrderTableComponent implements OnInit {
  @Input() orders: Order[];

  constructor() {}

  ngOnInit(): void {}
}
