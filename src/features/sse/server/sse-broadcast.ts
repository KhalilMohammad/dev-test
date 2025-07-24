import { sseManager } from "@/features/sse";

export function sendSSEToClient(clientId: string, event: string, data: unknown) {
  sseManager.sendEvent(clientId, event, data);
}

export function broadcastSSE(event: string, data: unknown) {
  sseManager.broadcast(event, data);
}

export function getActiveClients() {
  return sseManager.getClientIds();
}
