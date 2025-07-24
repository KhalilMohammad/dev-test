import type { SendEventModelType } from "../models/SSEModels";

type SendSSEEventArgs = {
  event: SendEventModelType["event"];
  data: string;
  selectedClients: string[];
  singleClientId: string;
  sendEventMutation: {
    mutateAsync: (input: SendEventModelType) => Promise<unknown>;
  };
  refetch: () => Promise<unknown>;
};

export async function sendSSEEvent({
  event,
  data,
  selectedClients,
  singleClientId,
  sendEventMutation,
  refetch,
}: SendSSEEventArgs) {
  try {
    const parsedData = JSON.parse(data) as SendEventModelType["data"];

    await sendEventMutation.mutateAsync({
      clientId: singleClientId || undefined,
      clientIds:
        !singleClientId && selectedClients.length ? selectedClients : undefined,
      event,
      data: parsedData,
    });

    alert(
      `Event "${event}" sent to: ${
        singleClientId ||
        selectedClients.join(", ") ||
        "all clients (broadcast)"
      }`,
    );

    void refetch();
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Failed to send event: ${error.message}`);
    } else {
      alert("Failed to send event: Unknown error");
    }
  }
}
