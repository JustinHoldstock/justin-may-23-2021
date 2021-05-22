import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Order } from './order.model';

export interface OrdersState extends EntityState<Order, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'orders' })
export class OrdersStore extends EntityStore<OrdersState> {
  constructor() {
    super();
  }
}
