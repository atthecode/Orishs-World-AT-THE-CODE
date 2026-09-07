# Orish Live AI — Qwen free-quota test path

This branch contains an optional hosted Qwen layer in front of the existing local Orish intelligence. The local learning engines remain the fallback and continue to work when the hosted model is unavailable.

## Safety/data boundary

The hosted request sends only:
- the active age band; and
- the current short Ask Orish question (maximum 180 characters).

It does not intentionally send the child nickname, exact date of birth, school, address, Learning Passport, Parent Studio private notes, location, diagnosis, raw voice, conversation history or account secrets.

Ages 0–2 remain blocked from hosted free-text AI. Existing Parent Studio free-text controls continue to apply.

## Qwen / Alibaba Model Studio

Use Alibaba Cloud Model Studio in the Singapore region with International deployment scope if using the new-user free quota. Enable **Free Quota Only** in Model Studio before testing so calls stop when the provider free quota is exhausted rather than moving to pay-as-you-go.

Server application settings:

- `QWEN_API_KEY` — required, server-side only
- `QWEN_BASE_URL` — optional; defaults to the Singapore international OpenAI-compatible endpoint `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`
- `QWEN_MODEL` — optional; defaults to `qwen-plus`
- `QWEN_DAILY_TURN_CAP` — optional; defaults to `20`

Never place `QWEN_API_KEY` in browser JavaScript, GitHub source, screenshots or child-visible configuration.

## App limits

- Maximum 5 hosted live-AI turns per browser session.
- Default gateway process cap: 20 successful hosted turns per UTC day.
- Maximum child prompt: 180 characters.
- Maximum model output: 320 tokens and 1,100 characters returned to the browser.
- 12 second provider timeout.
- No automatic retry that could multiply inference use.
- When the API is unconfigured, unavailable, rate-limited or out of provider quota, Ask Orish falls back to the existing local routing layer.

The process-level daily counter is a development guard, not a distributed billing guarantee because serverless instances can restart/scale. **Free Quota Only at the provider is the real no-paid-overage guard.**

## Azure Static Web Apps deployment

The API source is under `api/` and the HTTP route is `/api/orish-ai`.

The current Azure Static Web Apps workflow was originally configured with an empty `api_location`. To deploy the Functions API with the existing app, the workflow field must be:

```yaml
api_location: "api"
```

Do not alter or expose the existing Azure deployment token while making that one-line workflow change.

## Status check

Once deployed, a GET request to `/api/orish-ai` returns configuration and remaining development-cap status without exposing the Qwen key.

Before the key is added, it reports the gateway as unconfigured and the child app continues to use local Orish intelligence.
