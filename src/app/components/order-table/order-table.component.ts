// Component used for rendering orders

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
  @Input() orders$!: Observable<Order[]>;
  // Whether or not to flip the axis for asks. Bids run right to left
  @Input() flipAxis: boolean;
  // Current price group. In dollars
  @Input() priceGroup = 0.5;

  // Used for storing display values, including totals and price groups
  orderGroups$: Observable<OrderDisplay[]>;

  ngOnInit(): void {
    this.orderGroups$ = this.orders$.pipe(
      filter((orders) => !!orders.length),
      map((orders) => this.createOrderGroups(orders))
    );
  }

  /**
   * Given a cap item (first item in the list, either highest or lowest price, depending on sort)
   * calculate the first group needed to group orders by price group
   * @param capItem - Highest or lowest priced order
   * @returns A price that we can group orders into, based on group price
   */
  private calculateInitialPriceGroup(capItem: Order): number {
    const capPrice = capItem.price + this.priceGroup;
    const diff = capPrice % this.priceGroup;
    return capPrice - diff;
  }

  /**
   * Given a list of order items, make their price grouped display version.
   * @param orders - List of orders to group and calulate totals for
   * @returns list of group order display items
   */
  private createOrderGroups(orders: Order[]): OrderDisplay[] {
    // Akita store gives us results in the sort order we choose,
    // We know that the first item in the list is always the highest or lowest value
    const cap = orders.shift();
    let currPriceGroup = this.calculateInitialPriceGroup(cap);

    let displayGroup = {
      price: currPriceGroup,
      size: cap.size,
      total: 0,
    };

    const displayItems = [];

    orders.forEach((order, index) => {
      // Figure out if we should create a new group
      const shouldMakeNewGroup = this.flipAxis
        ? order.price > currPriceGroup
        : currPriceGroup - order.price > this.priceGroup;

      if (shouldMakeNewGroup) {
        displayGroup.total += displayGroup.size;

        displayItems.push(displayGroup);

        currPriceGroup = this.calculateInitialPriceGroup(order);

        // Update the temp group to contain our new group
        displayGroup = {
          price: currPriceGroup,
          size: 0,
          total: displayGroup.total,
        };
      }

      displayGroup.size += order.size;

      // If we're at the end, let's wrap things up
      if (index === orders.length - 1) {
        displayGroup.total += displayGroup.size;
        displayItems.push(displayGroup);
      }
    });

    return displayItems;
  }
}
