import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Order } from 'src/app/state/order.model';

interface OrderDisplay extends Order {
  total: number;
}

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderTableComponent implements OnInit {
  @HostBinding('class.flipped') get flipped(): boolean {
    return this.flipAxis;
  }

  @Input() orders$: Observable<Order[]>;
  @Input() flipAxis: boolean;
  @Input() group = 0.5;

  displayOrders$: Observable<OrderDisplay[]>;

  constructor() {}

  ngOnInit(): void {
    this.displayOrders$ = this.orders$.pipe(
      filter((orders) => !!orders.length),
      map((orders) => {
        // We always know that the store gives us sorted values. First value is
        // starting bound
        const cap = orders.shift();
        const capPrice = cap.price + this.group;
        const diff = capPrice % this.group;
        let currPriceGroup = capPrice - diff;
        const additive = this.group * (this.flipped ? 1 : -1);
        let nextPriceGroup = currPriceGroup + additive;

        let displayGroup = {
          price: currPriceGroup,
          size: cap.size,
          total: cap.size,
        };

        let grandTotal = 0;

        const displayItems = [];

        orders.forEach(({ size, price }) => {
          // if the difference in price is greater than a single group step
          // we know we're in a new group
          if (price % currPriceGroup > this.group) {
            grandTotal += displayGroup.size;
            displayGroup.total = grandTotal;
            displayItems.push(displayGroup);
            currPriceGroup = nextPriceGroup;
            nextPriceGroup += additive;
            displayGroup = {
              price: currPriceGroup,
              size,
              total: 0,
            };
          }

          displayGroup.size += size;
        });

        return displayItems;
      })
    );
  }
}
