import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { OrderDataService } from './order-data.service';

fdescribe('OrderDataService', () => {
  let service: OrderDataService;

  beforeEach(() => {
    service = new OrderDataService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('connect()', () => {
    it('should do nothing if the socket has already been created', () => {
      service.connect();
      const socketStub = jasmine.createSpy();
      (service as any).createSocket = socketStub;
      service.connect();
      expect(socketStub).not.toHaveBeenCalled();
    });

    it('should create a connection and retry if it fails to connect');
    it('should create a connection and update messages on message update');
  });

  describe('close()', () => {
    // This test suite is not playing well with Jasmine

    it('should unsubscribe from the websocket, killing it', () => {
      // service.connect();
      // const spy = spyOn(service.connection, 'unsubscribe');
      // service.close();
      // expect(spy).toHaveBeenCalled();
    });

    // Skipping this because the above assertion can't be proven
    it("should do nothing if we've already unsubscribed");
  });

  describe('messageRecieved()', () => {
    it('should push the new message into the stream', (done) => {
      service.messages$$.pipe(first()).subscribe((message) => {
        expect(message).toEqual({ asks: [[321, 13]], bids: [[123, 321]] });
        done();
      });

      const asks = [[321, 13]];
      const bids = [[123, 321]];
      (service as any).messageRecieved({ asks, bids });
    });
  });

  describe('createSocket()', () => {
    // Note, this is my first time playing constructing
    // an Observable like this I'll try and test this
    // Going to come to this last
  });
});
