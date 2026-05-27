import type { ServerRouter } from "@repo/trpc/client";
import { createTRPCProxyClient } from "@repo/trpc/client";
import { createTRPCHttpBatchClientClient } from "~/trpc/create-client";
import { headers } from "next/headers";

export const api = createTRPCProxyClient<ServerRouter>({
  links: [
    createTRPCHttpBatchClientClient({
      headers: async () => {
        const headersList = await headers();
        return Object.fromEntries(headersList.entries());
      },
    }),
  ],
});

export const apiStreaming = createTRPCProxyClient<ServerRouter>({
  links: [
    createTRPCHttpBatchClientClient({
      enableStreaming: true,
      headers: async () => {
        const headersList = await headers();
        return Object.fromEntries(headersList.entries());
      },
    }),
  ],
});
