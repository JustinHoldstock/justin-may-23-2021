import { Injectable, OnDestroy } from '@angular/core';
import { OrdersQuery } from '../state/order.query';
import { OrdersStore } from '../state/order.store';
import { OrderDataService } from './order-data.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService implements OnDestroy {
  private orderDataService = new OrderDataService();

  constructor(
    private ordersStore: OrdersStore,
    private ordersQuery: OrdersQuery
  ) {
    this.orderDataService.connect();
    this.orderDataService.messages$$.subscribe({
      next: console.log,
    });
  }

  ngOnDestroy(): void {
    this.orderDataService.close();
  }
}
