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

  // Observable containing the list of orders
  @Input() orders$: Observable<Order[]>;
  // Whether or not to flip the axis for asks. Bids run right to left
  @Input() flipAxis: boolean;
  // Current price group. In dollars
  @Input() priceGroup = 0.5;

  // Used for storing display values, including totals and price groups
  displayOrders$: Observable<OrderDisplay[]>;

  ngOnInit(): void {
    this.displayOrders$ = this.orders$.pipe(
      filter((orders) => !!orders.length),
      map((orders) => {
        // We always know that the store gives us sorted values. First value is
        // starting bound
        const cap = orders.shift();
        let currPriceGroup = this.calculateInitialPriceGroup(cap);
        const additive = this.priceGroup * (this.flipped ? 1 : -1);
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
          if (price % currPriceGroup > this.priceGroup) {
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

  /**
   * Given a cap item (first item in the list, either highest or lowest price, depending on sort)
   * calculate the first group needed to group orders by price group
   * @param capItem - Highest or lowest priced order
   * @returns A price that we can group orders into, based on group price
   */
  calculateInitialPriceGroup(capItem: Order): number {
    const capPrice = capItem.price + this.priceGroup;
    const diff = capPrice % this.priceGroup;
    return capPrice - diff;
  }
}
