import {
  appendMediaToMessage,
  eventSource,
  event_types,
  generateQuietPrompt,
  saveSettingsDebounced,
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { getContext } from '../../../st-context.js';
import { saveBase64AsFile } from '../../../utils.js';
import { deleteMediaFromServer } from '../../../chats.js';
import { MEDIA_DISPLAY, MEDIA_TYPE, SCROLL_BEHAVIOR } from '../../../constants.js';

const EXTENSION_KEY = 'isoldeNai';
const DEFAULTS = { enabled: true, mode: 'smart', interval: 3, count: 2, contextMessages: 12 };

let roundCounter = 0;
let running = false;
let lastMessageKey = '';
let orb = null;
let popover = null;
let workbench = null;
let iframe = null;
let iframeLoaded = null;
let resolveIframeLoaded = null;
const pendingBridge = new Map();

function clampInt(value, min, max, fallback) {
  const number = Math.trunc(Number(value));
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function settings() {
  if (!extension_settings[EXTENSION_KEY] || typeof extension_settings[EXTENSION_KEY] !== 'object') {
    extension_settings[EXTENSION_KEY] = { ...DEFAULTS };
  }
  const value = extension_settings[EXTENSION_KEY];
  for (const [key, fallback] of Object.entries(DEFAULTS)) {
    if (value[key] === undefined) value[key] = fallback;
  }
  value.interval = clampInt(value.interval, 1, 999, DEFAULTS.interval);
  value.count = clampInt(value.count, 1, 12, DEFAULTS.count);
  value.contextMessages = clampInt(value.contextMessages, 4, 40, DEFAULTS.contextMessages);
  if (!['smart', 'fixed', 'manual'].includes(value.mode)) value.mode = DEFAULTS.mode;
  value.enabled = Boolean(value.enabled);
  return value;
}

function save() {
  saveSettingsDebounced();
  renderControls();
}

function setState(state, text) {
  if (orb) orb.dataset.state = state || 'idle';
  const status = popover && popover.querySelector('[data-isolde-status]');
  if (status) status.textContent = text || '待机';
}

function toast(message, type = 'info') {
  const toaster = globalThis.toastr;
  const api = toaster && (toaster[type] || toaster.info);
  if (api) api.call(toaster, message, 'Isolde.nai');
}

function renderControls() {
  if (!popover) return;
  const s = settings();
  const enabled = popover.querySelector('[data-isolde-enabled]');
  const mode = popover.querySelector('[data-isolde-mode]');
  const interval = popover.querySelector('[data-isolde-interval]');
  const count = popover.querySelector('[data-isolde-count]');
  if (enabled) enabled.checked = s.enabled;
  if (mode) mode.value = s.mode;
  if (interval) interval.value = String(s.interval);
  if (count) count.value = String(s.count);
  popover.querySelectorAll('[data-isolde-auto-field]').forEach((el) => {
    el.disabled = s.mode === 'manual';
  });
  const progress = popover.querySelector('[data-isolde-progress]');
  if (progress) {
    progress.textContent = s.mode === 'manual'
      ? '手动模式'
      : '下一次检查：' + Math.min(roundCounter + 1, s.interval) + ' / ' + s.interval + ' 轮';
  }
}

function createUi() {
  orb = document.createElement('button');
  orb.id = 'isolde-nai-orb';
  orb.type = 'button';
  orb.title = 'Isolde.nai';
  orb.setAttribute('aria-label', '打开 Isolde.nai');
  orb.dataset.state = 'idle';
  const orbImage = document.createElement('img');
  orbImage.className = 'isolde-orb-image';
  orbImage.alt = '';
  orbImage.setAttribute('aria-hidden', 'true');
  orbImage.src = new URL('./assets/isolde-orb.jpg', import.meta.url).href;
  orb.appendChild(orbImage);

  popover = document.createElement('section');
  popover.id = 'isolde-nai-popover';
  popover.setAttribute('aria-label', 'Isolde.nai 自动绘图');
  popover.innerHTML = [
    '<div class="isolde-head">',
      '<div><strong>Isolde.nai</strong><div class="isolde-status" data-isolde-status>待机</div></div>',
      '<span class="isolde-status" data-isolde-progress></span>',
    '</div>',
    '<div class="isolde-toggle"><span>自动检测生图点</span><input data-isolde-enabled type="checkbox" aria-label="自动检测生图点开关"></div>',
    '<div class="isolde-grid">',
      '<label>模式<select data-isolde-mode><option value="smart">智能判断</option><option value="fixed">固定触发</option><option value="manual">仅手动</option></select></label>',
      '<label>每次张数<input data-isolde-count type="number" inputmode="numeric" min="1" max="12" step="1"></label>',
      '<label style="grid-column:1 / -1">每隔多少轮<input data-isolde-interval data-isolde-auto-field type="number" inputmode="numeric" min="1" max="999" step="1"></label>',
    '</div>',
    '<div class="isolde-actions">',
      '<button class="isolde-btn primary" data-isolde-workbench type="button">打开 Isolde.nai</button>',
    '</div>',
  ].join('');

  workbench = document.createElement('section');
  workbench.id = 'isolde-nai-workbench';
  workbench.setAttribute('aria-label', 'Isolde.nai 完整工作台');
  workbench.innerHTML = [
    '<div class="isolde-workbench-bar">',
      '<strong>Isolde.nai · 酒馆版</strong>',
      '<button type="button" data-isolde-close-workbench>收起</button>',
    '</div>',
  ].join('');

  iframe = document.createElement('iframe');
  iframe.title = 'Isolde.nai 工作台';
  iframe.loading = 'eager';
  iframe.src = new URL('./index.html?embed=1', import.meta.url).href;
  workbench.appendChild(iframe);

  iframeLoaded = new Promise((resolve) => { resolveIframeLoaded = resolve; });
  iframe.addEventListener('load', () => {
    if (resolveIframeLoaded) resolveIframeLoaded();
  });

  document.body.append(orb, popover, workbench);

  orb.addEventListener('click', () => popover.classList.toggle('open'));

  const enabledControl = popover.querySelector('[data-isolde-enabled]');
  if (enabledControl) enabledControl.addEventListener('change', (event) => {
    settings().enabled = Boolean(event.target.checked);
    save();
  });

  const modeControl = popover.querySelector('[data-isolde-mode]');
  if (modeControl) modeControl.addEventListener('change', (event) => {
    settings().mode = event.target.value;
    roundCounter = 0;
    save();
  });

  const intervalControl = popover.querySelector('[data-isolde-interval]');
  if (intervalControl) intervalControl.addEventListener('change', (event) => {
    settings().interval = clampInt(event.target.value, 1, 999, DEFAULTS.interval);
    roundCounter = 0;
    save();
  });

  const countControl = popover.querySelector('[data-isolde-count]');
  if (countControl) countControl.addEventListener('change', (event) => {
    settings().count = clampInt(event.target.value, 1, 12, DEFAULTS.count);
    save();
  });

  const workbenchControl = popover.querySelector('[data-isolde-workbench]');
  if (workbenchControl) workbenchControl.addEventListener('click', () => {
    workbench.classList.add('open');
    popover.classList.remove('open');
  });

  const closeControl = workbench.querySelector('[data-isolde-close-workbench]');
  if (closeControl) closeControl.addEventListener('click', () => workbench.classList.remove('open'));

  document.addEventListener('pointerdown', (event) => {
    if (!popover.classList.contains('open')) return;
    if (popover.contains(event.target) || orb.contains(event.target)) return;
    popover.classList.remove('open');
  });

  renderControls();
}

function latestDrawableMessageId() {
  const context = getContext();
  const chat = (context && context.chat) || [];
  for (let i = chat.length - 1; i >= 0; i--) {
    const message = chat[i];
    if (message && !message.is_user && !message.is_system) return i;
  }
  return chat.length ? chat.length - 1 : -1;
}

function conversationFor(messageId) {
  const context = getContext();
  const chat = (context && context.chat) || [];
  const s = settings();
  const start = Math.max(0, Number(messageId) - s.contextMessages + 1);
  return chat.slice(start, Number(messageId) + 1)
    .filter((message) => message && !message.is_system)
    .map((message) => {
      const speaker = message.name || (message.is_user ? (context && context.name1) || 'User' : (context && context.name2) || 'Character');
      return speaker + ': ' + String(message.mes || '').trim();
    })
    .join('\n\n')
    .slice(-18000);
}

function latestParagraphs(messageId) {
  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  const raw = String((message && message.mes) || '').trim();
  const parts = raw.split(/\n\s*\n+/).map((part) => part.trim()).filter(Boolean);
  return parts.length ? parts : [raw || ''];
}

function substituteContextText(context, value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    return typeof context?.substituteParams === 'function' ? String(context.substituteParams(raw) || '').trim() : raw;
  } catch {
    return raw;
  }
}

function currentCharacterCards(messageId) {
  const context = getContext();
  if (!context) return '';
  const chat = Array.isArray(context.chat) ? context.chat : [];
  const characters = Array.isArray(context.characters) ? context.characters : [];
  const s = settings();
  const start = Math.max(0, Number(messageId) - s.contextMessages + 1);
  const wantedNames = new Set();

  for (const message of chat.slice(start, Number(messageId) + 1)) {
    if (!message || message.is_user || message.is_system) continue;
    const name = String(message.name || '').trim();
    if (name) wantedNames.add(name);
  }

  const currentId = context.characterId;
  if (currentId !== undefined && currentId !== null && currentId !== '') {
    const current = characters[Number(currentId)];
    const name = String((current && current.name) || '').trim();
    if (name) wantedNames.add(name);
  }
  if (!wantedNames.size && context.name2) wantedNames.add(String(context.name2).trim());

  const blocks = [];
  characters.forEach((character, index) => {
    if (!character || typeof character !== 'object') return;
    const name = String(character.name || '').trim();
    const isCurrent = currentId !== undefined && currentId !== null && currentId !== '' && String(index) === String(currentId);
    if (!isCurrent && (!name || !wantedNames.has(name))) return;

    const fields = [
      ['description', character.description],
      ['personality', character.personality],
      ['scenario', character.scenario],
    ].map(([label, value]) => {
      const text = substituteContextText(context, value);
      return text ? label + ': ' + text : '';
    }).filter(Boolean);

    if (fields.length) blocks.push('Character card — ' + (name || ('#' + index)) + '\n' + fields.join('\n'));
  });

  return blocks.join('\n\n').slice(0, 14000);
}

function currentPersona() {
  const context = getContext();
  if (!context || typeof context.substituteParams !== 'function') return '';
  try {
    return String(context.substituteParams('{{persona}}') || '').trim().slice(0, 6000);
  } catch {
    return '';
  }
}

function worldInfoScanText(messageId) {
  const context = getContext();
  const chat = (context && context.chat) || [];
  const s = settings();
  const start = Math.max(0, Number(messageId) - s.contextMessages + 1);
  return chat.slice(start, Number(messageId) + 1)
    .filter((message) => message && !message.is_system)
    .map((message) => {
      const speaker = message.name || (message.is_user ? context?.name1 || 'User' : context?.name2 || 'Character');
      return speaker + ': ' + String(message.mes || '').trim();
    })
    .filter(Boolean);
}

function collectWorldInfoChunks(result) {
  if (!result || typeof result !== 'object') return [];
  const chunks = [];
  const add = (value) => {
    if (typeof value === 'string' && value.trim()) chunks.push(value.trim());
  };
  add(result.worldInfoBefore);
  add(result.worldInfoAfter);
  add(result.worldInfoString);
  for (const item of Array.isArray(result.worldInfoDepth) ? result.worldInfoDepth : []) {
    for (const entry of Array.isArray(item && item.entries) ? item.entries : []) add(entry);
  }
  for (const entry of Array.isArray(result.anBefore) ? result.anBefore : []) add(entry);
  for (const entry of Array.isArray(result.anAfter) ? result.anAfter : []) add(entry);
  return [...new Set(chunks)];
}

async function currentWorldInfo(messageId) {
  const context = getContext();
  if (!context || typeof context.getWorldInfoPrompt !== 'function') return '';
  try {
    const result = await context.getWorldInfoPrompt(worldInfoScanText(messageId), 1000000000, true);
    return collectWorldInfoChunks(result)
      .map((chunk) => substituteContextText(context, chunk))
      .filter(Boolean)
      .join('\n\n')
      .slice(0, 14000);
  } catch (error) {
    console.warn('[Isolde.nai] world info unavailable', error);
    return '';
  }
}

function chatu8PresetSnapshot() {
  const context = getContext();
  const root = context && context.extensionSettings && context.extensionSettings['st-chatu8'];
  if (!root || typeof root !== 'object' || !root.yushe || typeof root.yushe !== 'object') {
    return { found: false, activeName: '', items: [] };
  }
  const activeName = typeof root.yusheid_novelai === 'string' ? root.yusheid_novelai.trim() : '';
  const items = [];
  for (const [name, value] of Object.entries(root.yushe)) {
    if (!String(name || '').trim() || !value || typeof value !== 'object') continue;
    items.push({
      name: String(name).trim(),
      artist: typeof value.fixedPrompt === 'string' ? value.fixedPrompt.trim() : '',
      positive: typeof value.fixedPrompt_end === 'string' ? value.fixedPrompt_end.trim() : '',
      negative: typeof value.negativePrompt === 'string' ? value.negativePrompt.trim() : '',
    });
  }
  return { found: true, activeName, items };
}

globalThis.IsoldeNaiHost = {
  ...(globalThis.IsoldeNaiHost && typeof globalThis.IsoldeNaiHost === 'object' ? globalThis.IsoldeNaiHost : {}),
  getChatu8Presets: chatu8PresetSnapshot,
};

function formatAnchorLibrary(anchorEntries) {
  const entries = Array.isArray(anchorEntries) ? anchorEntries : [];
  const lines = entries.map((item) => {
    const name = String((item && item.name) || '').trim();
    const prompt = String((item && item.prompt) || '').trim();
    return name && prompt ? '- ' + name + ': ' + prompt : '';
  }).filter(Boolean);
  return lines.length ? lines.join('\n').slice(0, 16000) : '(empty)';
}

function cleanSceneCharacters(value) {
  if (!Array.isArray(value)) return [];
  return value.map((character) => {
    if (!character || typeof character !== 'object') return null;
    return {
      name: String(character.name || '').trim(),
      anchor: String(character.anchor || '').trim(),
      prompt: String(character.prompt || character.appearance || '').trim(),
    };
  }).filter((character) => character && (character.anchor || character.prompt));
}

function directorPrompt(messageId, force, anchorEntries = [], sourceContext = {}) {
  const s = settings();
  const conversation = conversationFor(messageId);
  const paragraphs = latestParagraphs(messageId);
  const numbered = paragraphs.map((paragraph, index) => 'P' + (index + 1) + ': ' + paragraph).join('\n\n');
  const triggerRule = force
    ? 'This trigger is mandatory. generate must be true.'
    : 'Only set generate=true when this reply contains at least one visually distinct moment worth illustrating. Pure small talk or a reply with no meaningful visual change may be skipped.';
  const anchorLibrary = formatAnchorLibrary(anchorEntries);
  const charCard = String(sourceContext.charCard || '').trim() || '(unavailable)';
  const persona = String(sourceContext.persona || '').trim() || '(unavailable)';
  const worldInfo = String(sourceContext.worldInfo || '').trim() || '(none activated)';
  return [
    'You are the visual director for an ongoing roleplay. Read the latest reply as numbered paragraphs and choose where images belong inside that reply.',
    '',
    triggerRule,
    '',
    'When generate=true, return exactly ' + s.count + ' scene objects. If the reply contains several distinct visual moments, distribute the images across those moments. If fewer moments exist than the requested image count, use alternate shots of the strongest moments.',
    '',
    'Return JSON only with this exact structure:',
    '{"generate":true,"reason":"short reason","scenes":[{"prompt":"base NovelAI scene tags","after_paragraph":1,"characters":[{"name":"story character name","anchor":"exact library name or empty","prompt":"character-specific NovelAI tags"}]}]}',
    '',
    'Rules:',
    '- after_paragraph is 1-based and must point to the paragraph whose scene the image depicts.',
    '- Put a scene immediately after the paragraph where that visual moment occurs.',
    '- Write concise NovelAI-style comma-separated English visual tags.',
    '- prompt is the Base Prompt only: global character counts, environment, composition, camera, lighting, atmosphere, and shared relations.',
    '- Put every visible individual in characters[]. Each characters[].prompt contains that person\'s current clothing, expression, pose, action, props, and identity-specific visual traits.',
    '- Decide who is visibly present from all supplied sources and story continuity. A visible character does not need to exist in the fixed appearance library.',
    '- If a visible character matches the fixed appearance library, set anchor to that exact library name. Do not copy or rewrite the saved fixed appearance into characters[].prompt; the plugin injects the saved anchor itself.',
    '- For a visible character with no matching library entry, leave anchor empty and derive concise fixed appearance plus current clothing/action from the character card, persona, activated world info, and story context.',
    '- Do not save or invent a permanent library entry. Library-missing characters stay temporary for this image.',
    '- One-off or unnamed characters may be drawn from explicit story details without being added to the library.',
    '- Resolve names, nicknames, titles, pronouns, and indirect references from context instead of requiring literal name matches.',
    '- If two possible identities remain genuinely ambiguous, prefer the interpretation best supported by the immediate scene and earlier context; do not merge two characters into one.',
    '- Preserve explicit visual details from the conversation and avoid contradicting the fixed library.',
    '- If generate=false, scenes must be [].',
    '',
    'Fixed appearance library:',
    anchorLibrary,
    '',
    'Current character card:',
    charCard,
    '',
    'User persona:',
    persona,
    '',
    'Activated world info:',
    worldInfo,
    '',
    'Latest reply paragraphs:',
    numbered,
    '',
    'Earlier context for continuity:',
    conversation,
  ].join('\n');
}

function parseDirectorReply(raw, count, force, paragraphCount) {
  const tickFence = String.fromCharCode(96, 96, 96);
  let text = String(raw || '').trim();
  if (text.toLowerCase().startsWith(tickFence + 'json')) text = text.slice(7);
  else if (text.startsWith(tickFence)) text = text.slice(3);
  if (text.endsWith(tickFence)) text = text.slice(0, -3);
  text = text.trim();

  const match = text.match(/\{[\s\S]*\}/);
  let data;
  try {
    data = JSON.parse(match ? match[0] : text);
  } catch {
    if (!force) return { generate: false, reason: '导演判断无法解析', scenes: [] };
    data = { generate: true, reason: 'manual', scenes: [{ prompt: text, after_paragraph: paragraphCount }] };
  }

  const generate = force ? true : Boolean(data && data.generate);
  let scenes = Array.isArray(data && data.scenes) ? data.scenes : [];
  scenes = scenes.map((scene) => {
    if (typeof scene === 'string') {
      return { prompt: scene.trim(), afterParagraph: paragraphCount, characters: [] };
    }
    const prompt = String((scene && (scene.prompt || scene.scene)) || '').trim();
    const afterParagraph = clampInt(scene && (scene.after_paragraph ?? scene.afterParagraph), 1, Math.max(1, paragraphCount), paragraphCount);
    return { prompt, afterParagraph, characters: cleanSceneCharacters(scene && scene.characters) };
  }).filter((scene) => scene.prompt);

  if (generate && !scenes.length && data && typeof data.prompt === 'string') {
    scenes = [{ prompt: data.prompt.trim(), afterParagraph: paragraphCount, characters: cleanSceneCharacters(data.characters) }];
  }

  if (generate && scenes.length) {
    const base = scenes[scenes.length - 1];
    while (scenes.length < count) {
      scenes.push({
        prompt: base.prompt + ', alternate camera angle, different composition',
        afterParagraph: base.afterParagraph,
        characters: Array.isArray(base.characters) ? base.characters.map((character) => ({ ...character })) : [],
      });
    }
    scenes = scenes.slice(0, count);
  }

  return { generate: generate && scenes.length > 0, reason: String((data && data.reason) || ''), scenes };
}

async function planScenes(messageId, force) {
  setState('judging', force ? '正在整理这一幕…' : '正在判断这一幕…');
  let anchorEntries = [];
  try {
    const catalog = await bridgeRequest('getAnchors', {}, 60000);
    anchorEntries = Array.isArray(catalog && catalog.anchors) ? catalog.anchors : [];
  } catch (error) {
    console.warn('[Isolde.nai] character anchor catalog unavailable', error);
  }

  const [worldInfo] = await Promise.all([currentWorldInfo(messageId)]);
  const sourceContext = {
    charCard: currentCharacterCards(messageId),
    persona: currentPersona(),
    worldInfo,
  };
  const raw = await generateQuietPrompt({
    quietPrompt: directorPrompt(messageId, force, anchorEntries, sourceContext),
  });
  return parseDirectorReply(raw, settings().count, force, latestParagraphs(messageId).length);
}

function bridgeRequest(type, payload = {}, timeout = 600000) {
  return new Promise(async (resolve, reject) => {
    await iframeLoaded;
    const requestId = 'isolde-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    const timer = setTimeout(() => {
      pendingBridge.delete(requestId);
      reject(new Error('Isolde.nai 工作台响应超时'));
    }, timeout);

    pendingBridge.set(requestId, {
      resolve: (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      reject: (error) => {
        clearTimeout(timer);
        reject(error);
      },
    });

    if (!iframe.contentWindow) {
      pendingBridge.delete(requestId);
      clearTimeout(timer);
      reject(new Error('Isolde.nai 工作台没有加载'));
      return;
    }

    iframe.contentWindow.postMessage({
      source: 'isolde-nai-st',
      type,
      requestId,
      ...payload,
    }, window.location.origin);
  });
}

