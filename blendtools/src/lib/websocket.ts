import { EventEmitter } from 'events';

export type WebSocketConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketManagerOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export class WebSocketManager extends EventEmitter {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectAttempts: number = 0;
  private isManuallyClosed: boolean = false;
  private messageQueue: string[] = [];
  private isSending: boolean = false;

  constructor(options: WebSocketManagerOptions) {
    super();
    this.url = options.url;
    this.reconnectInterval = options.reconnectInterval || 1000;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;

    this.connect();
  }

  private connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return; // Already connected or connecting
    }

    this.emit('statusChange', 'connecting');
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.emit('statusChange', 'connected');
      this.emit('open');
      this.processQueue();
    };

    this.ws.onmessage = (event) => {
      this.emit('message', event.data);
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket closed', event.code, event.reason);
      this.emit('statusChange', 'disconnected');
      this.emit('close', event.code, event.reason);

      if (!this.isManuallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        setTimeout(() => this.connect(), this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1)); // Exponential backoff
      } else if (!this.isManuallyClosed) {
        this.emit('statusChange', 'error');
        this.emit('error', new Error('Max reconnect attempts reached'));
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error', error);
      this.emit('statusChange', 'error');
      this.emit('error', error);
      this.ws?.close(); // Ensure the socket is closed on error
    };
  }

  public send(message: string): void {
    this.messageQueue.push(message);
    this.processQueue();
  }

  private processQueue(): void {
    if (this.isSending || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    if (this.messageQueue.length > 0) {
      this.isSending = true;
      const message = this.messageQueue.shift();
      if (message) {
        this.ws.send(message);
        // In a real scenario, you might wait for an acknowledgment before setting isSending to false
        // For now, we'll assume immediate sending and process the next message after a short delay
        setTimeout(() => {
          this.isSending = false;
          this.processQueue();
        }, 50); // Small delay to prevent overwhelming the server
      }
    }
  }

  public close(): void {
    this.isManuallyClosed = true;
    if (this.ws) {
      this.ws.close();
    }
  }

  public getStatus(): WebSocketConnectionStatus {
    if (!this.ws) return 'disconnected';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'disconnected'; // Or 'closing' if you want more granularity
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'disconnected';
    }
  }
}
