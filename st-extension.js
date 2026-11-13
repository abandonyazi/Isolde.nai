import {
  appendMediaToMessage,
  eventSource,
  event_types,
  generateQuietPrompt,
  saveSettingsDebounced,
} from '../../../script.js';
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
  orb.innerHTML = '<span class="isolde-orb-star" aria-hidden="true">✦</span>';

  popover = document.createElement('section');
  popover.id = 'isolde-nai-popover';
  popover.setAttribute('aria-label', 'Isolde.nai 自动绘图');
  popover.innerHTML = [
    '<div class="isolde-head">',
      '<div><strong>Isolde.nai</strong><div class="isolde-status" data-isolde-status>待机</div></div>',
      '<span class="isolde-status" data-isolde-progress></span>',
    '</div>',
    '<div class="isolde-toggle"><span>自动绘图</span><input data-isolde-enabled type="checkbox" aria-label="自动绘图开关"></div>',
    '<div class="isolde-grid">',
      '<label>模式<select data-isolde-mode><option value="smart">智能判断</option><option value="fixed">固定触发</option><option value="manual">仅手动</option></select></label>',
      '<label>每次张数<input data-isolde-count type="number" inputmode="numeric" min="1" max="12" step="1"></label>',
      '<label style="grid-column:1 / -1">每隔多少轮<input data-isolde-interval data-isolde-auto-field type="number" inputmode="numeric" min="1" max="999" step="1"></label>',
    '</div>',
    '<div class="isolde-actions">',
      '<button class="isolde-btn primary" data-isolde-draw type="button">画这一幕</button>',
      '<button class="isolde-btn" data-isolde-workbench type="button">完整工作台</button>',
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

  const drawControl = popover.querySelector('[data-isolde-draw]');
  if (drawControl) drawControl.addEventListener('click', () => {
    const messageId = latestDrawableMessageId();
    if (messageId < 0) {
      toast('当前还没有可以画的剧情。', 'warning');
      return;
    }
    void runIllustration(messageId, true);
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

function directorPrompt(messageId, force) {
  const s = settings();
  const conversation = conversationFor(messageId);
  const triggerRule = force
    ? 'This trigger is mandatory. generate must be true.'
    : 'Only set generate=true when the current moment has a visually distinct scene worth illustrating. Pure small talk, repeated cuddling, or a scene with no meaningful visual change may be skipped.';
  return [
    'You are the visual director for an ongoing roleplay. Decide whether the latest moment should become a NovelAI illustration and, when drawing, write exactly ' + s.count + ' distinct English scene prompts.',
    '',
    triggerRule,
    '',
    'Return JSON only, with this exact structure:',
    '{"generate":true,"reason":"short reason","scenes":["prompt 1","prompt 2"]}',
    '',
    'Rules for scenes:',
    '- Exactly ' + s.count + ' scene strings when generate=true.',
    '- Each scene depicts the same current narrative moment but uses a meaningfully different shot, framing, pose emphasis, or composition.',
    '- Write concise NovelAI-style comma-separated English visual tags.',
    '- Focus on action, pose, expression, camera, environment, clothing that is explicitly present, lighting, atmosphere, and important props.',
    '- Do not invent fixed character appearance such as hair color, eye color, body type, species traits, or facial features. Isolde.nai character anchors handle appearance.',
    '- Preserve explicit visual details from the conversation.',
    '- Do not include explanations inside scene strings.',
    '- If generate=false, scenes must be [].',
    '',
    'Recent conversation:',
    conversation,
  ].join('\n');
}

function parseDirectorReply(raw, count, force) {
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
    data = { generate: true, reason: 'manual', scenes: [text] };
  }

  const generate = force ? true : Boolean(data && data.generate);
  let scenes = Array.isArray(data && data.scenes)
    ? data.scenes.map((value) => String(value || '').trim()).filter(Boolean)
    : [];

  if (generate && !scenes.length && data && typeof data.prompt === 'string') {
    scenes = [data.prompt.trim()];
  }

  if (generate && scenes.length) {
    const base = scenes[scenes.length - 1];
    while (scenes.length < count) scenes.push(base + ', alternate camera angle, different composition');
    scenes = scenes.slice(0, count);
  }

  return { generate: generate && scenes.length > 0, reason: String((data && data.reason) || ''), scenes };
}

async function planScenes(messageId, force) {
  setState('judging', force ? '正在整理这一幕…' : '正在判断这一幕…');
  const raw = await generateQuietPrompt({ quietPrompt: directorPrompt(messageId, force) });
  return parseDirectorReply(raw, settings().count, force);
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

async function attachResults(results, messageId) {
  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  if (!message) throw new Error('找不到触发绘图的聊天消息');

  if (!message.extra || typeof message.extra !== 'object') message.extra = {};
  if (!Array.isArray(message.extra.media)) message.extra.media = [];
  message.extra.media_display = MEDIA_DISPLAY.GALLERY;
  message.extra.inline_image = true;

  for (let index = 0; index < results.length; index++) {
    const result = results[index];
    if (!result || !(result.blob instanceof Blob)) continue;
    const base64 = await blobToBase64(result.blob);
    const fileName = 'isolde_' + Date.now() + '_' + (index + 1);
    const imagePath = await saveBase64AsFile(base64, 'Isolde.nai', fileName, 'png');
    message.extra.media.push({
      url: imagePath,
      title: result.scenePrompt || result.prompt || 'Isolde.nai',
      type: MEDIA_TYPE.IMAGE,
      source: 'Isolde.nai',
      width: Number(result.width) || undefined,
      height: Number(result.height) || undefined,
      isolde_scene_prompt: result.scenePrompt || '',
      isolde_prompt: result.prompt || '',
      isolde_negative: result.negative || '',
      isolde_seed: result.seed === undefined || result.seed === null ? '' : String(result.seed),
    });
  }

  if (!message.extra.media.length) throw new Error('没有收到可插入聊天的图片');
  message.extra.media_index = message.extra.media.length - 1;

  const jq = globalThis.jQuery || globalThis.$;
  const element = jq ? jq('#chat .mes[mesid="' + messageId + '"]') : null;
  if (element && element.length) {
    appendMediaToMessage(message, element, SCROLL_BEHAVIOR.KEEP);
    decorateMessageMedia(messageId);
  }
  if (context.saveChat) await context.saveChat();
}


function decorateMessageMedia(messageId) {
  const context = getContext();
  const message = context && context.chat && context.chat[Number(messageId)];
  if (!message || !message.extra || !Array.isArray(message.extra.media)) return;

  const root = document.querySelector('#chat .mes[mesid="' + messageId + '"]');
  if (!root) return;

  root.querySelectorAll('.mes_media_container[data-index]').forEach((container) => {
    const mediaIndex = Number(container.getAttribute('data-index'));
    const media = message.extra.media[mediaIndex];
    if (!media || media.source !== 'Isolde.nai') return;
    if (container.querySelector('.isolde-media-tools')) return;

    const tools = document.createElement('div');
    tools.className = 'isolde-media-tools';

    const reroll = document.createElement('button');
    reroll.type = 'button';
    reroll.textContent = '重Roll';
    reroll.title = '保留画面词，换一个新 seed';
    reroll.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      void rerollMedia(messageId, mediaIndex, false, reroll, sameSeed);
    });

    const sameSeed = document.createElement('button');
    sameSeed.type = 'button';
    sameSeed.textContent = '同seed';
    sameSeed.title = '保留当前 seed 重新生成';
    sameSeed.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      void rerollMedia(messageId, mediaIndex, true, reroll, sameSeed);
    });

    tools.append(reroll, sameSeed);
    container.appendChild(tools);
  });
}

