import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { OrderDataService } from './services/order-data.service';
import { OrderService } from './services/order.service';
import { Order } from './state/order.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [OrderService],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'orderbook';

  orders$: Observable<Order[]>;

  constructor(private orderData: OrderService) {}

  ngOnInit(): void {
    this.orders$ = this.orderData.orders$;
  }

  ngOnDestroy(): void {}
}
