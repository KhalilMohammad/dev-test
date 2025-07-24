type SSEClient = {
  id: string;
  write: (chunk: string) => void;
  close: () => void;
  lastPing: number;
};

class SSEManager {
  private clients = new Map<string, SSEClient>();

  addClient(client: SSEClient) {
    this.clients.set(client.id, client);
    console.log(`[SSE] Client connected: ${client.id}, total: ${this.clients.size}`);
  }

  removeClient(id: string) {
    const client = this.clients.get(id);
    if (client) {
      client.close();
      this.clients.delete(id);
      console.log(`[SSE] Client removed: ${id}, total: ${this.clients.size}`);
    }
  }

  sendEvent(id: string, event: string, data: unknown) {
    const client = this.clients.get(id);
    if (client) {
      client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    }
  }

  broadcast(event: string, data: unknown) {
    for (const client of this.clients.values()) {
      client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    }
  }

  heartbeat() {
    const now = Date.now();
    for (const [id, client] of this.clients.entries()) {
      if (now - client.lastPing > 60000) {
        console.warn(`[SSE] Client timed out: ${id}`);
        this.removeClient(id);
      } else {
        client.write(`event: ping\ndata: {}\n\n`);
      }
    }
  }

  getClientIds() {
    return Array.from(this.clients.keys());
  }

  getClientCount() {
    return this.clients.size;
  }
}

export const sseManager = new SSEManager();

setInterval(() => sseManager.heartbeat(), 20000);
