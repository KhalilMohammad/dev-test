"use client";

import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { sendSSEEvent } from "../utils/sendSSEEvent";

export function useSSETest() {
  const [msg, setMsg] = useState("");
  const [event, setEvent] = useState("announcement");
  const [data, setData] = useState('{"msg":"Hello!"}');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [singleClientId, setSingleClientId] = useState("");

  const { data: clientsData, refetch } = api.sse.activeClients.useQuery(
    undefined,
    { refetchInterval: 5000 },
  );

  const sendEventMutation = api.sse.sendEvent.useMutation();

  useEffect(() => {
    const es = new EventSource("/api/sse?id=HomeClient");

    es.addEventListener("connected", (e: MessageEvent<string>) =>
      setMsg(`connected: ${String(e.data)}`),
    );
    es.addEventListener("ping", (e: MessageEvent<string>) =>
      setMsg(`ping: ${e.data ? String(e.data) : "{}"}`),
    );
    es.addEventListener("announcement", (e: MessageEvent<string>) =>
      setMsg(`announcement: ${String(e.data)}`),
    );
    es.onmessage = (e: MessageEvent<string>) =>
      setMsg(`message: ${String(e.data)}`);
    es.onerror = () => setMsg("error");

    return () => es.close();
  }, []);

  const handleSend = async () => {
    await sendSSEEvent({
      event,
      data,
      selectedClients,
      singleClientId,
      sendEventMutation,
      refetch,
    });
  };

  return {
    msg,
    event,
    data,
    selectedClients,
    singleClientId,
    setEvent,
    setData,
    setSelectedClients,
    setSingleClientId,
    clientsData,
    handleSend,
  };
}
