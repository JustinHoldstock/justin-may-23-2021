import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderService } from './services/order.service';
import { Order } from './state/order.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [OrderService],
})
export class AppComponent implements OnInit, OnDestroy {
  bids$: Observable<Order[]>;
  asks$: Observable<Order[]>;

  priceGroup: number;

  constructor(private orderData: OrderService) {}

  ngOnInit(): void {
    this.bids$ = this.orderData.bids$;
    this.asks$ = this.orderData.asks$;
  }

  groupChanged(val: number): void {
    this.priceGroup = val;
  }

  ngOnDestroy(): void {}
}
