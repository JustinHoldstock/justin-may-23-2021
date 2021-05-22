import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderDataService } from './services/order-data.service';
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [OrderService],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'orderbook';

  constructor(private orderData: OrderService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
