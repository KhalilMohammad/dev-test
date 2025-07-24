import { z } from "zod";

export const SSEMessageModel = z.object({
  type: z.string(),
  data: z.string(),
  timestamp: z.string(),
});
export type SSEMessage = z.infer<typeof SSEMessageModel>;

export const SendEventModel = z.object({
  clientId: z.string().optional(),
  clientIds: z.array(z.string()).optional(),
  event: z.string(),
  data: z.record(z.unknown()),
});
export type SendEventModelType = z.infer<typeof SendEventModel>;

export const ActiveClientsModel = z.object({
  clients: z.array(z.string()),
});
export type ActiveClientsModelType = z.infer<typeof ActiveClientsModel>;
