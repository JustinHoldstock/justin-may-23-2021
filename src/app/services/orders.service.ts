import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, switchAll, tap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';

const ORDERS_URL = 'wss://www.cryptofacilities.com/ws/v1';
const ORDERS_START_MESSAGE = {
  event: 'subscribe',
  feed: 'book_ui_1',
  product_ids: ['PI_XBTUSD'],
};

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  socket$: WebSocketSubject<any>;
  messages$$: Subject<any> = new Subject<any>();

  constructor() {}

  public connect(): void {
    this.socket$ = this.createSocket();

    this.socket$.subscribe({
      next: console.log,
      error: console.error,
    });

    this.socket$.next(ORDERS_START_MESSAGE);
  }

  public close(): void {
    this.socket$.complete();
  }

  /**
   * Create a new websocket
   * @returns The new websocket
   */
  private createSocket(): WebSocketSubject<any> {
    return webSocket({
      url: ORDERS_URL,
      closeObserver: {
        next: () => console.log('Socket closed, connection lost'),
      },
      serializer: (message) => {
        console.log(message);
        return JSON.stringify(message);
      },
      deserializer: ({ data }) => JSON.parse(data),
    });
  }
}
