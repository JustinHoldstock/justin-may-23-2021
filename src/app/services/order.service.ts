import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Order as AkOrder } from '@datorama/akita';
import { Order } from '../state/order.model';
import { OrdersQuery } from '../state/order.query';
import { OrdersStore } from '../state/order.store';
import { OrderDataService } from './order-data.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements OnDestroy {
  // Observable containing asks in ascending order
  public asks$: Observable<Order[]>;
  // Observable containing bids in descending order
  public bids$: Observable<Order[]>;

  private orderDataService = new OrderDataService();
  private bidStore: OrdersStore = new OrdersStore();
  private bidQuery: OrdersQuery = new OrdersQuery(this.bidStore);
  private askStore: OrdersStore = new OrdersStore();
  private askQuery: OrdersQuery = new OrdersQuery(this.askStore);

  subscriptions: Subscription[] = [];

  constructor() {
    // Kickstart websocket held by the service
    this.orderDataService.connect();

    // Listen for message updates and update order store
    const messageSub = this.orderDataService.messages$$.subscribe({
      next: ({ asks, bids }) => this.updateOrders(asks, bids),
    });

    this.subscriptions.push(messageSub);

    // Get observable watching store for updates
    // Ascending order
    this.asks$ = this.askQuery.selectAll({
      sortBy: 'price',
      sortByOrder: AkOrder.ASC,
    });

    // Get observable watching store for updates
    // Descending order
    this.bids$ = this.bidQuery.selectAll({
      sortBy: 'price',
      sortByOrder: AkOrder.DESC,
    });
  }

  /**
   * Update the store with new entries
   * @param asks - List of ask orders
   * @param bids - List of bid orders
   */
  updateOrders(
    asks: [number, number][] = [],
    bids: [number, number][] = []
  ): void {
    asks.forEach((ask) => this.updateStore(ask, this.askStore));
    bids.forEach((bid) => this.updateStore(bid, this.bidStore));
  }

  /**
   * Upsert an entry into the provided store after converting to an order entity
   * @param entry - Order data to upsert into the store, or delete if empty
   * @param store - The store to add the entity to
   */
  private updateStore(entry: [number, number], store: OrdersStore): void {
    const order: Order = {
      price: entry[0],
      size: entry[1],
    };

    if (order.size === 0) {
      // remove when no order items
      store.remove(order.price);
    } else {
      // Store with price as the ID of the order
      store.upsert(order.price, order);
    }
  }

  ngOnDestroy(): void {
    this.orderDataService.close();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
