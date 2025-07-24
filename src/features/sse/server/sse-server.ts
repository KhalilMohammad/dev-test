import type { NextRequest } from "next/server";
import { sseManager } from "@/features/sse";

export async function handleSSE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("id") ?? Math.random().toString(36).slice(2);

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  let closed = false;

  const write = (chunk: string) => {
    if (!closed) {
      void writer.write(new TextEncoder().encode(chunk));
    }
  };

  const close = () => {
    if (!closed) {
      closed = true;
      void writer.close();
    }
  };

  sseManager.addClient({ id: clientId, write, close, lastPing: Date.now() });

  write(`event: connected\ndata: {"id":"${clientId}"}\n\n`);

  req.signal?.addEventListener("abort", () => {
    console.log(`[SSE] Client disconnected: ${clientId}`);
    sseManager.removeClient(clientId);
    close();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
