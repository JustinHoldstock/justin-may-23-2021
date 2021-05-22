import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Order as AkOrder } from '@datorama/akita';
import { Order } from '../state/order.model';
import { OrdersQuery } from '../state/order.query';
import { OrdersStore } from '../state/order.store';
import { OrderDataService } from './order-data.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements OnDestroy {
  public orders$: Observable<Order[]>;

  private orderDataService = new OrderDataService();

  constructor(
    private ordersStore: OrdersStore,
    private ordersQuery: OrdersQuery
  ) {
    this.orderDataService.connect();
    this.orderDataService.messages$$.subscribe({
      next: (asks) => this.updateOrders(asks),
    });

    this.orders$ = this.ordersQuery.selectAll({
      sortBy: 'price',
      sortByOrder: AkOrder.ASC,
    });
  }

  updateOrders(asks: [number, number][] = []): void {
    if (!asks.length) {
      return;
    }

    asks.forEach((ask) => {
      const order: Order = {
        price: ask[0],
        size: ask[1],
      };

      if (order.size === 0) {
        this.ordersStore.remove(order.price);
      } else {
        this.ordersStore.upsert(order.price, order);
      }
    });
  }

  ngOnDestroy(): void {
    this.orderDataService.close();
  }
}
