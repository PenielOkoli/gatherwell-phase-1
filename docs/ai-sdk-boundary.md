# Where the AI platform meets the frontend framework

The provider answers “which AI service and model do we call?” Next.js and React answer “how does the person interact with the product?” The Vercel AI SDK connects these two concerns through a typed interface.

In Gatherwell, `@ai-sdk/openai` adapts the OpenAI API into a model object. The `ai` package's `generateText` function uses that object and returns a consistent text result. Our Route Handler translates that result into the app's own `Message` contract. The React component only needs to submit a question and display a message. It does not need the provider's URL, API key, or response format.

Changing providers means replacing the adapter/model configuration and checking provider-specific capabilities, errors, costs, and output quality. It does not require rebuilding our workshop form or saved-plan UI. The SDK reduces coupling; it does not make all providers identical or automatically secure the application. Input validation, authorization, secret handling, and usage limits still belong to our server.

The public UI requests curated demo answers in Phase 1. The actual SDK call exists in `src/lib/server/ai.ts`, with a bounded output, a 15-second timeout, and no automatic retries. A trusted server client can use it only when `AI_MODE=live`, a provider key exists, and a strong private access token is supplied. No access token or provider key is passed to the browser.

Later, the SDK's streaming utilities and React hooks can replace the one-response guide without moving provider credentials into Client Components. Phase 1 intentionally demonstrates the foundation before adding the Phase 2 streaming experience.

References: [AI SDK introduction](https://ai-sdk.dev/docs/introduction), [generateText reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/generate-text).