window.addEventListener('message', (event) => {
  if (!iframe || event.source !== iframe.contentWindow || event.origin !== window.location.origin) return;
  const data = event.data;
  if (!data || data.source !== 'isolde-nai-web' || !data.requestId) return;
  const pending = pendingBridge.get(data.requestId);
  if (!pending) return;
  pendingBridge.delete(data.requestId);
  if (data.ok === false) pending.reject(new Error(data.error || 'Isolde.nai 生成失败'));
  else pending.resolve(data);
});

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error('图片读取失败'));
    reader.onload = () => {
      const value = String(reader.result || '');
      resolve(value.includes(',') ? value.slice(value.indexOf(',') + 1) : value);
    };
    reader.readAsDataURL(blob);
  });
}

async function attachResults(results, messageId, scenePlans = []) {
  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  if (!message) throw new Error('找不到触发绘图的聊天消息');

  if (!message.extra || typeof message.extra !== 'object') message.extra = {};
  if (!Array.isArray(message.extra.media)) message.extra.media = [];
  message.extra.media_display = MEDIA_DISPLAY.LIST;
  message.extra.inline_image = true;

  const paragraphs = latestParagraphs(messageId);

  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    if (!result || !(result.blob instanceof Blob)) continue;

    const plan = scenePlans[index] || {};
    const afterParagraph = clampInt(plan.afterParagraph, 1, Math.max(1, paragraphs.length), paragraphs.length || 1);
    const anchorText = String(paragraphs[afterParagraph - 1] || '').replace(/\s+/g, ' ').trim().slice(0, 120);

    const base64 = await blobToBase64(result.blob);
    const fileName = 'isolde_' + Date.now() + '_' + (index + 1);
    const imagePath = await saveBase64AsFile(base64, 'Isolde.nai', fileName, 'png');

    message.extra.media.push({
      url: imagePath,
      title: result.scenePrompt || plan.prompt || result.prompt || 'Isolde.nai',
      type: MEDIA_TYPE.IMAGE,
      source: 'Isolde.nai',
      width: Number(result.width) || undefined,
      height: Number(result.height) || undefined,
      isolde_scene_prompt: result.scenePrompt || plan.prompt || '',
      isolde_prompt: result.prompt || '',
      isolde_negative: result.negative || '',
      isolde_seed: result.seed === undefined || result.seed === null ? '' : String(result.seed),
      isolde_gallery_id: result.galleryId === undefined || result.galleryId === null ? '' : String(result.galleryId),
      isolde_characters: cleanSceneCharacters(result.characters || plan.characters),
      isolde_after_paragraph: afterParagraph,
      isolde_anchor_text: anchorText,
    });
  }

  if (!message.extra.media.length) throw new Error('没有收到可插入聊天的图片');

  const jq = globalThis.jQuery || globalThis.$;
  const element = jq ? jq('#chat .mes[mesid="' + messageId + '"]') : null;
  if (element && element.length) {
    appendMediaToMessage(message, element, SCROLL_BEHAVIOR.KEEP);
    queueDecorate(messageId);
  }
  if (context.saveChat) await context.saveChat();
}


