"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { cookieName } from "@/config/i18n";
import { useSSETest } from "../hooks/useSSETest";

const setLanguageCookie = (value: string) => {
  document.cookie = `${cookieName}=${value}`;
};

export function SSETestView() {
  const { t, i18n } = useTranslation("sse");
  const router = useRouter();

  const {
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
  } = useSSETest();

  return (
    <div className="mx-auto mt-10 max-w-md rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur-sm">
      <Button
        variant="secondary"
        className="mb-4"
        onClick={async () => {
          const newLanguage = i18n.resolvedLanguage === "en" ? "de" : "en";
          await i18n.changeLanguage(newLanguage);
          setLanguageCookie(newLanguage);
          router.refresh();
        }}
      >
        Change language to {i18n.resolvedLanguage === "en" ? "de" : "en"}
      </Button>

      <h2 className="mb-4 text-center text-3xl font-bold text-white">
        {t("viewTitle")}
      </h2>
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold text-purple-200">
          {t("activeClients")}
        </h3>
        <div className="space-y-2 rounded-lg bg-white/10 p-3">
          {clientsData?.clients.length ? (
            clientsData.clients.map((id) => (
              <label
                key={id}
                className="flex items-center gap-2 text-sm text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedClients.includes(id)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedClients((prev) =>
                      e.target.checked
                        ? [...prev, id]
                        : prev.filter((c) => c !== id),
                    );
                    if (e.target.checked) setSingleClientId("");
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-purple-500 focus:ring-purple-400"
                />
                {id}
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-300">{t("noClients")}</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold text-purple-200">
          {t("sendEvent")}
        </h3>
        <div className="space-y-3 rounded-lg bg-white/10 p-3">
          <label className="block text-sm text-purple-100">
            {t("eventName")}:
            <input
              type="text"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              className="mt-1 w-full rounded-lg border border-purple-300 bg-white/10 p-2 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </label>
          <label className="block text-sm text-purple-100">
            {t("data")}:
            <input
              type="text"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1 w-full rounded-lg border border-purple-300 bg-white/10 p-2 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </label>
          <label className="block text-sm text-purple-100">
            {t("singleClient")}:
            <input
              type="text"
              value={singleClientId}
              placeholder={t("singleClientPlaceholder") || ""}
              onChange={(e) => {
                setSingleClientId(e.target.value);
                if (e.target.value) setSelectedClients([]);
              }}
              className="mt-1 w-full rounded-lg border border-purple-300 bg-white/10 p-2 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </label>
          <button
            onClick={handleSend}
            className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 font-semibold text-white shadow-md transition hover:from-purple-600 hover:to-indigo-600 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          >
            {t("button")}
          </button>
        </div>
      </div>
    </div>
  );
}
