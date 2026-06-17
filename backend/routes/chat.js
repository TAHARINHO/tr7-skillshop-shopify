/**
 * TR7 Shop Builder — Route /api/chat
 * Proxy LLM streaming : Anthropic (Claude) + OpenAI (GPT)
 * Inspiré de l'architecture du projet ChatBot IA TR7
 */

const express = require('express');
const router = express.Router();
const https = require('https');

const ANTHROPIC_MODELS = ['claude-sonnet-4-6', 'claude-opus-4-8', 'claude-haiku-4-5-20251001', 'claude-3-5-sonnet-20241022'];
const OPENAI_MODELS    = ['gpt-4o', 'gpt-4o-mini', 'o3-mini'];

function isAnthropicModel(model) { return model.startsWith('claude'); }

// POST /api/chat — Streaming LLM (SSE)
router.post('/', async (req, res) => {
  const { messages = [], model = 'claude-sonnet-4-6', systemPrompt = '' } = req.body;

  // Use client key if provided, otherwise fallback to server env key
  const apiKey = req.body.apiKey
    || (isAnthropicModel(model) ? process.env.ANTHROPIC_API_KEY : process.env.OPENAI_API_KEY)
    || null;

  if (!apiKey) {
    return res.status(400).json({ error: 'apiKey requis — configurez ANTHROPIC_API_KEY dans .env ou envoyez apiKey dans le body' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const sendChunk = (text) => res.write(`data: ${JSON.stringify({ text })}\n\n`);
  const sendDone  = ()     => { res.write('data: [DONE]\n\n'); res.end(); };
  const sendError = (msg)  => { res.write(`data: ${JSON.stringify({ error: msg })}\n\n`); res.end(); };

  try {
    if (isAnthropicModel(model)) {
      await streamAnthropic({ model, messages, systemPrompt, apiKey }, sendChunk, sendDone, sendError);
    } else {
      await streamOpenAI({ model, messages, systemPrompt, apiKey }, sendChunk, sendDone, sendError);
    }
  } catch (err) {
    sendError(err.message);
  }
});

// ─── Anthropic Streaming ───
async function streamAnthropic({ model, messages, systemPrompt, apiKey }, sendChunk, sendDone, sendError) {
  const body = JSON.stringify({
    model,
    max_tokens: 4096,
    system: systemPrompt || 'Tu es NOE, un expert passionné du e-commerce et de Shopify. Tu parles de manière naturelle, décontractée et directe — comme un collègue expert avec qui on bosse tous les jours. Pas de formalisme excessif, pas de "je suis votre assistant IA". Tu donnes ton avis, tu proposes des idées, tu challenges quand c\'est nécessaire. Tu utilises le tutoiement. Tu es concis et orienté action.',
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    stream: true
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        let errData = '';
        res.on('data', d => errData += d);
        res.on('end', () => { sendError(`Anthropic ${res.statusCode}: ${errData}`); resolve(); });
        return;
      }

      let buffer = '';
      res.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
              sendChunk(evt.delta.text);
            }
            if (evt.type === 'message_stop') { sendDone(); resolve(); }
          } catch {}
        }
      });
      res.on('end', () => { sendDone(); resolve(); });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── OpenAI Streaming ───
async function streamOpenAI({ model, messages, systemPrompt, apiKey }, sendChunk, sendDone, sendError) {
  const body = JSON.stringify({
    model,
    messages: [
      { role: 'system', content: systemPrompt || 'Tu es NOE, un expert passionné du e-commerce et de Shopify. Tu parles de manière naturelle, décontractée et directe — comme un collègue expert avec qui on bosse tous les jours. Pas de formalisme excessif, pas de "je suis votre assistant IA". Tu donnes ton avis, tu proposes des idées, tu challenges quand c\'est nécessaire. Tu utilises le tutoiement. Tu es concis et orienté action.' },
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ],
    stream: true,
    max_tokens: 4096
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        let errData = '';
        res.on('data', d => errData += d);
        res.on('end', () => { sendError(`OpenAI ${res.statusCode}: ${errData}`); resolve(); });
        return;
      }

      let buffer = '';
      res.on('data', (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') { sendDone(); resolve(); return; }
          try {
            const evt = JSON.parse(raw);
            const text = evt.choices?.[0]?.delta?.content;
            if (text) sendChunk(text);
          } catch {}
        }
      });
      res.on('end', () => { sendDone(); resolve(); });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// GET /api/chat/models — Liste les modèles disponibles
router.get('/models', (req, res) => {
  res.json({
    anthropic: ANTHROPIC_MODELS.map(id => ({
      id, provider: 'anthropic',
      label: id === 'claude-sonnet-4-6' ? 'Claude Sonnet 4.6 (Recommandé)' :
             id === 'claude-opus-4-8'   ? 'Claude Opus 4.8 (Puissant)' :
             id === 'claude-haiku-4-5-20251001' ? 'Claude Haiku 4.5 (Rapide)' : id
    })),
    openai: OPENAI_MODELS.map(id => ({
      id, provider: 'openai',
      label: id === 'gpt-4o' ? 'GPT-4o (Recommandé)' :
             id === 'gpt-4o-mini' ? 'GPT-4o Mini (Rapide)' :
             id === 'o3-mini' ? 'o3-mini (Raisonnement)' : id
    }))
  });
});

module.exports = router;
