'use strict';

const ALLOWED_AGES = new Set(['2-4', '4-6', '7-9', '10-12', '13-16']);
const DEFAULT_BASE_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1';
const DEFAULT_MODEL = 'qwen-plus';
const MAX_PROMPT_CHARS = 180;
const MAX_RESPONSE_CHARS = 1100;
const MAX_OUTPUT_TOKENS = 320;
const REQUEST_TIMEOUT_MS = 12000;
const PROCESS_DAILY_CAP = Math.max(1, Number(process.env.QWEN_DAILY_TURN_CAP || 20));

let usageDay = '';
let processDailyTurns = 0;

function json(status, body) {
  return {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff'
    },
    body: JSON.stringify(body)
  };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function refreshUsageDay() {
  const day = todayKey();
  if (day !== usageDay) {
    usageDay = day;
    processDailyTurns = 0;
  }
}

function cleanText(value, max = MAX_PROMPT_CHARS) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function configuration() {
  const apiKey = String(process.env.QWEN_API_KEY || '').trim();
  const baseUrl = String(process.env.QWEN_BASE_URL || DEFAULT_BASE_URL).trim().replace(/\/+$/, '');
  const model = String(process.env.QWEN_MODEL || DEFAULT_MODEL).trim();
  return {
    configured: Boolean(apiKey && baseUrl && model),
    apiKey,
    baseUrl,
    model
  };
}

function looksUnsafeForChild(prompt) {
  const text = prompt.toLowerCase();
  const blocked = [
    /how\s+(do|can)\s+i\s+(kill|hurt|stab|shoot|poison)/,
    /how\s+to\s+(make|build)\s+(a\s+)?(bomb|gun|weapon)/,
    /how\s+to\s+(hurt|kill)\s+(myself|yourself|someone)/,
    /explicit\s+sex/,
    /porn(ography)?/,
    /how\s+to\s+(buy|make|take)\s+(cocaine|heroin|meth)/
  ];
  return blocked.some(pattern => pattern.test(text));
}

function ageGuidance(ageBand) {
  const map = {
    '2-4': 'Use very short, warm, concrete sentences. Encourage a grown-up to join in. Prefer songs, counting, colours, movement, naming and simple choices.',
    '4-6': 'Use short child-friendly sentences, playful examples and one small activity or question at a time.',
    '7-9': 'Use clear explanations, curiosity, simple evidence checks and practical mini-missions.',
    '10-12': 'Use fuller explanations, investigation, comparison, reasoning and age-appropriate challenge.',
    '13-16': 'Use mature but age-appropriate explanations, critical thinking, evidence, uncertainty and deeper reasoning.'
  };
  return map[ageBand] || map['7-9'];
}

function systemPrompt(ageBand) {
  return [
    'You are Orish, the interactive learning guide inside Orish’s World @ THE CODE.',
    'This is a child education product, not a general unrestricted chatbot.',
    `Age band: ${ageBand}. ${ageGuidance(ageBand)}`,
    'Be encouraging without being babyish. Do not claim to be human.',
    'Prefer active learning: a tiny mission, question, experiment, story choice, clue, reading prompt, maths challenge, creative task or real-world activity where appropriate.',
    'Do not ask for or repeat a child’s full name, exact date of birth, school, address, phone number, precise location, diagnosis, private family information, passwords, secrets or contact details.',
    'Never encourage secrecy from parents or trusted adults. Do not facilitate sexual content, self-harm, violence, illegal drugs, weapons, dangerous challenges or evasion of adult safety controls.',
    'For health, legal, financial or emergency matters, keep information general and direct the child to a trusted grown-up where appropriate.',
    'If you are uncertain about a factual claim, say so. Do not invent sources or citations.',
    'Keep the answer concise and conversational. Maximum about 140 words unless the child explicitly asks for a longer story.'
  ].join('\n');
}

async function callQwen({ prompt, ageBand, config }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt(ageBand) },
          { role: 'user', content: prompt }
        ],
        temperature: 0.55,
        max_tokens: MAX_OUTPUT_TOKENS,
        stream: false
      })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = cleanText(data?.error?.message || data?.message || `Qwen returned ${response.status}`, 240);
      const error = new Error(message || 'Qwen request failed.');
      error.status = response.status;
      throw error;
    }

    const content = data?.choices?.[0]?.message?.content;
    const text = cleanText(Array.isArray(content)
      ? content.map(part => typeof part === 'string' ? part : part?.text || '').join(' ')
      : content, MAX_RESPONSE_CHARS);
    if (!text) throw new Error('Qwen returned an empty answer.');
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async function (context, req) {
  refreshUsageDay();
  const config = configuration();

  if (String(req.method || '').toUpperCase() === 'GET') {
    return json(200, {
      ok: true,
      configured: config.configured,
      provider: config.configured ? 'qwen-model-studio' : 'local-fallback',
      model: config.configured ? config.model : null,
      processDailyCap: PROCESS_DAILY_CAP,
      processDailyUsed: processDailyTurns,
      processDailyRemaining: Math.max(0, PROCESS_DAILY_CAP - processDailyTurns),
      billingGuard: 'Enable Alibaba Model Studio Free Quota Only in the provider account. The app also falls back locally.'
    });
  }

  if (!config.configured) {
    return json(503, { ok: false, code: 'not_configured', fallback: 'local', error: 'Live Orish AI is not configured yet.' });
  }

  if (processDailyTurns >= PROCESS_DAILY_CAP) {
    return json(429, { ok: false, code: 'daily_cap', fallback: 'local', error: 'Today’s live AI test allowance has been reached.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const ageBand = cleanText(body.ageBand, 8);
  const prompt = cleanText(body.prompt, MAX_PROMPT_CHARS);

  if (!ALLOWED_AGES.has(ageBand)) {
    return json(403, { ok: false, code: 'age_blocked', fallback: 'local', error: 'Live free-text AI is not available for this age mode.' });
  }
  if (!prompt) {
    return json(400, { ok: false, code: 'empty_prompt', fallback: 'local', error: 'Ask Orish a short question first.' });
  }
  if (looksUnsafeForChild(prompt)) {
    return json(400, {
      ok: false,
      code: 'safety_redirect',
      fallback: 'local',
      safeReply: 'I can’t help with instructions that could hurt someone. We can turn this into a safe science, feelings, evidence or problem-solving question instead.'
    });
  }

  try {
    const answer = await callQwen({ prompt, ageBand, config });
    processDailyTurns += 1;
    return json(200, {
      ok: true,
      answer,
      provider: 'qwen-model-studio',
      model: config.model,
      retention: 'none-by-app',
      processDailyRemaining: Math.max(0, PROCESS_DAILY_CAP - processDailyTurns)
    });
  } catch (error) {
    context.log.warn('Orish live AI request failed without logging child prompt:', error?.message || 'unknown error');
    const upstreamStatus = Number(error?.status || 0);
    const quotaLikely = upstreamStatus === 429 || upstreamStatus === 402;
    return json(quotaLikely ? 429 : 502, {
      ok: false,
      code: quotaLikely ? 'provider_quota' : 'provider_unavailable',
      fallback: 'local',
      error: quotaLikely ? 'The free Qwen allowance is unavailable or exhausted.' : 'Live Orish AI is temporarily unavailable.'
    });
  }
};
