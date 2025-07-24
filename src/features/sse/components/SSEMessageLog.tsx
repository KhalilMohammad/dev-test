"use client";

import { useTranslation } from "react-i18next";
import { useSSEConnection } from "../hooks/useSSEConnection";

export function SSEMessageLog() {
  const { t } = useTranslation("sse");
  const { messages } = useSSEConnection("HomeClient");

  return (
    <div className="mt-6 rounded-lg bg-white/10 p-4">
      <h3 className="mb-2 text-lg font-semibold text-purple-200">
        {t("eventLog")}
      </h3>
      <div className="max-h-48 space-y-1 overflow-y-auto text-sm text-gray-200">
        {messages.length ? (
          messages.map((msg, i) => (
            <div
              key={i}
              className="rounded bg-white/5 px-2 py-1 font-mono text-xs text-gray-100"
            >
              {msg.timestamp} [{t(`eventTypes.${msg.type}`, msg.type)}]:{" "}
              {msg.data}
            </div>
          ))
        ) : (
          <p className="text-gray-400">{t("noEvents")}</p>
        )}
      </div>
    </div>
  );
}
