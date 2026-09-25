import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { lmstudio, LM_STUDIO_MODEL } from "@/lib/lm-studio";

export const maxDuration = 60;

export async function POST(req: Request) {
  let messages: UIMessage[];

  try {
    ({ messages } = await req.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = streamText({
    model: lmstudio(LM_STUDIO_MODEL),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onError: toErrorMessage,
  });
}

// Only catches errors surfaced before/during stream generation; a connection drop after the response has started streaming (e.g. a slow CPU inference request terminated mid-stream) bypasses this and reaches the browser as a generic network error.
function toErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("ECONNREFUSED") || message.includes("fetch failed")) {
    return "LM Studio server isn't running. Open LM Studio, go to Local Model API, and start the Local API server.";
  }

  if (message.includes("exited before becoming healthy")) {
    return "The model crashed while loading. Try switching the runtime (CPU vs Vulkan) in LM Studio's Runtime settings, then retry.";
  }

  return `LM Studio error: ${message}`;
}
