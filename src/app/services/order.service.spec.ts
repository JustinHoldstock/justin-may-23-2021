import { OrderDataService } from './order-data.service';
import { OrderService } from './order.service';

fdescribe('OrderService', () => {
  let service: OrderService;

  OrderDataService.prototype.connect = jasmine.createSpy();
  OrderDataService.prototype.close = jasmine.createSpy();

  beforeEach(() => {
    service = new OrderService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor()', () => {
    it('should kickstart the websocket connection', () => {
      expect((service as any).orderDataService.connect).toHaveBeenCalled();
    });

    it('should subscribe to the message obsevable to update orders', () => {
      service.updateOrders = jasmine.createSpy();
      (service as any).orderDataService.messages$$.next({ asks: [] });
      (service as any).orderDataService.messages$$.next({ bids: [] });
      expect(service.updateOrders).toHaveBeenCalledTimes(2);
    });

    it('should setup a query for asks', (done) => {
      service.asks$.subscribe((asks) => {
        // This occurring is all we need to confim the query is setup
        expect(asks).toBeDefined();
        done();
      });
    });

    it('should setup a query for bids', (done) => {
      service.bids$.subscribe((bids) => {
        // This occurring is all we need to confim the query is setup
        expect(bids).toBeDefined();
        done();
      });
    });
  });

  describe('updateOrders()', () => {
    it('should update the ask store', (done) => {
      service.updateOrders([[123, 321]]);

      service.asks$.subscribe((asks) => {
        expect(asks.length).toEqual(1);
        done();
      });
    });

    it('should update the bid store store', (done) => {
      service.updateOrders([], [[123, 321]]);

      service.bids$.subscribe((bids) => {
        expect(bids.length).toEqual(1);
        done();
      });
    });
  });

  describe('updateStore()', () => {
    it('should remove an entity from the store if the order is empty', () => {
      const removeStub = jasmine.createSpy();
      (service as any).askStore.remove = removeStub;

      (service as any).updateStore([123, 0], (service as any).askStore);

      expect(removeStub).toHaveBeenCalled();
    });

    it('should upsert the order into the store', () => {
      const upStub = jasmine.createSpy();
      (service as any).askStore.upsert = upStub;

      (service as any).updateStore([123, 321], (service as any).askStore);

      expect(upStub).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should close the websocket connection', () => {
      service.ngOnDestroy();
      expect((service as any).orderDataService.close).toHaveBeenCalled();
    });

    it('should cleanup message subscription', () => {
      service.ngOnDestroy();
      service.updateOrders = jasmine.createSpy();
      (service as any).orderDataService.messages$$.next({ asks: [] });
      (service as any).orderDataService.messages$$.next({ bids: [] });
      expect(service.updateOrders).not.toHaveBeenCalled();
    });
  });
});
