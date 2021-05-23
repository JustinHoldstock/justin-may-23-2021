import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Observable, Subject, Subscription } from 'rxjs';
import { delay, retryWhen, tap } from 'rxjs/operators';

const ORDERS_URL = 'wss://www.cryptofacilities.com/ws/v1';
const ORDERS_START_MESSAGE = {
  event: 'subscribe',
  feed: 'book_ui_1',
  product_ids: ['PI_XBTUSD'],
};
const WEBSOCKET_CONFIG = {
  url: ORDERS_URL,
  closeObserver: {
    next: () => console.log('Socket closed, connection lost'),
  },
  serializer: (message) => {
    return JSON.stringify(message);
  },
  deserializer: ({ data }) => JSON.parse(data),
};

interface OrderMessage {
  feed: string;
  product_id: string;
  bids: [number, number][];
  asks: [number, number][];
}

interface OrderUpdate {
  asks: [number, number][];
  bids: [number, number][];
}

@Injectable()
export class OrderDataService {
  socket$: Observable<OrderMessage>;
  connection: Subscription;
  messages$$: Subject<OrderUpdate> = new Subject<OrderUpdate>();

  /**
   * Connect a websocket to stream order data
   */
  public connect(): void {
    if (this.socket$ || this.connection?.closed) {
      return;
    }

    this.socket$ = this.createSocket();

    this.connection = this.socket$
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            // Log the error
            tap((err) => {
              console.error('Got error', err);
            }),
            // And then wait one second to retry connection
            delay(1000)
          )
        )
      )
      .subscribe({
        next: (data) => this.messageRecieved(data),
        error: console.error,
        // In the case of error, just log a message. Don't break experience
        // thought about snack message when this occurs, but that could be a
        // horrible experience
      });
  }

  /**
   * Close off a websocket
   */
  public close(): void {
    if (this.connection) {
      this.connection.unsubscribe();
    }
  }

  /**
   * Propagate message events
   * @param Param - response containing the asks and bids lists
   */
  private messageRecieved({ asks, bids }: OrderMessage): void {
    this.messages$$.next({ asks, bids });
  }

  /**
   * Create a new websocket
   * @returns The new websocket
   */
  private createSocket(): Observable<OrderMessage> {
    return new Observable((observer) => {
      try {
        const subject = webSocket(WEBSOCKET_CONFIG);

        const subscription = subject.asObservable().subscribe(
          (data) => observer.next(data),
          (error) => observer.error(error),
          () => observer.complete()
        );

        // kicktart subscription
        subject.next(ORDERS_START_MESSAGE);

        return () => {
          if (!subscription.closed) {
            subscription.unsubscribe();
          }
        };
      } catch (error) {
        observer.error(error);
      }
    });
  }
}
