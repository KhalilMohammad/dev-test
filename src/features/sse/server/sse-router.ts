import { publicProcedure, createTRPCRouter } from "@/lib/trpc";
import { sendSSEToClient, broadcastSSE, getActiveClients } from "@/features/sse";
import { SendEventModel, ActiveClientsModel } from "../models/SSEModels";

export const sseRouter = createTRPCRouter({
  sendEvent: publicProcedure
    .input(SendEventModel)
    .mutation(({ input }) => {
      const { clientId, clientIds, event, data } = input;

      if (Array.isArray(clientIds)) {
        clientIds.forEach((id) => sendSSEToClient(id, event, data));
        return { ok: true, sent: clientIds };
      }

      if (clientId) {
        sendSSEToClient(clientId, event, data);
        return { ok: true, sent: [clientId] };
      }

      broadcastSSE(event, data);
      return { ok: true, broadcast: true };
    }),

  activeClients: publicProcedure.query(() => {
    return ActiveClientsModel.parse({ clients: getActiveClients() });
  }),
});