function queueDecorate(messageId) {
  requestAnimationFrame(() => {
    setTimeout(() => decorateMessageMedia(messageId), 120);
  });
}

function normalizeAnchorText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function findParagraphTarget(textRoot, media) {
  const blocks = Array.from(textRoot.children).filter((element) =>
    !element.classList.contains('isolde-inline-media-slot')
    && !element.classList.contains('isolde-pending-slot')
  );
  if (!blocks.length) return textRoot;

  const anchor = normalizeAnchorText(media.isolde_anchor_text);
  if (anchor) {
    const shortAnchor = anchor.slice(0, 72);
    const match = blocks.find((element) => normalizeAnchorText(element.textContent).includes(shortAnchor));
    if (match) return match;
  }

  const paragraph = clampInt(media.isolde_after_paragraph, 1, blocks.length, blocks.length);
  return blocks[Math.max(0, paragraph - 1)] || blocks[blocks.length - 1];
}


function pendingScenesFor(message) {
  return message && message.extra && Array.isArray(message.extra.isolde_pending_scenes)
    ? message.extra.isolde_pending_scenes
    : [];
}

async function addPendingScenes(messageId, scenes) {
  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  if (!message) throw new Error('找不到触发绘图的聊天消息');
  if (!message.extra || typeof message.extra !== 'object') message.extra = {};
  if (!Array.isArray(message.extra.isolde_pending_scenes)) message.extra.isolde_pending_scenes = [];

  const paragraphs = latestParagraphs(messageId);
  const stamp = Date.now();
  const added = [];

  scenes.forEach((scene, index) => {
    const afterParagraph = clampInt(scene.afterParagraph, 1, Math.max(1, paragraphs.length), paragraphs.length || 1);
    const anchorText = String(paragraphs[afterParagraph - 1] || '').replace(/\s+/g, ' ').trim().slice(0, 120);
    const pending = {
      id: 'isolde-pending-' + stamp + '-' + index + '-' + Math.random().toString(36).slice(2, 7),
      prompt: String(scene.prompt || '').trim(),
      characters: cleanSceneCharacters(scene.characters),
      afterParagraph,
      anchorText,
    };
    if (pending.prompt) {
      message.extra.isolde_pending_scenes.push(pending);
      added.push(pending);
    }
  });

  if (context.saveChat) await context.saveChat();
  queueDecorate(messageId);
  return added;
}

