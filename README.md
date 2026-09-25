# Vision Chat

A Next.js app for multi-turn, streaming chat about an uploaded image, powered by a local vision-language model (`qwen/qwen3-vl-4b`) served through [LM Studio](https://lmstudio.ai)'s OpenAI-compatible API.

## Setup

1. Open LM Studio, load `qwen/qwen3-vl-4b` (or another vision-capable GGUF model), and start the **Local API server** (Settings → Local Model API → toggle on). If the model crashes on load with a Vulkan runtime, switch to the **CPU llama.cpp** runtime under Settings → Runtime.
2. Copy `.env.local.example` to `.env.local` and adjust `LM_STUDIO_BASE_URL` / `LM_STUDIO_MODEL` if your setup differs from the defaults.
3. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000), upload an image, and start chatting.

## Notes

- Conversation history lives only in browser memory — refreshing the page starts a new conversation.
- No automated tests; this is a lesson/demo project.
