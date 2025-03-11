import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface CryptoData {
  name: string;
  symbol: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private socket: WebSocket | null = null;
  private cryptoSubject = new Subject<CryptoData>(); // RxJS Subject for real-time updates

  // The most popular coins
  private majorCoins = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT'];

  constructor() {
    this.startWebSocket();
  }

  private startWebSocket() {
    // Close existing socket if it exists
    if (this.socket) {
      this.socket.close();
    }

    // Create a new WebSocket connection
    const wsUrl = `wss://stream.binance.com:9443/ws/${this.majorCoins
      .map((coin) => `${coin.toLowerCase()}@trade`)
      .join('/')}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const symbol = data.s.toUpperCase();
      const price = parseFloat(data.p);

      this.cryptoSubject.next({ name: symbol, symbol, price }); // Emit data using RxJS Subject
    };

    this.socket.onerror = () => {
      console.error('Error connecting to Binance WebSocket');
    };

    this.socket.onclose = () => {
      console.log('Disconnected from Binance WebSocket');
    };

    // Close WebSocket when leaving the page
    window.addEventListener('beforeunload', () => this.socket?.close());
  }

  // Expose the observable to listen for price updates
  getCryptoUpdates() {
    return this.cryptoSubject.asObservable();
  }
}
