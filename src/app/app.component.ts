import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from './services/orders.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [OrdersService],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'orderbook';

  constructor(private orders: OrdersService) {}

  ngOnInit(): void {
    this.orders.connect();
  }

  ngOnDestroy(): void {
    this.orders.close();
  }
}