async function skipPendingScene(messageId, pendingId) {
  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  const pending = pendingScenesFor(message);
  const index = pending.findIndex((item) => item && item.id === pendingId);
  if (index < 0) return;

  pending.splice(index, 1);
  if (!pending.length && message && message.extra) delete message.extra.isolde_pending_scenes;
  if (context.saveChat) await context.saveChat();
  queueDecorate(messageId);
}

async function generatePendingScene(messageId, pendingId, ...buttons) {
  if (running) {
    toast('上一张还在生成。', 'warning');
    return;
  }

  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  const pending = pendingScenesFor(message);
  const item = pending.find((scene) => scene && scene.id === pendingId);
  if (!item) {
    toast('这个生图点已经处理过了。', 'warning');
    queueDecorate(messageId);
    return;
  }

  running = true;
  buttons.forEach((button) => { if (button) button.disabled = true; });
  setState('generating', '正在生成这一个生图点…');

  try {
    const response = await bridgeRequest('generate', {
      scenePlans: [{ prompt: item.prompt, characters: cleanSceneCharacters(item.characters) }],
    });
    const result = response && Array.isArray(response.results) ? response.results[0] : null;
    if (!result || !(result.blob instanceof Blob)) throw new Error('没有收到图片');

    await attachResults([result], messageId, [{
      prompt: item.prompt,
      characters: cleanSceneCharacters(item.characters),
      afterParagraph: item.afterParagraph,
    }]);

    const current = pendingScenesFor(message);
    const currentIndex = current.findIndex((scene) => scene && scene.id === pendingId);
    if (currentIndex >= 0) current.splice(currentIndex, 1);
    if (!current.length && message && message.extra) delete message.extra.isolde_pending_scenes;
    if (context.saveChat) await context.saveChat();
    queueDecorate(messageId);

    setState('success', '这一个生图点已生成');
    setTimeout(() => setState('idle', '待机'), 1800);
  } catch (error) {
    console.error('[Isolde.nai] pending scene generation failed', error);
    setState('error', (error && error.message) || '生成失败');
    toast((error && error.message) || '生成失败，这个生图点会保留。', 'error');
  } finally {
    running = false;
    buttons.forEach((button) => { if (button) button.disabled = false; });
  }
}

