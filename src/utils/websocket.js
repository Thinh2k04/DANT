import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.connected = false;
  }

  async connect() {
    if (this.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const socket = new SockJS('http://localhost:8080/ws');
        this.stompClient = Stomp.over(socket);
        
        this.stompClient.connect(
          {},
          () => {
            console.log('WebSocket Connected');
            this.connected = true;
            this.reconnectAttempts = 0;
            resolve();
          },
          (error) => {
            console.error('WebSocket Connection Error:', error);
            this.connected = false;
            this.handleConnectionError(reject);
          }
        );
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        this.connected = false;
        reject(error);
      }
    });
  }

  async subscribe(topic, callback) {
    try {
      if (!this.connected) {
        await this.connect();
      }

      if (!this.stompClient) {
        throw new Error('STOMP client not initialized');
      }

      if (!this.subscriptions.has(topic)) {
        const subscription = this.stompClient.subscribe(topic, (message) => {
          try {
            const data = JSON.parse(message.body);
            callback(data);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        });
        this.subscriptions.set(topic, subscription);
      }
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      throw error;
    }
  }

  unsubscribe(topic) {
    if (this.subscriptions.has(topic)) {
      try {
        const subscription = this.subscriptions.get(topic);
        subscription.unsubscribe();
        this.subscriptions.delete(topic);
      } catch (error) {
        console.error('Error unsubscribing:', error);
      }
    }
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      try {
        this.stompClient.disconnect();
        this.subscriptions.clear();
        this.connected = false;
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
  }

  handleConnectionError(reject) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect()
          .then(() => {
            this.resubscribeAll();
          })
          .catch(reject);
      }, this.reconnectDelay);
    } else {
      reject(new Error('Max reconnection attempts reached'));
    }
  }

  resubscribeAll() {
    const currentSubscriptions = new Map(this.subscriptions);
    this.subscriptions.clear();

    currentSubscriptions.forEach((callback, topic) => {
      this.subscribe(topic, callback);
    });
  }
}

export const webSocketService = new WebSocketService();
