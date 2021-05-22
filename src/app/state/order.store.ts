// Akita store, used for storing state of order items

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Order } from './order.model';

export interface OrdersState extends EntityState<Order, number> {}

@StoreConfig({ name: 'orders' })
export class OrdersStore extends EntityStore<OrdersState> {
  constructor() {
    super();
  }
}