function createPendingPlaceholder(messageId, item) {
  const card = document.createElement('div');
  card.className = 'isolde-generation-placeholder';
  card.dataset.pendingId = item.id;
  card.title = item.prompt || 'Isolde.nai 生图点';

  const body = document.createElement('div');
  body.className = 'isolde-placeholder-body';

  const mark = document.createElement('span');
  mark.className = 'isolde-placeholder-mark';
  mark.textContent = '✦';

  const text = document.createElement('div');
  text.className = 'isolde-placeholder-text';
  text.innerHTML = '<strong>这里可以出图</strong><span>点生成才会请求 NAI</span>';

  const actions = document.createElement('div');
  actions.className = 'isolde-placeholder-actions';

  const generate = document.createElement('button');
  generate.type = 'button';
  generate.className = 'isolde-placeholder-generate';
  generate.textContent = '生成';

  const skip = document.createElement('button');
  skip.type = 'button';
  skip.textContent = '跳过';

  generate.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    void generatePendingScene(messageId, item.id, generate, skip);
  });

  skip.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    void skipPendingScene(messageId, item.id);
  });

  actions.append(generate, skip);
  body.append(mark, text);
  card.append(body, actions);
  return card;
}

function decoratePendingScenes(messageId, message, root, textRoot) {
  root.querySelectorAll('.isolde-pending-slot').forEach((slot) => slot.remove());
  const pending = pendingScenesFor(message);
  if (!pending.length) return;

  pending.forEach((item) => {
    if (!item || !item.prompt) return;
    const target = findParagraphTarget(textRoot, {
      isolde_after_paragraph: item.afterParagraph,
      isolde_anchor_text: item.anchorText,
    });
    const slot = document.createElement('div');
    slot.className = 'isolde-pending-slot';
    slot.dataset.pendingId = item.id;
    slot.appendChild(createPendingPlaceholder(messageId, item));
    if (target === textRoot) textRoot.appendChild(slot);
    else target.insertAdjacentElement('afterend', slot);
  });
}

