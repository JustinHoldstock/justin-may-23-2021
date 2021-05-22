import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/state/order.model';

interface OrderDisplay extends Order {
  total: number;
}

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTableComponent implements OnInit {
  @Input() orders$: Observable<Order[]>;

  displayOrders$: Observable<OrderDisplay[]>;

  constructor() {}

  ngOnInit(): void {
    this.displayOrders$ = this.orders$.pipe(
      map((orders) => {
        let total = 0;
        return orders.map((order) => {
          total += order.size;
          return {
            ...order,
            total,
          };
        });
      })
    );
  }
}
