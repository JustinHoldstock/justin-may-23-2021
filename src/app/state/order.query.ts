// Akita query for getting items from the store

import { QueryEntity } from '@datorama/akita';
import { OrdersState, OrdersStore } from './order.store';

export class OrdersQuery extends QueryEntity<OrdersState> {
  constructor(protected store: OrdersStore) {
    super(store);
  }
}