function createMediaTools(messageId, mediaIndex, media) {
  const tools = document.createElement('div');
  tools.className = 'isolde-media-tools';

  const reroll = document.createElement('button');
  reroll.type = 'button';
  reroll.textContent = '重Roll';
  reroll.title = '保留画面词，换一个新 seed';

  const sameSeed = document.createElement('button');
  sameSeed.type = 'button';
  sameSeed.textContent = '同seed';
  sameSeed.title = '保留当前 seed 再生成一张';

  const download = document.createElement('button');
  download.type = 'button';
  download.textContent = '下载';
  download.title = '保存 PNG';

  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'isolde-delete';
  remove.textContent = '删除';
  remove.title = '从楼层、服务器和 Isolde.nai 图库删除这张图';

  reroll.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    void rerollMedia(messageId, mediaIndex, false, reroll, sameSeed, download, remove);
  });

  sameSeed.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    void rerollMedia(messageId, mediaIndex, true, reroll, sameSeed, download, remove);
  });

  download.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    void downloadIsoldeMedia(media, download);
  });

  remove.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    void deleteIsoldeMedia(messageId, mediaIndex, reroll, sameSeed, download, remove);
  });

  tools.append(reroll, sameSeed, download, remove);
  return tools;
}

function decorateMessageMedia(messageId) {
  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  if (!message || !message.extra) return;

  const root = document.querySelector('#chat .mes[mesid="' + messageId + '"]');
  const textRoot = root && root.querySelector('.mes_text');
  if (!root || !textRoot) return;

  decoratePendingScenes(messageId, message, root, textRoot);

  if (!Array.isArray(message.extra.media)) return;
  const mediaWrapper = root.querySelector('.mes_media_wrapper');
  if (!mediaWrapper) return;

  const fresh = Array.from(mediaWrapper.querySelectorAll('.mes_img_container[data-index]'))
    .filter((container) => {
      const index = Number(container.getAttribute('data-index'));
      const media = message.extra.media[index];
      return media && media.source === 'Isolde.nai';
    });

  if (!fresh.length) {
    root.querySelectorAll('.isolde-inline-image').forEach((container) => {
      if (!container.querySelector('.isolde-media-tools')) {
        const index = Number(container.getAttribute('data-index'));
        const media = message.extra.media[index];
        if (media && media.source === 'Isolde.nai') container.appendChild(createMediaTools(messageId, index, media));
      }
    });
    return;
  }

  root.querySelectorAll('.isolde-inline-media-slot').forEach((slot) => slot.remove());

  const slots = new Map();
  fresh.sort((a, b) => Number(a.getAttribute('data-index')) - Number(b.getAttribute('data-index')));

  for (const container of fresh) {
    const mediaIndex = Number(container.getAttribute('data-index'));
    const media = message.extra.media[mediaIndex];
    if (!media || media.source !== 'Isolde.nai') continue;

    const target = findParagraphTarget(textRoot, media);
    const paragraphKey = String(clampInt(media.isolde_after_paragraph, 1, 9999, 9999)) + ':' + normalizeAnchorText(media.isolde_anchor_text).slice(0, 72);

    let slot = slots.get(paragraphKey);
    if (!slot) {
      slot = document.createElement('div');
      slot.className = 'isolde-inline-media-slot';
      slot.dataset.paragraph = String(media.isolde_after_paragraph || '');
      if (target === textRoot) textRoot.appendChild(slot);
      else target.insertAdjacentElement('afterend', slot);
      slots.set(paragraphKey, slot);
    }

    container.classList.add('isolde-inline-image');
    const nativeControls = container.querySelector('.mes_img_controls');
    if (nativeControls) nativeControls.style.display = 'none';
    if (!container.querySelector('.isolde-media-tools')) {
      container.appendChild(createMediaTools(messageId, mediaIndex, media));
    }
    slot.appendChild(container);
  }
}

