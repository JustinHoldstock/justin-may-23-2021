import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
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
  @HostBinding('class.flipped') get flipped(): boolean {
    return this.flipAxis;
  }

  @Input() orders$: Observable<Order[]>;
  @Input() flipAxis: boolean;
  @Input() group = 0.5; // zero means no group AKA 50c

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
