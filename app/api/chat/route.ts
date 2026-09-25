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

  const result = streamText({
    model: lmstudio(LM_STUDIO_MODEL),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({
    onError: toErrorMessage,
  });
}

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