function decorateAllIsoldeMedia() {
  const context = getContext();
  const chat = (context && context.chat) || [];
  chat.forEach((message, index) => {
    const hasMedia = message && message.extra && Array.isArray(message.extra.media)
      && message.extra.media.some((media) => media && media.source === 'Isolde.nai');
    const hasPending = message && message.extra && Array.isArray(message.extra.isolde_pending_scenes)
      && message.extra.isolde_pending_scenes.length > 0;
    if (hasMedia || hasPending) queueDecorate(index);
  });
}

function isIOSLike() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function fallbackBlobDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

async function downloadIsoldeMedia(media, button) {
  if (!media || !media.url) return;
  if (button) button.disabled = true;
  try {
    const response = await fetch(media.url, { cache: 'no-store' });
    if (!response.ok) throw new Error('图片读取失败');
    const original = await response.blob();
    const blob = original.type === 'image/png' ? original : new Blob([original], { type: 'image/png' });
    const seed = String(media.isolde_seed || '').trim();
    const fileName = 'isolde-' + (seed || Date.now()) + '.png';

    if (isIOSLike() && navigator.share && typeof File !== 'undefined') {
      const file = new File([blob], fileName, { type: 'image/png' });
      const shareData = { files: [file] };
      try {
        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (error) {
        if (error && error.name === 'AbortError') return;
        console.warn('[Isolde.nai] iOS share failed, falling back to download', error);
      }
    }

    fallbackBlobDownload(blob, fileName);
  } catch (error) {
    console.error('[Isolde.nai] download failed', error);
    toast((error && error.message) || '下载失败', 'error');
  } finally {
    if (button) button.disabled = false;
  }
}

async function deleteIsoldeMedia(messageId, mediaIndex, ...buttons) {
  if (running) {
    toast('上一批图片还在生成。', 'warning');
    return;
  }

  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  const media = message && message.extra && Array.isArray(message.extra.media)
    ? message.extra.media[Number(mediaIndex)]
    : null;
  if (!media || media.source !== 'Isolde.nai') {
    toast('这张图已经不在这里了。', 'warning');
    return;
  }

  if (!globalThis.confirm('删除这张图？\n会同时从当前楼层、SillyTavern 图片文件和 Isolde.nai 图库移除。')) return;

  running = true;
  buttons.forEach((button) => { if (button) button.disabled = true; });
  setState('generating', '正在删除…');

  try {
    const oldUrl = media.url;
    const oldGalleryId = media.isolde_gallery_id || '';
    const oldSeed = media.isolde_seed || '';
    const oldScene = media.isolde_scene_prompt || media.title || '';

    message.extra.media.splice(Number(mediaIndex), 1);

    if (message.extra.media.length) {
      const current = Number(message.extra.media_index);
      if (!Number.isFinite(current) || current >= message.extra.media.length) {
        message.extra.media_index = Math.max(0, message.extra.media.length - 1);
      } else if (current > Number(mediaIndex)) {
        message.extra.media_index = current - 1;
      } else if (current === Number(mediaIndex)) {
        message.extra.media_index = Math.min(Number(mediaIndex), message.extra.media.length - 1);
      }
    } else {
      delete message.extra.media;
      delete message.extra.media_index;
      delete message.extra.media_display;
      delete message.extra.inline_image;
    }

    const jq = globalThis.jQuery || globalThis.$;
    const element = jq ? jq('#chat .mes[mesid="' + messageId + '"]') : null;
    if (element && element.length) {
      appendMediaToMessage(message, element, SCROLL_BEHAVIOR.KEEP);
      queueDecorate(messageId);
    }
    if (context.saveChat) await context.saveChat();

    if (oldUrl) {
      try { await deleteMediaFromServer(oldUrl, true); } catch {}
    }

    try {
      await bridgeRequest('deleteGallery', {
        galleryId: oldGalleryId,
        seed: oldSeed,
        scenePrompt: oldScene,
      }, 60000);
    } catch (error) {
      console.warn('[Isolde.nai] local gallery deletion failed', error);
      toast('楼层图片已删，但 Isolde.nai 本地图库删除失败。', 'warning');
    }

    setState('success', '图片已删除');
    setTimeout(() => setState('idle', '待机'), 1400);
  } catch (error) {
    console.error('[Isolde.nai] delete failed', error);
    setState('error', (error && error.message) || '删除失败');
    toast((error && error.message) || '删除失败', 'error');
  } finally {
    running = false;
    buttons.forEach((button) => { if (button) button.disabled = false; });
  }
}

async function rerollMedia(messageId, mediaIndex, keepSeed, ...buttons) {
  if (running) {
    toast('上一批图片还在生成。', 'warning');
    return;
  }

  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  const media = message && message.extra && Array.isArray(message.extra.media)
    ? message.extra.media[Number(mediaIndex)]
    : null;
  if (!media || media.source !== 'Isolde.nai') {
    toast('这张图没有 Isolde.nai 的重绘信息。', 'warning');
    return;
  }

  const scenePrompt = String(media.isolde_scene_prompt || media.title || '').trim();
  if (!scenePrompt) {
    toast('这张图没有保存画面词，没法重 Roll。', 'warning');
    return;
  }

  running = true;
  buttons.forEach((button) => { if (button) button.disabled = true; });
  setState('generating', keepSeed ? '正在同 seed 重绘…' : '正在重 Roll…');

  try {
    const seeds = keepSeed && media.isolde_seed ? [String(media.isolde_seed)] : [];
    const response = await bridgeRequest('generate', {
      scenePlans: [{
        prompt: scenePrompt,
        characters: cleanSceneCharacters(media.isolde_characters),
      }],
      seeds,
      promptOverrides: media.isolde_prompt ? [{
        positive: String(media.isolde_prompt || ''),
        negative: String(media.isolde_negative || ''),
      }] : [],
    });
    const result = response && Array.isArray(response.results) ? response.results[0] : null;
    if (!result || !(result.blob instanceof Blob)) throw new Error('重绘没有返回图片');

    const base64 = await blobToBase64(result.blob);
    const fileName = 'isolde_reroll_' + Date.now();
    const imagePath = await saveBase64AsFile(base64, 'Isolde.nai', fileName, 'png');

    const newMedia = {
      ...media,
      url: imagePath,
      title: result.scenePrompt || scenePrompt,
      width: Number(result.width) || media.width,
      height: Number(result.height) || media.height,
      isolde_scene_prompt: result.scenePrompt || scenePrompt,
      isolde_prompt: result.prompt || media.isolde_prompt || '',
      isolde_negative: result.negative || media.isolde_negative || '',
      isolde_seed: result.seed === undefined || result.seed === null ? '' : String(result.seed),
      isolde_gallery_id: result.galleryId === undefined || result.galleryId === null ? '' : String(result.galleryId),
      isolde_characters: cleanSceneCharacters(result.characters || media.isolde_characters),
    };
    message.extra.media.splice(Number(mediaIndex) + 1, 0, newMedia);
    message.extra.media_index = Number(mediaIndex) + 1;

    const jq = globalThis.jQuery || globalThis.$;
    const element = jq ? jq('#chat .mes[mesid="' + messageId + '"]') : null;
    if (element && element.length) {
      appendMediaToMessage(message, element, SCROLL_BEHAVIOR.KEEP);
      queueDecorate(messageId);
    }
    if (context.saveChat) await context.saveChat();

    setState('success', keepSeed ? '同 seed 新增 1 张' : '重 Roll 新增 1 张');
    setTimeout(() => setState('idle', '待机'), 1800);
  } catch (error) {
    console.error('[Isolde.nai] reroll failed', error);
    setState('error', (error && error.message) || '重绘失败');
    toast((error && error.message) || '重绘失败', 'error');
  } finally {
    running = false;
    buttons.forEach((button) => { if (button) button.disabled = false; });
  }
}

async function runIllustration(messageId, force = false) {
  if (running) {
    toast('上一批图片还在生成。', 'warning');
    return;
  }

  running = true;
  const drawButton = popover && popover.querySelector('[data-isolde-draw]');
  if (drawButton) drawButton.disabled = true;

  try {
    const plan = await planScenes(messageId, force);
    if (!plan.generate) {
      setState('idle', plan.reason ? '这轮跳过 · ' + plan.reason : '这轮不需要出图');
      return;
    }

    const pending = await addPendingScenes(messageId, plan.scenes);
    setState('success', '已标记 ' + pending.length + ' 个生图点');
    toast('找到 ' + pending.length + ' 个生图点，点框里的「生成」才会请求 NAI。');
    setTimeout(() => setState('idle', '待机'), 2200);
  } catch (error) {
    console.error('[Isolde.nai]', error);
    setState('error', (error && error.message) || '生成失败');
    toast((error && error.message) || '生成失败，请打开完整工作台检查设置。', 'error');
  } finally {
    running = false;
    if (drawButton) drawButton.disabled = false;
  }
}

async function onCharacterRendered(messageId, source) {
  queueDecorate(messageId);
  const s = settings();
  if (!s.enabled || s.mode === 'manual') return;
  if (source === 'extension') return;

  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  if (!message || message.is_user || message.is_system) return;

  const key = String(messageId) + ':' + String(message.mes || '');
  if (key === lastMessageKey) return;
  lastMessageKey = key;

  roundCounter += 1;
  renderControls();
  if (roundCounter < s.interval) return;

  roundCounter = 0;
  renderControls();
  await runIllustration(Number(messageId), s.mode === 'fixed');
}

function resetForChat() {
  roundCounter = 0;
  lastMessageKey = '';
  renderControls();
  setState('idle', '待机');
  setTimeout(decorateAllIsoldeMedia, 80);
}

const onReady = globalThis.jQuery || globalThis.$;
if (onReady) {
  onReady(() => {
    settings();
    createUi();
    eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, onCharacterRendered);
    eventSource.on(event_types.CHAT_CHANGED, resetForChat);
    if (event_types.MESSAGE_UPDATED) eventSource.on(event_types.MESSAGE_UPDATED, (messageId) => queueDecorate(messageId));
    if (event_types.MESSAGE_SWIPED) eventSource.on(event_types.MESSAGE_SWIPED, (messageId) => queueDecorate(messageId));
    setTimeout(decorateAllIsoldeMedia, 120);
  });
} else {
  console.error('[Isolde.nai] SillyTavern jQuery runtime was not found.');
}
