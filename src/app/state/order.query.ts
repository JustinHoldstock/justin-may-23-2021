import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OrdersState, OrdersStore } from './order.store';

@Injectable({ providedIn: 'root' })
export class OrdersQuery extends QueryEntity<OrdersState> {
  constructor(protected store: OrdersStore) {
    super(store);
  }
}
