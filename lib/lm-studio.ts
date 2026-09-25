import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const lmstudio = createOpenAICompatible({
  name: "lmstudio",
  baseURL: process.env.LM_STUDIO_BASE_URL ?? "http://localhost:1234/v1",
});

export const LM_STUDIO_MODEL =
  process.env.LM_STUDIO_MODEL ?? "qwen/qwen3-vl-4b";
