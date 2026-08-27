# Orish’s World — WebMCP Challenge Extension

Competition work added during the August 2026 WebMCP Challenge window.

## Entry concept

**Orish’s World — Agent Mission Studio**

A parent and their AI agent work on the same live page to configure a safe, age-adapted learning mission. The agent does not replace the child-facing learning world. It helps the adult translate intent into a structured mission, then launches the existing playable Orish’s World experience.

## WebMCP implementation

Current implementation uses the WebMCP imperative API with `document.modelContext.registerTool(...)` and a legacy feature-detection fallback only for older experimental hosts.

The Agent Mission Studio registers six page-scoped tools:

1. `get_orish_world_capabilities`
   - Read-only discovery of demo age bands, topics, play styles, durations and routes.

2. `create_learning_mission`
   - Creates an age-adapted mission and visibly renders it on the page.

3. `adapt_learning_mission`
   - Changes age band, topic, duration, learning goal or play style while preserving shared live mission state.

4. `launch_learning_mission`
   - Opens the matched existing Orish’s World playable route.

5. `get_learning_summary`
   - Reads only local demo mission/Level 1 completion state from the current browser.

6. `suggest_real_world_followup`
   - Produces a short off-screen activity connected to the selected topic.

## Human-agent interaction

The same mission can be created either:

- manually through visible parent controls, or
- by ChatGPT through the WebMCP tools.

Both update the same visible mission preview and local demo state. An on-page activity log shows whether the last action came from the HUMAN, AGENT or SYSTEM.

Suggested judge prompt:

> Create a 15-minute space investigation for an 8-year-old about evidence, make it exciting, then launch it.

Follow-up prompt:

> Make it more puzzle-based and give me something we can do away from the screen afterwards.

## Child-safety boundary

This challenge extension intentionally uses a fictional `Demo Explorer` profile only.

It does **not** expose:

- real child names or profiles,
- child conversations/transcripts,
- private parent notes,
- unrestricted child chatbot access,
- location or social features.

The WebMCP agent configures a demo mission for the adult. Child-facing AI remains a separate controlled product layer.

## Files added for the challenge

- `agent-mission-studio.html`
- `agent-mission-studio.css`
- `agent-mission-studio.js`
- `WEBMCP-CHALLENGE.md`

`service-worker.js` is also updated so the Agent Mission Studio participates in the existing Orish’s World PWA shell.

## Existing app reused

The WebMCP extension launches existing Orish’s World routes such as:

- `level-one.html` — flagship Unknown Signal / Echo Planet adventure
- `fossil-detective.html`
- `signal-detective.html`
- `life-city.html`

This is intentionally an extension of the existing Azure-hosted product rather than a replacement app.

## Competition demo target

The live submission should point directly to:

`/agent-mission-studio.html`

For WebMCP testing, open that page in a supported ChatGPT built-in browser with site tools enabled. The page remains manually usable in ordinary browsers when a WebMCP host is not present.
