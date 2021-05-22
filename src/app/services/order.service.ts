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
  public asks$: Observable<Order[]>;
  public bids$: Observable<Order[]>;

  private orderDataService = new OrderDataService();
  private bidStore: OrdersStore = new OrdersStore();
  private bidQuery: OrdersQuery = new OrdersQuery(this.bidStore);
  private askStore: OrdersStore = new OrdersStore();
  private askQuery: OrdersQuery = new OrdersQuery(this.askStore);

  constructor() {
    this.orderDataService.connect();
    this.orderDataService.messages$$.subscribe({
      next: ({ asks, bids }) => this.updateOrders(asks, bids),
    });

    this.asks$ = this.askQuery.selectAll({
      sortBy: 'price',
      sortByOrder: AkOrder.ASC,
    });

    this.bids$ = this.bidQuery.selectAll({
      sortBy: 'price',
      sortByOrder: AkOrder.ASC,
    });
  }

  updateOrders(
    asks: [number, number][] = [],
    bids: [number, number][] = []
  ): void {
    asks.forEach((ask) => this.upsertToStore(ask, this.askStore));
    bids.forEach((bid) => this.upsertToStore(bid, this.bidStore));
  }

  private upsertToStore(entry: [number, number], store: OrdersStore): void {
    const order: Order = {
      price: entry[0],
      size: entry[1],
    };

    if (order.size === 0) {
      // remove
      store.remove(order.price);
    } else {
      // Store with price as the ID of the order
      store.upsert(order.price, order);
    }
  }

  ngOnDestroy(): void {
    this.orderDataService.close();
  }
}
