import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Order } from 'src/app/state/order.model';

import { OrderTableComponent } from './order-table.component';

fdescribe('OrderTableComponent', () => {
  let component: OrderTableComponent;
  let fixture: ComponentFixture<OrderTableComponent>;
  let orders$;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    orders$ = new Subject();

    fixture = TestBed.createComponent(OrderTableComponent);
    component = fixture.componentInstance;
    component.orders$ = orders$;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should setup the observable for tracking order updates', () => {
      component.ngOnInit();
      const spy = jasmine.createSpy();
      const sub = component.orderGroups$.subscribe(spy);

      orders$.next([{}, {}, {}]);

      expect(spy).toHaveBeenCalled();

      sub.unsubscribe();
    });
  });

  describe('calculateInitialPriceGroup()', () => {
    it('should determine the closest price group that can contain this price', () => {
      component.priceGroup = 2500;
      const expectedGroup = 37500;
      const capItem: Order = {
        price: 36000,
        size: 300,
      };

      expect((component as any).calculateInitialPriceGroup(capItem)).toEqual(
        expectedGroup
      );
    });
  });

  describe('createOrderGroups()', () => {
    it('should make correct groups in incrementing order when not flipped', () => {
      component.priceGroup = 2500;
      const orders: Order[] = [
        { price: 39000, size: 1 },
        { price: 38000, size: 1 },
        { price: 37000, size: 1 },
        { price: 100, size: 1 },
      ];
      const expected = [
        {
          price: 40000,
          size: 2,
          total: 2,
        },
        {
          price: 37500,
          size: 1,
          total: 3,
        },
        {
          price: 2500,
          size: 1,
          total: 4,
        },
      ];

      const result = (component as any).createOrderGroups(orders);
      console.log(result);
      expect(result).toEqual(expected);
    });

    it('should make correct groups in decrementing order when flipped', () => {
      component.priceGroup = 2500;
      component.flipAxis = true;
      fixture.detectChanges();
      const orders: Order[] = [
        { price: 100, size: 1 },
        { price: 37000, size: 1 },
        { price: 38000, size: 1 },
        { price: 39000, size: 1 },
      ];
      const expected = [
        {
          price: 2500,
          size: 1,
          total: 1,
        },
        {
          price: 37500,
          size: 1,
          total: 2,
        },
        {
          price: 40000,
          size: 2,
          total: 4,
        },
      ];

      const result = (component as any).createOrderGroups(orders);
      expect(result).toEqual(expected);
    });
  });
});