function decorateAllIsoldeMedia() {
  const context = getContext();
  const chat = (context && context.chat) || [];
  chat.forEach((message, index) => {
    if (message && message.extra && Array.isArray(message.extra.media)
      && message.extra.media.some((media) => media && media.source === 'Isolde.nai')) {
      decorateMessageMedia(index);
    }
  });
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
      scenes: [scenePrompt],
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

    const oldUrl = media.url;
    message.extra.media[mediaIndex] = {
      ...media,
      url: imagePath,
      title: result.scenePrompt || scenePrompt,
      width: Number(result.width) || media.width,
      height: Number(result.height) || media.height,
      isolde_scene_prompt: result.scenePrompt || scenePrompt,
      isolde_prompt: result.prompt || media.isolde_prompt || '',
      isolde_negative: result.negative || media.isolde_negative || '',
      isolde_seed: result.seed === undefined || result.seed === null ? '' : String(result.seed),
    };

    const jq = globalThis.jQuery || globalThis.$;
    const element = jq ? jq('#chat .mes[mesid="' + messageId + '"]') : null;
    if (element && element.length) {
      appendMediaToMessage(message, element, SCROLL_BEHAVIOR.KEEP);
      decorateMessageMedia(messageId);
    }
    if (context.saveChat) await context.saveChat();

    if (oldUrl && oldUrl !== imagePath) {
      try { await deleteMediaFromServer(oldUrl, true); } catch {}
    }

    setState('success', keepSeed ? '同 seed 重绘完成' : '重 Roll 完成');
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

    setState('generating', '正在生成 ' + plan.scenes.length + ' 张…');
    const response = await bridgeRequest('generate', { scenes: plan.scenes });
    const results = response && Array.isArray(response.results) ? response.results : [];
    await attachResults(results, messageId);

    setState('success', '已生成 ' + results.length + ' 张');
    toast('这一幕生成了 ' + results.length + ' 张图。');
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
  setTimeout(() => decorateMessageMedia(messageId), 0);
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
    if (event_types.MESSAGE_UPDATED) eventSource.on(event_types.MESSAGE_UPDATED, (messageId) => setTimeout(() => decorateMessageMedia(messageId), 0));
    if (event_types.MESSAGE_SWIPED) eventSource.on(event_types.MESSAGE_SWIPED, (messageId) => setTimeout(() => decorateMessageMedia(messageId), 0));
    setTimeout(decorateAllIsoldeMedia, 120);
  });
} else {
  console.error('[Isolde.nai] SillyTavern jQuery runtime was not found.');
}
