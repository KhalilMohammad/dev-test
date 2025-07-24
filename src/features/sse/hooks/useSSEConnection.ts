"use client";

import { useEffect, useState } from "react";
import { SSEMessageModel, type SSEMessage } from "../models/SSEModels";

export function useSSEConnection(clientId = "HomeClient") {
  const [messages, setMessages] = useState<SSEMessage[]>([]);

  useEffect(() => {
    const es = new EventSource(`/api/sse?id=${clientId}`);

    const addMessage = (type: string, data: string) => {
      const newMessage: SSEMessage = {
        type,
        data,
        timestamp: new Date().toLocaleTimeString(),
      };

      const validated = SSEMessageModel.safeParse(newMessage);
      if (validated.success) {
        setMessages((prev) => [validated.data, ...prev]);
      } else {
        console.warn("Invalid SSE message", validated.error.format());
      }
    };
    const handleEvent = (e: MessageEvent) => {
      addMessage(e.type || "message", String(e.data));
    };

    es.onmessage = handleEvent;

    ["connected", "ping", "announcement"].forEach((type) => {
      es.addEventListener(type, handleEvent as EventListener);
    });

    es.onerror = (err: Event) => {
      const time = new Date(
        typeof err.timeStamp === "number" ? err.timeStamp : Date.now(),
      ).toLocaleTimeString();

      switch (es.readyState) {
        case EventSource.CONNECTING:
          addMessage("error", `Reconnecting... (CONNECTING) at ${time}`);
          break;
        case EventSource.OPEN:
          addMessage("error", `Connection error (still OPEN) at ${time}`);
          break;
        case EventSource.CLOSED:
          addMessage("error", `Connection closed at ${time}`);
          break;
        default:
          addMessage("error", `Unknown connection state at ${time}`);
      }
    };

    return () => es.close();
  }, [clientId]);

  return { messages };
}
