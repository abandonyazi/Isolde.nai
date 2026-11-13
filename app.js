const $ = (id) => document.getElementById(id);
const OFFICIAL_BASE = 'https://image.novelai.net';
const NAI_PROXY_BASE = 'https://isolde-nai-proxy.abandonyazi.workers.dev';
const SETTINGS_KEY = 'isolde_nai_settings_v2';
const TOKEN_KEY = 'isolde_nai_token_v1';
const THEME_KEY = 'isolde_nai_theme_v1';
const PRESETS_KEY = 'isolde_nai_presets_v1';
const ANCHORS_KEY = 'isolde_nai_anchors_v1';
const DB_NAME = 'isolde-nai-gallery';
const DB_VERSION = 3;

const els = {
  tabs: [...document.querySelectorAll('.tab')],
  views: [...document.querySelectorAll('.view')],
  miniStatus: $('miniStatus'), themeToggle: $('themeToggle'),
  connectionBanner: $('connectionBanner'), connectionText: $('connectionText'),
  presetSelect: $('presetSelect'), anchorPicker: $('anchorPicker'),
  scenePrompt: $('scenePrompt'), extraNegative: $('extraNegative'),
  qualityTags: $('qualityTags'), qualityPosition: $('qualityPosition'), protectTextBlock: $('protectTextBlock'),
  assembledPrompt: $('assembledPrompt'), assembledNegative: $('assembledNegative'),
  aspect: $('aspect'), model: $('model'), sampler: $('sampler'), width: $('width'), height: $('height'), steps: $('steps'), cfg: $('cfg'), seed: $('seed'),
  clearWorkbenchBtn: $('clearWorkbenchBtn'), randomSeedBtn: $('randomSeedBtn'), jumpAnchorsBtn: $('jumpAnchorsBtn'),
  generateBtn: $('generateBtn'), generateLabel: $('generateLabel'), generateSpinner: $('generateSpinner'),
  emptyResult: $('emptyResult'), resultWrap: $('resultWrap'), resultImage: $('resultImage'), saveLink: $('saveLink'), saveWatermarkedBtn: $('saveWatermarkedBtn'), regenBtn: $('regenBtn'), newSeedBtn: $('newSeedBtn'),
  presetList: $('presetList'), addPresetBtn: $('addPresetBtn'), inspectNaiBtn: $('inspectNaiBtn'), savePresetBtn: $('savePresetBtn'), presetDialog: $('presetDialog'), presetForm: $('presetForm'), presetDialogTitle: $('presetDialogTitle'), presetId: $('presetId'), presetName: $('presetName'), presetArtist: $('presetArtist'), presetPositive: $('presetPositive'), presetNegative: $('presetNegative'),
  naiInspectDialog: $('naiInspectDialog'), naiInspectFile: $('naiInspectFile'), chooseNaiInspectBtn: $('chooseNaiInspectBtn'), replaceNaiInspectBtn: $('replaceNaiInspectBtn'), naiInspectEmpty: $('naiInspectEmpty'), naiInspectResult: $('naiInspectResult'), naiInspectPreview: $('naiInspectPreview'), naiInspectFileName: $('naiInspectFileName'), naiInspectSource: $('naiInspectSource'), naiInspectPresetName: $('naiInspectPresetName'), naiInspectArtist: $('naiInspectArtist'), naiInspectPositive: $('naiInspectPositive'), naiInspectNegative: $('naiInspectNegative'), naiInspectParams: $('naiInspectParams'), addInspectedPresetBtn: $('addInspectedPresetBtn'),
  anchorList: $('anchorList'), addAnchorBtn: $('addAnchorBtn'), saveAnchorBtn: $('saveAnchorBtn'), anchorDialog: $('anchorDialog'), anchorForm: $('anchorForm'), anchorDialogTitle: $('anchorDialogTitle'), anchorId: $('anchorId'), anchorName: $('anchorName'), anchorPrompt: $('anchorPrompt'),
  galleryGrid: $('galleryGrid'), galleryCount: $('galleryCount'), clearGalleryBtn: $('clearGalleryBtn'),
  apiFormat: $('apiFormat'), endpoint: $('endpoint'), endpointHint: $('endpointHint'), apiKey: $('apiKey'), rememberKey: $('rememberKey'), toggleKeyBtn: $('toggleKeyBtn'), testBtn: $('testBtn'), saveSettingsBtn: $('saveSettingsBtn'), exportGalleryZipBtn: $('exportGalleryZipBtn'), exportConfigBtn: $('exportConfigBtn'), importConfigBtn: $('importConfigBtn'), importConfigFile: $('importConfigFile'), settingsStatus: $('settingsStatus'),
  watermarkFile: $('watermarkFile'), uploadWatermarkBtn: $('uploadWatermarkBtn'), removeWatermarkBtn: $('removeWatermarkBtn'), watermarkOpacity: $('watermarkOpacity'), watermarkOpacityValue: $('watermarkOpacityValue'), watermarkPreviewWrap: $('watermarkPreviewWrap'), watermarkPreview: $('watermarkPreview'), watermarkStatus: $('watermarkStatus'),
  referenceModelHint: $('referenceModelHint'), referenceEnabled: $('referenceEnabled'), referenceFile: $('referenceFile'), uploadReferenceBtn: $('uploadReferenceBtn'), removeReferenceBtn: $('removeReferenceBtn'), referencePreviewWrap: $('referencePreviewWrap'), referencePreview: $('referencePreview'), referenceStatus: $('referenceStatus'), referenceMode: $('referenceMode'), referenceStrength: $('referenceStrength'), referenceStrengthValue: $('referenceStrengthValue'), referenceFidelity: $('referenceFidelity'), referenceFidelityValue: $('referenceFidelityValue'),
  vibeEnabled: $('vibeEnabled'), vibeFile: $('vibeFile'), uploadVibeBtn: $('uploadVibeBtn'), removeVibeBtn: $('removeVibeBtn'), vibePreviewWrap: $('vibePreviewWrap'), vibePreview: $('vibePreview'), vibeStatus: $('vibeStatus'), vibePresetSelect: $('vibePresetSelect'), saveVibePresetBtn: $('saveVibePresetBtn'), deleteVibePresetBtn: $('deleteVibePresetBtn'), vibeStrength: $('vibeStrength'), vibeStrengthValue: $('vibeStrengthValue'), vibeInformation: $('vibeInformation'), vibeInformationValue: $('vibeInformationValue'),
  toast: $('toast')
};

let settings = {};
let presets = [];
let anchors = [];
let selectedAnchorIds = [];
let currentObjectUrl = null;
let currentResultBlob = null;
let currentSeed = '';
let busy = false;
let toastTimer = null;
let currentWatermarkAsset = null;
let watermarkPreviewUrl = null;
let currentReferenceAsset = null;
let currentVibeAsset = null;
let referencePreviewUrl = null;
let vibePreviewUrl = null;
let naiInspectPreviewUrl = null;
let currentNaiInspect = null;

function uid(prefix='id') {
  if (crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || '') || fallback; } catch { return fallback; }
}
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function loadSavedToken() {
  return String(localStorage.getItem(TOKEN_KEY) || '').trim();
}
function persistTokenIfRemembered() {
  const token = els.apiKey.value.trim();
  if (els.rememberKey.checked && token) localStorage.setItem(TOKEN_KEY, token);
}
function clearSavedToken() {
  localStorage.removeItem(TOKEN_KEY);
}
function rehydrateConnectionFields() {
  if (els.apiFormat.value === 'nai' && !els.endpoint.value.trim()) {
    els.endpoint.value = settings.endpoint || OFFICIAL_BASE;
  }
  if (els.rememberKey.checked && !els.apiKey.value.trim()) {
    const savedToken = loadSavedToken();
    if (savedToken) els.apiKey.value = savedToken;
  }
}
const themeMedia = window.matchMedia?.('(prefers-color-scheme: dark)');
function systemTheme() {
  return themeMedia?.matches ? 'dark' : 'light';
}
function readThemeOverride() {
  const raw = localStorage.getItem(THEME_KEY);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    if ((saved?.theme === 'dark' || saved?.theme === 'light') &&
        (saved?.systemAtOverride === 'dark' || saved?.systemAtOverride === 'light')) return saved;
  } catch {}
  localStorage.removeItem(THEME_KEY);
  return null;
}
function preferredTheme() {
  const system = systemTheme();
  const saved = readThemeOverride();
  if (!saved) return system;
  if (saved.systemAtOverride !== system) {
    localStorage.removeItem(THEME_KEY);
    return system;
  }
  return saved.theme;
}
function saveThemeOverride(theme) {
  localStorage.setItem(THEME_KEY, JSON.stringify({
    theme: theme === 'dark' ? 'dark' : 'light',
    systemAtOverride: systemTheme()
  }));
}
function applyTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  document.documentElement.style.colorScheme = next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#111a23' : '#f3f7fb');
  if (els.themeToggle) {
    els.themeToggle.textContent = next === 'dark' ? '☀︎' : '☾';
    els.themeToggle.setAttribute('aria-label', next === 'dark' ? '临时切换到日间模式' : '临时切换到夜间模式');
    els.themeToggle.title = '临时切换主题，系统下次切换后恢复跟随';
  }
}
function syncThemeWithSystem() {
  applyTheme(preferredTheme());
}
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2300);
}
function setConnectionState(kind, text) {
  els.connectionBanner.classList.remove('ready','error');
  els.miniStatus.classList.remove('ready','error');
  if (kind) { els.connectionBanner.classList.add(kind); els.miniStatus.classList.add(kind); }
  els.connectionText.textContent = text;
  els.miniStatus.textContent = kind === 'ready' ? '已连接' : kind === 'error' ? '异常' : '未连接';
}
function clampNumber(v,min,max,fallback) {
  const n = Number(v); return Number.isFinite(n) ? Math.max(min,Math.min(max,n)) : fallback;
}
function randomSeed() {
  const a = new Uint32Array(1);
  if (crypto?.getRandomValues) { crypto.getRandomValues(a); return String(a[0]); }
  return String(Math.floor(Math.random()*4294967296));
}
function normalizeBase(raw) {
  let url = (raw || '').trim().replace(/\/+$/, '');
  if (!url) url = OFFICIAL_BASE;
  if (!/^https?:\/\//i.test(url)) throw new Error('接口地址需要以 http:// 或 https:// 开头');
  return url.replace(/\/ai\/generate-image$/i,'');
}
function normalizedEndpoint(format, raw) {
  const base = normalizeBase(raw);
  if (format === 'nai') return base;
  if (/\/chat\/completions$/i.test(base)) return base;
  if (/\/v1$/i.test(base)) return `${base}/chat/completions`;
  return `${base}/v1/chat/completions`;
}
function isOfficialBase(base) {
  try { return normalizeBase(base) === OFFICIAL_BASE; } catch { return false; }
}
function naiFetchBase(raw) {
  const base = normalizeBase(raw);
  return isOfficialBase(base) ? NAI_PROXY_BASE : base;
}
function updateEndpointUi() {
  if (els.apiFormat.value === 'nai') {
    if (!els.endpoint.value.trim()) els.endpoint.value = OFFICIAL_BASE;
    els.endpointHint.textContent = 'NAI 官方当前基址。保持默认时会经 Isolde NAI 的 Cloudflare Worker 安全转发，Safari 不会被 CORS 卡住。';
  } else {
    els.endpointHint.textContent = '可填根地址、/v1，或完整 /v1/chat/completions。';
  }
}
function loadState() {
  settings = loadJson(SETTINGS_KEY, {});
  presets = loadJson(PRESETS_KEY, []);
  anchors = loadJson(ANCHORS_KEY, []);
  if (!presets.length) {
    presets = [{
      id: uid('preset'),
      name: '基础质量',
      positive: '',
      negative: '',
      createdAt: Date.now()
    }];
    saveJson(PRESETS_KEY, presets);
  }
  selectedAnchorIds = Array.isArray(settings.selectedAnchorIds) ? settings.selectedAnchorIds : [];
  els.apiFormat.value = settings.apiFormat || 'nai';
  els.endpoint.value = settings.endpoint || OFFICIAL_BASE;
  const legacyToken = settings.rememberKey === false ? '' : String(settings.apiKey || '').trim();
  const savedToken = loadSavedToken() || legacyToken;
  els.apiKey.value = savedToken;
  els.rememberKey.checked = settings.rememberKey !== false;
  if (!loadSavedToken() && legacyToken) localStorage.setItem(TOKEN_KEY, legacyToken);
  if (Object.prototype.hasOwnProperty.call(settings, 'apiKey')) {
    delete settings.apiKey;
    saveJson(SETTINGS_KEY, settings);
  }
  els.model.value = settings.model || 'nai-diffusion-5-full';
  els.sampler.value = settings.sampler || 'k_euler_ancestral';
  els.width.value = settings.width || 1024;
  els.height.value = settings.height || 1024;
  els.steps.value = settings.steps || 28;
  els.cfg.value = settings.cfg || 5;
  els.seed.value = '';
  els.qualityTags.value = settings.qualityTags || 'masterpiece, best quality, very aesthetic';
  els.qualityPosition.value = settings.qualityPosition || 'prefix';
  els.protectTextBlock.checked = settings.protectTextBlock !== false;
  els.scenePrompt.value = settings.scenePrompt || '';
  els.extraNegative.value = settings.extraNegative || '';
  els.watermarkOpacity.value = String(Number.isFinite(Number(settings.watermarkOpacity)) ? Math.max(0,Math.min(100,Number(settings.watermarkOpacity))) : 100);
  els.watermarkOpacityValue.textContent = `${els.watermarkOpacity.value}%`;
  els.referenceEnabled.checked = settings.referenceEnabled === true;
  els.referenceMode.value = ['character','style','character&style'].includes(settings.referenceMode) ? settings.referenceMode : 'character';
  els.referenceStrength.value = String(clampNumber(settings.referenceStrength,0,1,.75));
  els.referenceFidelity.value = String(clampNumber(settings.referenceFidelity,0,1,1));
  els.referenceStrengthValue.textContent = Number(els.referenceStrength.value).toFixed(2);
  els.referenceFidelityValue.textContent = Number(els.referenceFidelity.value).toFixed(2);
  els.vibeEnabled.checked = settings.vibeEnabled === true;
  els.vibeStrength.value = String(clampNumber(settings.vibeStrength,0,1,.6));
  els.vibeInformation.value = String(clampNumber(settings.vibeInformation,.05,1,.7));
  els.vibeStrengthValue.textContent = Number(els.vibeStrength.value).toFixed(2);
  els.vibeInformationValue.textContent = Number(els.vibeInformation.value).toFixed(2);
  els.aspect.value = aspectFor(Number(els.width.value), Number(els.height.value));
  updateEndpointUi();
  renderPresetSelect();
  renderPresetLibrary();
  renderAnchors();
  updateAssembly();
  if (els.apiKey.value) setConnectionState('ready', isOfficialBase(els.endpoint.value) ? 'NAI 官网 · Token 已保存' : '自定义接口 · Token 已保存');
  else setConnectionState('', 'NAI 官网 · 等待 Token');
}
function saveSettings() {
  const { apiKey: _legacyApiKey, ...safeSettings } = settings;
  settings = {
    ...safeSettings,
    apiFormat: els.apiFormat.value,
    endpoint: els.endpoint.value.trim() || OFFICIAL_BASE,
    rememberKey: els.rememberKey.checked,
    model: els.model.value, sampler: els.sampler.value,
    width: Number(els.width.value), height: Number(els.height.value),
    steps: Number(els.steps.value), cfg: Number(els.cfg.value),
    qualityTags: els.qualityTags.value.trim(),
    qualityPosition: els.qualityPosition.value,
    protectTextBlock: els.protectTextBlock.checked,
    scenePrompt: els.scenePrompt.value,
    extraNegative: els.extraNegative.value,
    watermarkOpacity: Number(els.watermarkOpacity.value),
    referenceEnabled: els.referenceEnabled.checked,
    referenceMode: els.referenceMode.value,
    referenceStrength: Number(els.referenceStrength.value),
    referenceFidelity: Number(els.referenceFidelity.value),
    vibeEnabled: els.vibeEnabled.checked,
    vibeStrength: Number(els.vibeStrength.value),
    vibeInformation: Number(els.vibeInformation.value),
    presetId: els.presetSelect.value,
    selectedAnchorIds
  };
  saveJson(SETTINGS_KEY, settings);
}
function aspectFor(w,h) {
  const value = `${w}x${h}`;
  return [...els.aspect.options].some(o=>o.value===value) ? value : 'custom';
}
function setAspect(value) {
if (value === 'custom') return;
  const [w,h] = value.split('x').map(Number);
  els.width.value = w; els.height.value = h;
  saveSettings();
}
function goView(name) {
  els.tabs.forEach(b => b.classList.toggle('active', b.dataset.view === name));
  els.views.forEach(v => v.classList.toggle('active', v.id === `view-${name}`));
  if (name === 'gallery') renderGallery();
  window.scrollTo({top:0,behavior:'smooth'});
}
function currentPreset() { return presets.find(p => p.id === els.presetSelect.value) || presets[0] || null; }
function selectedAnchors() { return anchors.filter(a => selectedAnchorIds.includes(a.id)); }
function cleanJoin(parts) {
  return parts.map(x=>(x||'').trim().replace(/^[,\s]+|[,\s]+$/g,'')).filter(Boolean).join(', ');
}
function characterPlaceholderNames(text) {
  const names = new Set();
  String(text || '').replace(/\[([^\[\]\r\n]{1,100})\]/g, (match, rawName) => {
    const name = rawName.trim();
if (anchors.some(a => a.name === name)) names.add(name);
    return match;
  });
  return names;
}
function expandCharacterPlaceholders(text) {
  return String(text || '').replace(/\[([^\[\]\r\n]{1,100})\]/g, (match, rawName) => {
    const name = rawName.trim();
    const anchor = anchors.find(a => a.name === name);
    const prompt = anchor?.prompt?.trim();
    return prompt || match;
  });
}
function applyQualityTags(prompt) {
  const mode = els.qualityPosition.value;
  const q = els.qualityTags.value.trim().replace(/[\s,]+$/,'');
  const p = prompt.trim();
  if (mode === 'off' || !q) return p;
  if (mode === 'prefix') return p ? `${q}, ${p}` : q;
  if (els.protectTextBlock.checked) {
    const match = p.match(/(^|\n)\s*(?:TEXT|text)\s*:/);
    if (match && match.index != null) {
      const idx = match.index + (match[1] ? match[1].length : 0);
      const head = p.slice(0,idx).trim().replace(/[\s,]+$/,'');
      const tail = p.slice(idx).trimStart();
      return `${head}${head ? ', ' : ''}${q}\n${tail}`;
    }
  }
  return p ? `${p.replace(/[\s,]+$/,'')}, ${q}` : q;
}
function assemblePrompts(includeSelectedAnchors = true) {
  const preset = currentPreset();
  const presetPrompt = cleanJoin([preset?.artist || '', preset?.positive || '']);
  const explicitPlaceholderNames = characterPlaceholderNames(cleanJoin([presetPrompt, els.scenePrompt.value]));
  const anchorText = includeSelectedAnchors
    ? selectedAnchors().filter(a=>!explicitPlaceholderNames.has(a.name)).map(a=>a.prompt)
    : [];
  const positive = expandCharacterPlaceholders(cleanJoin([presetPrompt, ...anchorText, els.scenePrompt.value]));
  const negative = cleanJoin([preset?.negative || '', els.extraNegative.value]);
  return { positive: applyQualityTags(positive), negative };
}
function updateAssembly() {
  const p = assemblePrompts();
  els.assembledPrompt.value = p.positive;
  els.assembledNegative.value = p.negative;
  saveSettings();
}
function renderPresetSelect() {
  const current = settings.presetId && presets.some(p=>p.id===settings.presetId) ? settings.presetId : (els.presetSelect.value || presets[0]?.id || '');
  els.presetSelect.innerHTML = '';
  for (const p of presets) {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.name; els.presetSelect.appendChild(o);
  }
  if (current) els.presetSelect.value = current;
}
function renderAnchorPicker() {
  els.anchorPicker.innerHTML = '';
  if (!anchors.length) {
    const note = document.createElement('div');
    note.className = 'empty-note'; note.textContent = '还没有角色锚点';
    els.anchorPicker.appendChild(note); return;
  }
  for (const a of anchors) {
    const b = document.createElement('button');
    b.type='button'; b.className='anchor-chip';
    b.textContent=a.name;
    b.classList.toggle('selected', selectedAnchorIds.includes(a.id));
    b.addEventListener('click',()=>{
      selectedAnchorIds = selectedAnchorIds.includes(a.id) ? selectedAnchorIds.filter(id=>id!==a.id) : [...selectedAnchorIds,a.id];
      renderAnchorPicker(); updateAssembly();
    });
    els.anchorPicker.appendChild(b);
  }
}
function makeButton(text, cls, fn) {
  const b = document.createElement('button');
  b.type='button'; b.textContent=text; b.className=cls; b.addEventListener('click',fn); return b;
}
function renderPresetLibrary() {
  els.presetList.innerHTML = '';
  for (const p of presets) {
    const card=document.createElement('article'); card.className='library-card';
    const title=document.createElement('div'); title.className='library-title';
    const h=document.createElement('h3'); h.textContent=p.name; title.appendChild(h);
    card.appendChild(title);
    const actions=document.createElement('div'); actions.className='card-actions preset-card-actions';
    actions.appendChild(makeButton('编辑','small-btn',()=>openPresetEditor(p)));
    actions.appendChild(makeButton('设为当前','small-btn',()=>{ els.presetSelect.value=p.id; settings.presetId=p.id; updateAssembly(); goView('workbench'); }));
    if (presets.length>1) actions.appendChild(makeButton('删除','small-btn danger',()=>deletePreset(p.id)));
    card.appendChild(actions); els.presetList.appendChild(card);
  }
}
function openPresetEditor(p=null) {
  els.presetDialogTitle.textContent = p ? '编辑预设' : '新增预设';
  els.presetId.value = p?.id || '';
  els.presetName.value = p?.name || '';
  els.presetArtist.value = p?.artist || '';
  els.presetPositive.value = p?.positive || '';
  els.presetNegative.value = p?.negative || '';
  els.presetDialog.showModal();
}
function deletePreset(id) {
  const p=presets.find(x=>x.id===id);
  if (!p || !confirm(`删除预设「${p.name}」？`)) return;
  presets=presets.filter(x=>x.id!==id); saveJson(PRESETS_KEY,presets);
  if (settings.presetId===id) settings.presetId=presets[0]?.id || '';
  renderPresetSelect(); renderPresetLibrary(); updateAssembly();
}
function renderAnchors() {
  els.anchorList.innerHTML='';
  for (const a of anchors) {
    const card=document.createElement('article'); card.className='library-card';
    const title=document.createElement('div'); title.className='library-title';
    const h=document.createElement('h3'); h.textContent=a.name; title.appendChild(h); card.appendChild(title);
    const actions=document.createElement('div'); actions.className='card-actions anchor-card-actions';
    actions.appendChild(makeButton('编辑','small-btn',()=>openAnchorEditor(a)));
    actions.appendChild(makeButton(selectedAnchorIds.includes(a.id)?'取消选中':'加入工作台','small-btn',()=>{
      selectedAnchorIds = selectedAnchorIds.includes(a.id) ? selectedAnchorIds.filter(id=>id!==a.id) : [...selectedAnchorIds,a.id];
      renderAnchors(); renderAnchorPicker(); updateAssembly();
    }));
    actions.appendChild(makeButton('删除','small-btn danger',()=>deleteAnchor(a.id)));
    card.appendChild(actions); els.anchorList.appendChild(card);
  }
  if (!anchors.length) {
    const note=document.createElement('div'); note.className='empty-note'; note.textContent='还没有角色。点右上角「新增角色」开始存锚点。'; els.anchorList.appendChild(note);
  }
  renderAnchorPicker();
}
function openAnchorEditor(a=null) {
  els.anchorDialogTitle.textContent=a?'编辑角色':'新增角色';
  els.anchorId.value=a?.id||''; els.anchorName.value=a?.name||''; els.anchorPrompt.value=a?.prompt||'';
  els.anchorDialog.showModal();
}
function deleteAnchor(id) {
  const a=anchors.find(x=>x.id===id);
  if (!a || !confirm(`删除角色「${a.name}」？`)) return;
  anchors=anchors.filter(x=>x.id!==id); selectedAnchorIds=selectedAnchorIds.filter(x=>x!==id);
  saveJson(ANCHORS_KEY,anchors); renderAnchors(); updateAssembly();
}
const NAI_PNG_SIGNATURE=[137,80,78,71,13,10,26,10];
const NAI_META_MAX=4*1024*1024;
function bytesEqualAt(bytes,values,offset=0){return values.every((value,index)=>bytes[offset+index]===value);}
function decodeUtf8OrLatin1(bytes){try{return new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{return new TextDecoder('iso-8859-1').decode(bytes);}}
async function inflateNaiMetadata(bytes){
  if(typeof DecompressionStream==='function'){
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
    const reader=stream.getReader(),chunks=[];let total=0;
    try{while(true){const part=await reader.read();if(part.done)break;total+=part.value.byteLength;if(total>NAI_META_MAX)throw new Error('压缩 metadata 过大');chunks.push(part.value);}}finally{reader.releaseLock();}
    const out=new Uint8Array(total);let offset=0;for(const chunk of chunks){out.set(chunk,offset);offset+=chunk.byteLength;}return out;
  }
  const mod=await import('https://cdn.jsdelivr.net/npm/fflate@0.8.2/+esm');
  const out=mod.unzlibSync(bytes);if(out.byteLength>NAI_META_MAX)throw new Error('压缩 metadata 过大');return out;
}
async function decodeNaiTextChunk(type,data){
  const zero=data.indexOf(0);if(zero<=0)return null;
  const keyword=new TextDecoder('iso-8859-1').decode(data.subarray(0,zero));
  if(type==='tEXt')return {keyword,text:decodeUtf8OrLatin1(data.subarray(zero+1))};
  if(type==='zTXt'){if(data[zero+1]!==0)return null;return {keyword,text:decodeUtf8OrLatin1(await inflateNaiMetadata(data.subarray(zero+2)))}}
  if(type==='iTXt'){
    if(zero+3>data.length)return null;const compressed=data[zero+1]===1;if(data[zero+2]!==0)return null;
    const languageEnd=data.indexOf(0,zero+3);if(languageEnd<0)return null;const translatedEnd=data.indexOf(0,languageEnd+1);if(translatedEnd<0)return null;
    let textBytes=data.subarray(translatedEnd+1);if(compressed)textBytes=await inflateNaiMetadata(textBytes);return {keyword,text:new TextDecoder('utf-8').decode(textBytes)};
  }
  return null;
}
async function readNaiPngText(file){
  if(file.size>40*1024*1024)throw new Error('图片太大，请控制在 40MB 以内');
  const buffer=await file.arrayBuffer(),bytes=new Uint8Array(buffer);
  if(bytes.length<33||!bytesEqualAt(bytes,NAI_PNG_SIGNATURE))throw new Error('请选择 NovelAI 原始 PNG 图片');
  const view=new DataView(buffer),width=view.getUint32(16,false),height=view.getUint32(20,false),entries=[];let offset=8,count=0,totalText=0;
  while(offset+12<=bytes.length&&count++<4096){
    const length=view.getUint32(offset,false),type=new TextDecoder('iso-8859-1').decode(bytes.subarray(offset+4,offset+8)),start=offset+8,end=start+length,next=end+4;
    if(end<start||next>bytes.length)break;
    if(['tEXt','zTXt','iTXt'].includes(type)){try{const entry=await decodeNaiTextChunk(type,bytes.subarray(start,end));if(entry){totalText+=entry.text.length;if(totalText<=NAI_META_MAX)entries.push(entry);}}catch{}}
    offset=next;if(type==='IEND')break;
  }
  return {entries,width,height};
}
function nestedNaiMetadata(value,source=''){
  if(!value)return null;
  if(typeof value==='object'&&!Array.isArray(value)){
    const comment=value.Comment??value.comment;
    if(comment&&typeof comment==='object')return {...comment,Source:comment.Source||comment.source||value.Source||value.source||source};
    if(typeof comment==='string'){const nested=nestedNaiMetadata(comment,value.Source||value.source||source);if(nested)return nested;}
    if(value.prompt||value.v4_prompt||value.steps||value.sampler||value.uc)return {...value,Source:value.Source||value.source||source};
    return null;
  }
  const text=String(value).trim();if(!text)return null;if(text.startsWith('{')){try{return nestedNaiMetadata(JSON.parse(text),source);}catch{}}return null;
}
function naiModelFromMeta(raw){
  const explicit=String(raw.model||'').trim();if(explicit)return explicit;const source=String(raw.Source||raw.source||'').toLowerCase();
  if(source.includes('v5')||source.includes('diffusion 5'))return 'nai-diffusion-5-full';
  if(source.includes('4.5')&&source.includes('curated'))return 'nai-diffusion-4-5-curated';
  if(source.includes('4.5'))return 'nai-diffusion-4-5-full';
  if(source.includes('v4')&&source.includes('curated'))return 'nai-diffusion-4-curated-preview';
  if(source.includes('v4')||source.includes('diffusion 4'))return 'nai-diffusion-4-full';
  if(source.includes('v3')||source.includes('diffusion 3'))return 'nai-diffusion-3';
  return raw.Source||raw.source||'';
}
function naiPromptText(raw,description=''){return String(raw.prompt||raw.v4_prompt?.caption?.base_caption||description||'').trim();}
function naiNegativeText(raw){return String(raw.uc||raw.negative_prompt||raw.v4_negative_prompt?.caption?.base_caption||'').trim();}
function splitPromptTokens(text){
  const out=[];let buf='',depth=0,quote='';
  for(const ch of String(text||'')){
    if(quote){buf+=ch;if(ch===quote)quote='';continue;}
    if(ch==='"'||ch==="'"){quote=ch;buf+=ch;continue;}
    if('([{'.includes(ch))depth++;else if(')]}'.includes(ch))depth=Math.max(0,depth-1);
    if(ch===','&&depth===0){if(buf.trim())out.push(buf.trim());buf='';}else buf+=ch;
  }
  if(buf.trim())out.push(buf.trim());return out;
}
function splitArtistPrompt(text){
  const artist=[],positive=[];
  for(const token of splitPromptTokens(text)){const isArtist=/\bartist\s*:/i.test(token);const isYear=/^(?:\s*[\d.]+\s*::\s*)?year\s+(?:19|20)\d{2}(?:\s*::\s*)?\s*$/i.test(token);(isArtist||isYear?artist:positive).push(token);}
  return {artist:artist.join(', '),positive:positive.join(', ')};
}
function boolLabel(value){return value===true?'开':value===false?'关':'';}
function normalizedInspectParams(raw,width,height){
  const vibeCount=Array.isArray(raw.reference_image_multiple)?raw.reference_image_multiple.length:0;
  const refCount=Array.isArray(raw.director_reference_images)?raw.director_reference_images.length:0;
  return {model:naiModelFromMeta(raw),width:Number(raw.width)||width||null,height:Number(raw.height)||height||null,seed:raw.seed??null,steps:raw.steps??null,cfg:raw.scale??raw.cfg_scale??null,sampler:raw.sampler??null,noiseSchedule:raw.noise_schedule??null,cfgRescale:raw.cfg_rescale??null,smea:raw.autoSmea??raw.smea??null,dynamicThresholding:raw.dynamic_thresholding??null,qualityToggle:raw.qualityToggle??null,ucPreset:raw.ucPreset??null,vibeCount,referenceCount:refCount,source:String(raw.Source||raw.source||'')};
}
function renderInspectParams(params){
  const entries=[['Model',params.model],['尺寸',params.width&&params.height?String(params.width)+' × '+String(params.height):''],['Seed',params.seed],['Steps',params.steps],['CFG',params.cfg],['Sampler',params.sampler],['Noise',params.noiseSchedule],['CFG Rescale',params.cfgRescale],['SMEA',boolLabel(params.smea)],['Dynamic',boolLabel(params.dynamicThresholding)],['Quality',boolLabel(params.qualityToggle)],['UC Preset',params.ucPreset],['Vibe',params.vibeCount?String(params.vibeCount)+' 个':''],['Reference',params.referenceCount?String(params.referenceCount)+' 个':'']].filter((pair)=>pair[1]!==null&&pair[1]!==undefined&&String(pair[1])!=='');
  els.naiInspectParams.innerHTML='';
  for(const pair of entries){const row=document.createElement('div');row.className='inspect-param';const key=document.createElement('span');key.textContent=pair[0];const val=document.createElement('strong');val.textContent=String(pair[1]);row.append(key,val);els.naiInspectParams.appendChild(row);}
}
async function inspectNaiImage(file){
  const data=await readNaiPngText(file),entries=data.entries,sourceEntry=entries.find((entry)=>entry.keyword.toLowerCase()==='source')?.text?.trim()||'',description=entries.find((entry)=>entry.keyword.toLowerCase()==='description')?.text?.trim()||'';
  let raw=null;
  for(const key of ['comment','description']){for(const candidate of entries.filter((entry)=>entry.keyword.toLowerCase()===key)){raw=nestedNaiMetadata(candidate.text,sourceEntry);if(raw)break;}if(raw)break;}
  if(!raw)throw new Error('没有检测到可解析的 NovelAI metadata');
  const prompt=naiPromptText(raw,description);if(!prompt&&!raw.steps&&!raw.sampler)throw new Error('这张 PNG 没有完整的 NovelAI 生成参数');
  const split=splitArtistPrompt(prompt);return {file,artist:split.artist,positive:split.positive,negative:naiNegativeText(raw),params:normalizedInspectParams(raw,data.width,data.height)};
}
function resetNaiInspector(){
  currentNaiInspect=null;if(naiInspectPreviewUrl){URL.revokeObjectURL(naiInspectPreviewUrl);naiInspectPreviewUrl=null;}els.naiInspectFile.value='';els.naiInspectPreview.removeAttribute('src');els.naiInspectEmpty.classList.remove('hidden');els.naiInspectResult.classList.add('hidden');els.naiInspectParams.innerHTML='';
}
async function handleNaiInspectFile(file){
  const result=await inspectNaiImage(file);currentNaiInspect=result;if(naiInspectPreviewUrl)URL.revokeObjectURL(naiInspectPreviewUrl);naiInspectPreviewUrl=URL.createObjectURL(file);els.naiInspectPreview.src=naiInspectPreviewUrl;els.naiInspectFileName.textContent=file.name||'NAI 图片';els.naiInspectSource.textContent=result.params.source||result.params.model||'NovelAI';els.naiInspectPresetName.value=(file.name||'NAI 预设').replace(/\.[^.]+$/,'');els.naiInspectArtist.value=result.artist;els.naiInspectPositive.value=result.positive;els.naiInspectNegative.value=result.negative;renderInspectParams(result.params);els.naiInspectEmpty.classList.add('hidden');els.naiInspectResult.classList.remove('hidden');
}
function addInspectedPreset(){
  if(!currentNaiInspect)return;const name=els.naiInspectPresetName.value.trim();if(!name){els.naiInspectPresetName.focus();return;}const id=uid('preset');
  const item={id,name,artist:els.naiInspectArtist.value.trim(),positive:els.naiInspectPositive.value.trim(),negative:els.naiInspectNegative.value.trim(),naiParams:{...currentNaiInspect.params},importedFrom:'nai-png',updatedAt:Date.now()};
  presets.unshift(item);saveJson(PRESETS_KEY,presets);settings.presetId=id;renderPresetSelect();els.presetSelect.value=id;renderPresetLibrary();updateAssembly();els.naiInspectDialog.close();showToast('预设「'+name+'」已加入');
}
function ucPresetNoneIndex(model) {
  if (model==='nai-diffusion-4-5-curated') return 3;
  if (model.startsWith('nai-diffusion-4')) return 2;
  return 4;
}
function buildNaiPayload(seed=null,promptOverride=null) {
  const source=promptOverride&&typeof promptOverride==='object'?promptOverride:assemblePrompts();
  const positive=String(source.positive||'');
  const negative=String(source.negative||'');
  const model=els.model.value;
  const isV5=model.startsWith('nai-diffusion-5');
  const width=Math.round(clampNumber(els.width.value,256,2048,1024)/64)*64;
  const height=Math.round(clampNumber(els.height.value,256,2048,1024)/64)*64;
  const params={
    params_version:isV5?4:3,
    width,height,scale:clampNumber(els.cfg.value,0,20,5),
    sampler:els.sampler.value,
    steps:Math.round(clampNumber(els.steps.value,1,50,28)),
    n_samples:1,ucPreset:ucPresetNoneIndex(model),qualityToggle:false,autoSmea:false,
    dynamic_thresholding:false,controlnet_strength:1,legacy:false,add_original_image:true,
    noise_schedule:'karras',legacy_v3_extend:false,skip_cfg_above_sigma:null,use_coords:false,
    normalize_reference_strength_multiple:true,inpaintImg2ImgStrength:1,
    legacy_uc:false,negative_prompt:negative,deliberate_euler_ancestral_bug:false,prefer_brownian:true,
    image_format:'png',stream:'msgpack',
    v4_prompt:{caption:{base_caption:positive,char_captions:[]},use_coords:false,use_order:true},
    v4_negative_prompt:{caption:{base_caption:negative,char_captions:[]},legacy_uc:false},
characterPrompts:[]
  };
  if (seed !== null && seed !== undefined && String(seed).trim() !== '') {
    params.seed = Number(seed);
  }
  if (!model.includes('full-medium')) params.cfg_rescale=0;
  return {input:positive,model,action:'generate',use_new_shared_trial:true,parameters:params};
}
function buildOpenAiBody(naiBody) {const p=naiBody.parameters; const copy={...p};
  for (const key of ['image','mask','strength','noise','width','height','stream','qualityToggle','ucPreset']) delete copy[key];
  return {model:naiBody.model.replace(/-inpainting$/,''),messages:[{role:'user',content:JSON.stringify({...copy,prompt:naiBody.input,negative_prompt:p.negative_prompt||'',size:[p.width,p.height],quality:false,uc_preset:'none'})}]};
}
function isPng(bytes){return bytes.length>8&&bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47;}
async function pngFromMaybeZip(bytes) {
  if (isPng(bytes)) return new Blob([bytes],{type:'image/png'});
  if (!(bytes[0]===0x50&&bytes[1]===0x4b)) {
    const txt=new TextDecoder().decode(bytes.slice(0,900)).trim(); throw new Error(txt||'接口没有返回 PNG/ZIP');
  }
  const {unzipSync}=await import('https://cdn.jsdelivr.net/npm/fflate@0.8.2/+esm');
  const files=unzipSync(bytes); const key=Object.keys(files).find(n=>n.toLowerCase().endsWith('.png'));
if(!key) throw new Error('ZIP 中没有找到 PNG');
  return new Blob([files[key]],{type:'image/png'});
}
function parseOpenAiImage(text) {
  let data; try{data=JSON.parse(text);}catch{throw new Error('OpenAI 接口返回的不是 JSON');}
  const content=data?.choices?.[0]?.message?.content;
  if(typeof content!=='string') throw new Error('接口没有返回图片内容');
  const m=content.match(/data:image\/\w+;base64,([A-Za-z0-9+/=]+)/);
  if(!m) throw new Error(content.trim()||'接口没有返回图片数据');
  const binary=atob(m[1]); const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
  return new Blob([bytes],{type:'image/png'});
}
async function generate({forceSeed=null,throwOnError=false,promptOverride=null}={}) {
  if(busy){if(throwOnError)throw new Error('上一张图片还在生成');return;}
  rehydrateConnectionFields();
  const key=els.apiKey.value.trim() || loadSavedToken();
  if(!key){ goView('settings'); showToast('先填 Token'); if(throwOnError)throw new Error('先在完整工作台填写 NAI Token'); return; }
  if(!els.apiKey.value.trim()) els.apiKey.value=key;
  persistTokenIfRemembered();
  const promptSource=promptOverride&&typeof promptOverride==='object'?promptOverride:assemblePrompts();
  if(!String(promptSource.positive||'').trim()){ showToast('画面词和预设都是空的'); els.scenePrompt.focus(); if(throwOnError)throw new Error('画面词和预设都是空的'); return; }
  let endpoint; try{endpoint=normalizedEndpoint(els.apiFormat.value,els.endpoint.value);}catch(e){showToast(e.message);if(throwOnError)throw e;return;}
  const seed = forceSeed !== null ? String(forceSeed).trim() : els.seed.value.trim();
  currentSeed = seed;
  const naiBody=buildNaiPayload(seed || null,promptOverride);
  busy=true; els.generateBtn.disabled=true; els.generateLabel.textContent='生成中'; els.generateSpinner.classList.remove('hidden'); setConnectionState('ready','正在生成…');
  try{
    await applyReferenceFeatures(naiBody,endpoint,key);
    let blob;
    if(els.apiFormat.value==='nai'){
      const base=naiFetchBase(endpoint);
      const resp=await fetch(`${base}/ai/generate-image`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json',Accept:'application/zip,image/png'},body:JSON.stringify(naiBody)});
      const bytes=new Uint8Array(await resp.arrayBuffer());
      if(!resp.ok) throw new Error(new TextDecoder().decode(bytes).slice(0,900).trim()||`接口错误 ${resp.status}`);
      blob=await pngFromMaybeZip(bytes);
    }else{
      const resp=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(buildOpenAiBody(naiBody))});
      const text=await resp.text(); if(!resp.ok) throw new Error(text.slice(0,900)||`接口错误 ${resp.status}`); blob=parseOpenAiImage(text);
    }
    showResult(blob,seed);
    const p=currentPreset();
    const galleryId=await addGallery(blob,{
      seed,scenePrompt:els.scenePrompt.value,extraNegative:els.extraNegative.value,
      assembledPrompt:naiBody.input,assembledNegative:naiBody.parameters.negative_prompt,
      presetId:p?.id||'',presetName:p?.name||'',anchorIds:[...selectedAnchorIds],
      model:els.model.value,sampler:els.sampler.value,width:Number(els.width.value),height:Number(els.height.value),
      steps:Number(els.steps.value),cfg:Number(els.cfg.value),
      referenceEnabled:els.referenceEnabled.checked,referenceMode:els.referenceMode.value,referenceStrength:Number(els.referenceStrength.value),referenceFidelity:Number(els.referenceFidelity.value),referenceName:currentReferenceAsset?.name||'',
      vibeEnabled:els.vibeEnabled.checked,vibeStrength:Number(els.vibeStrength.value),vibeInformation:Number(els.vibeInformation.value),vibeName:currentVibeAsset?.name||'',
      createdAt:Date.now()
    });
    saveSettings(); setConnectionState('ready','生成完成'); showToast('已生成并保存到图库');
    return {blob,seed,prompt:naiBody.input,negative:naiBody.parameters.negative_prompt,width:Number(els.width.value),height:Number(els.height.value),galleryId};
  }catch(e){
    console.error(e); setConnectionState('error','生成失败');
    const msg=e?.message||String(e); showToast(msg.slice(0,200));
    if(throwOnError) throw e;
  }finally{
    busy=false; els.generateBtn.disabled=false; els.generateLabel.textContent='生成'; els.generateSpinner.classList.add('hidden');
  }
}
function showResult(blob,seed){
  if(currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  currentResultBlob=blob;
  currentObjectUrl=URL.createObjectURL(blob);
  els.resultImage.src=currentObjectUrl;
  els.saveLink.dataset.filename=seed ? `nai-${seed}.png` : `nai-${Date.now()}.png`;
  els.emptyResult.classList.add('hidden'); els.resultWrap.classList.remove('hidden');
}
function isIOSLike(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
}
function fallbackDownload(blob,name){
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
async function saveBlob(blob,name){
  if(isIOSLike() && navigator.share && typeof File!=='undefined'){
    try{
      const file=new File([blob],name,{type:blob.type||'image/png'});
      const shareData={files:[file]};
      if(!navigator.canShare || navigator.canShare(shareData)){
        await navigator.share(shareData);
        return;
      }
    }catch(e){
      if(e?.name==='AbortError') return;
      console.warn('iOS 文件分享失败，回退普通下载',e);
    }
  }
  fallbackDownload(blob,name);
}
function loadCanvasImage(src){
  return new Promise((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>resolve(image);
    image.onerror=()=>reject(new Error('水印素材读取失败'));
    image.src=src;
  });
}
async function addCustomWatermark(source){
  const asset=currentWatermarkAsset||await getWatermarkAsset();
  if(!asset?.blob) throw new Error('先在设置里上传水印');
  const sourceUrl=URL.createObjectURL(source);
  const watermarkUrl=URL.createObjectURL(asset.blob);
  try{
    const [image,mark]=await Promise.all([loadCanvasImage(sourceUrl),loadCanvasImage(watermarkUrl)]);
    const canvas=document.createElement('canvas');
    canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const ctx=canvas.getContext('2d');
    if(!ctx) throw new Error('浏览器无法生成水印版');
    ctx.drawImage(image,0,0);

    const w=canvas.width,h=canvas.height;
    ctx.save();
    ctx.globalAlpha=Math.max(0,Math.min(1,Number(els.watermarkOpacity?.value ?? 100)/100));
    ctx.drawImage(mark,0,0,w,h);
    ctx.restore();

    return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('水印版导出失败')),'image/png'));
  }finally{
    URL.revokeObjectURL(sourceUrl);
    URL.revokeObjectURL(watermarkUrl);
  }
}
async function saveWatermarkedBlob(blob,name){
  const watermarked=await addCustomWatermark(blob);
  await saveBlob(watermarked,name);
}
async function testConnection(){
  els.settingsStatus.className='settings-status'; els.settingsStatus.textContent='测试中…';
  try{
    rehydrateConnectionFields();
    const key=els.apiKey.value.trim() || loadSavedToken(); if(!key) throw new Error('先填写 Token');
    if(!els.apiKey.value.trim()) els.apiKey.value=key;
    persistTokenIfRemembered();
    if(els.apiFormat.value==='nai'){
      const base=naiFetchBase(els.endpoint.value);
      const r=await fetch(`${base}/user/subscription`,{headers:{Authorization:`Bearer ${key}`}});
      const txt=await r.text(); if(!r.ok) throw new Error(txt.slice(0,500)||`接口返回 ${r.status}`);
      const j=JSON.parse(txt); const tier=Number(j?.tier??0); const anlas=Number(j?.trainingStepsLeft?.fixedTrainingStepsLeft??0)+Number(j?.trainingStepsLeft?.purchasedTrainingSteps??0);
      els.settingsStatus.className='settings-status ok'; els.settingsStatus.textContent=`连通成功 · tier ${tier} · Anlas ${anlas}`; setConnectionState('ready',isOfficialBase(els.endpoint.value)?'NAI 官网 · 已连接':'自定义 NAI · 已连接');
    }else{
      normalizedEndpoint('openai',els.endpoint.value); els.settingsStatus.className='settings-status ok'; els.settingsStatus.textContent='OpenAI 兼容接口已保存，直接试生成最可靠。';
    }
  }catch(e){els.settingsStatus.className='settings-status bad';els.settingsStatus.textContent=e?.message||String(e);setConnectionState('error','连接测试失败');}
}
function openDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains('history')) db.createObjectStore('history',{keyPath:'id',autoIncrement:true});
      if(!db.objectStoreNames.contains('assets')) db.createObjectStore('assets',{keyPath:'key'});
    };
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
}
async function getWatermarkAsset(){
  const db=await openDb();
  const item=await new Promise((resolve,reject)=>{
    const tx=db.transaction('assets','readonly');
    const req=tx.objectStore('assets').get('watermark');
    req.onsuccess=()=>resolve(req.result||null);
    req.onerror=()=>reject(req.error);
  });
  db.close();
  return item;
}
async function saveWatermarkAsset(file){
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('assets','readwrite');
    tx.objectStore('assets').put({key:'watermark',blob:file,name:file.name||'watermark',type:file.type||'',updatedAt:Date.now()});
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
  db.close();
}
async function deleteWatermarkAsset(){
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('assets','readwrite');
    tx.objectStore('assets').delete('watermark');
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
  db.close();
}
async function refreshWatermarkUi(){
  currentWatermarkAsset=await getWatermarkAsset();
  if(watermarkPreviewUrl){URL.revokeObjectURL(watermarkPreviewUrl);watermarkPreviewUrl=null;}
  const has=Boolean(currentWatermarkAsset?.blob);
  els.removeWatermarkBtn.disabled=!has;
  if(has){
    watermarkPreviewUrl=URL.createObjectURL(currentWatermarkAsset.blob);
    els.watermarkPreview.src=watermarkPreviewUrl;
    els.watermarkStatus.textContent=currentWatermarkAsset.name||'已设置自定义水印';
    els.watermarkPreviewWrap.classList.remove('hidden');
  }else{
    els.watermarkPreview.removeAttribute('src');
    els.watermarkStatus.textContent='';
    els.watermarkPreviewWrap.classList.add('hidden');
  }
}
async function getLocalAsset(key){
  const db=await openDb();
  const item=await new Promise((resolve,reject)=>{
    const tx=db.transaction('assets','readonly');
    const req=tx.objectStore('assets').get(key);
    req.onsuccess=()=>resolve(req.result||null);
    req.onerror=()=>reject(req.error);
  });
  db.close();
  return item;
}
async function putLocalAsset(key,file,extra={}){
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('assets','readwrite');
    tx.objectStore('assets').put({key,blob:file,name:file?.name||key,type:file?.type||'',updatedAt:Date.now(),...extra});
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
  db.close();
}
async function putAssetRecord(record){
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('assets','readwrite');
    tx.objectStore('assets').put(record);
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
  db.close();
}
async function removeLocalAsset(key){
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('assets','readwrite');
    tx.objectStore('assets').delete(key);
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
  });
  db.close();
}
async function listLocalAssets(prefix){
  const db=await openDb();
  const items=await new Promise((resolve,reject)=>{
    const tx=db.transaction('assets','readonly');
    const req=tx.objectStore('assets').getAll();
    req.onsuccess=()=>resolve((req.result||[]).filter(item=>String(item?.key||'').startsWith(prefix)));
    req.onerror=()=>reject(req.error);
  });
  db.close();
  return items.sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
}
async function getAllLocalAssets(){
  const db=await openDb();
  const items=await new Promise((resolve,reject)=>{
    const tx=db.transaction('assets','readonly');
    const req=tx.objectStore('assets').getAll();
    req.onsuccess=()=>resolve(req.result||[]);
    req.onerror=()=>reject(req.error);
  });
  db.close();
  return items;
}
function blobAsDataUrl(blob){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result||''));
    reader.onerror=()=>reject(reader.error||new Error('文件读取失败'));
    reader.readAsDataURL(blob);
  });
}
async function portableEncode(value){
  if(value instanceof Blob){
    return {__isoldeType:'blob',type:value.type||'',name:value.name||'',data:await blobAsDataUrl(value)};
  }
  if(Array.isArray(value))return await Promise.all(value.map(portableEncode));
  if(value&&typeof value==='object'){
    const out={};
    for(const [key,item] of Object.entries(value))out[key]=await portableEncode(item);
    return out;
  }
  return value;
}
function blobFromDataUrl(dataUrl,type='',name=''){
  const match=String(dataUrl||'').match(/^data:([^;,]*)(;base64)?,(.*)$/s);
  if(!match)throw new Error('配置中的图片数据损坏');
  const mime=type||match[1]||'application/octet-stream';
  const binary=match[2]?atob(match[3]):decodeURIComponent(match[3]);
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
  if(name&&typeof File!=='undefined')return new File([bytes],name,{type:mime});
  return new Blob([bytes],{type:mime});
}
async function portableDecode(value){
  if(Array.isArray(value))return await Promise.all(value.map(portableDecode));
  if(value&&typeof value==='object'){
    if(value.__isoldeType==='blob')return blobFromDataUrl(value.data,value.type,value.name);
    const out={};
    for(const [key,item] of Object.entries(value))out[key]=await portableDecode(item);
    return out;
  }
  return value;
}
async function exportPortableConfig(){
  try{
    saveSettings();
    const assets=await portableEncode(await getAllLocalAssets());
    const bundle={
      kind:'isolde-nai-config',
      version:1,
      exportedAt:new Date().toISOString(),
      settings:loadJson(SETTINGS_KEY,{}),
      presets:loadJson(PRESETS_KEY,[]),
      anchors:loadJson(ANCHORS_KEY,[]),
      theme:localStorage.getItem(THEME_KEY)||'',
      assets
    };
    const blob=new Blob([JSON.stringify(bundle,null,2)],{type:'application/json'});
    await saveBlob(blob,'isolde-nai-config-'+new Date().toISOString().slice(0,10)+'.json');
    showToast('配置已导出');
  }catch(e){
    console.error(e);
    showToast((e?.message||'配置导出失败').slice(0,180));
  }
}
async function importPortableConfig(file){
  if(!file)return;
  try{
    const raw=JSON.parse(await file.text());
    if(raw?.kind!=='isolde-nai-config')throw new Error('这不是 Isolde.nai 配置文件');
    if(raw.settings&&typeof raw.settings==='object')saveJson(SETTINGS_KEY,raw.settings);
    if(Array.isArray(raw.presets))saveJson(PRESETS_KEY,raw.presets);
    if(Array.isArray(raw.anchors))saveJson(ANCHORS_KEY,raw.anchors);
    if(typeof raw.theme==='string'&&raw.theme)localStorage.setItem(THEME_KEY,raw.theme);
    if(Array.isArray(raw.assets)){
      const assets=await portableDecode(raw.assets);
      const db=await openDb();
      await new Promise((resolve,reject)=>{
        const tx=db.transaction('assets','readwrite');
        const store=tx.objectStore('assets');
        store.clear();
        for(const item of assets)if(item?.key)store.put(item);
        tx.oncomplete=resolve;
        tx.onerror=()=>reject(tx.error);
      });
      db.close();
    }
    showToast('配置已导入，正在刷新');
    setTimeout(()=>location.reload(),500);
  }catch(e){
    console.error(e);
    showToast((e?.message||'配置导入失败').slice(0,180));
  }finally{
    if(els.importConfigFile)els.importConfigFile.value='';
  }
}

async function renderVibePresets(selectedKey=''){
  const items=await listLocalAssets('vibe-preset:');
  const previous=selectedKey||els.vibePresetSelect.value||'';
  els.vibePresetSelect.innerHTML='<option value="">未选择预设</option>';
  for(const item of items){
    const option=document.createElement('option');
    option.value=item.key;
    option.textContent=item.name||'未命名 Vibe';
    els.vibePresetSelect.appendChild(option);
  }
  if(previous&&items.some(item=>item.key===previous))els.vibePresetSelect.value=previous;
  els.deleteVibePresetBtn.disabled=!els.vibePresetSelect.value;
}
function vibeAssetUsable(asset){
  if(!asset)return false;
  if(Array.isArray(asset.vibeItems)&&asset.vibeItems.some(vibeAssetUsable))return true;
  if(asset.blob instanceof Blob)return true;
  const buckets=asset.encodings&&typeof asset.encodings==='object'?Object.values(asset.encodings):[];
  return buckets.some(list=>Array.isArray(list)&&list.some(item=>typeof item?.encoding==='string'&&item.encoding.length>64));
}
function base64Payload(value){
  const text=String(value||'').trim();
  if(!text)return '';
  return text.startsWith('data:')&&text.includes(',')?text.slice(text.indexOf(',')+1):text;
}
function base64ToBlob(value){
  try{
    const raw=atob(base64Payload(value));
    if(raw.length<4)return null;
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
    let type='application/octet-stream';
    if(bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47)type='image/png';
    else if(bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)type='image/jpeg';
    else if(bytes[0]===0x52&&bytes[1]===0x49&&bytes[2]===0x46&&bytes[3]===0x46)type='image/webp';
    else return null;
    return new Blob([bytes],{type});
  }catch{return null;}
}
function modelFromVibeKey(key){
  const map={
    'v4-5full':'nai-diffusion-4-5-full',
    'v4-5curated':'nai-diffusion-4-5-curated',
    'v4full':'nai-diffusion-4-full',
    'v4curated':'nai-diffusion-4-curated-preview',
    'nai-diffusion-4-5-full':'nai-diffusion-4-5-full',
    'nai-diffusion-4-5-curated':'nai-diffusion-4-5-curated',
    'nai-diffusion-4-full':'nai-diffusion-4-full',
    'nai-diffusion-4-curated-preview':'nai-diffusion-4-curated-preview'
  };
  return map[String(key||'').trim()]||String(key||'').trim();
}
function normalizeEncodingBuckets(encodings){
  const out={};
  if(!encodings||typeof encodings!=='object')return out;
  for(const [rawKey,bucket] of Object.entries(encodings)){
    const model=modelFromVibeKey(rawKey);
    const list=[];
    if(typeof bucket==='string'){
      if(bucket.length>64)list.push({encoding:base64Payload(bucket),information:null});
    }else if(Array.isArray(bucket)){
      for(const item of bucket){
        if(typeof item==='string'&&item.length>64)list.push({encoding:base64Payload(item),information:null});
        else if(item&&typeof item==='object'){
          const encoding=base64Payload(item.encoding||item.data||item.reference_image||'');
          const information=Number(item.information_extracted??item.information??item.info);
          if(encoding.length>64)list.push({encoding,information:Number.isFinite(information)?information:null});
        }
      }
    }else if(bucket&&typeof bucket==='object'){
      for(const value of Object.values(bucket)){
        if(typeof value==='string'&&value.length>64)list.push({encoding:base64Payload(value),information:null});
        else if(value&&typeof value==='object'){
          const encoding=base64Payload(value.encoding||value.data||value.reference_image||'');
          const information=Number((value.params||{}).information_extracted??value.information_extracted??value.information??value.info);
          if(encoding.length>64)list.push({encoding,information:Number.isFinite(information)?information:null});
        }
      }
    }
    if(list.length)out[model]=list;
  }
  return out;
}
function pushDirectArrayEntries(out,obj,nameBase){
  if(!obj||typeof obj!=='object')return;
  const refs=Array.isArray(obj.reference_image_multiple)?obj.reference_image_multiple:[];
  if(!refs.length)return;
  const strengths=Array.isArray(obj.reference_strength_multiple)?obj.reference_strength_multiple:[];
  const infos=Array.isArray(obj.reference_information_extracted_multiple)?obj.reference_information_extracted_multiple:[];
  refs.forEach((raw,i)=>{
    const encoding=base64Payload(raw);
    if(encoding.length<=64)return;
    const strength=clampNumber(strengths[i],0,1,.6);
    const information=clampNumber(infos[i],.05,1,.7);
    out.push({
      name:refs.length>1?`${nameBase} ${i+1}`:nameBase,
      strength,information,
      encodings:{
        'nai-diffusion-4-5-full':[{encoding,information}],
        'nai-diffusion-4-5-curated':[{encoding,information}]
      }
    });
  });
}
function indexedVibeItem(raw,overrides={}){
  if(!raw||typeof raw!=='object')return null;
  const importInfo=raw.importInfo&&typeof raw.importInfo==='object'?raw.importInfo:{};
  const encodings=normalizeEncodingBuckets(raw.encodings);
  const blob=base64ToBlob(raw.image||'');
  const previewBlob=blob||base64ToBlob(raw.thumbnail||'');
  const strength=clampNumber(overrides.strength??importInfo.strength??raw.strength,0,1,.6);
  const information=clampNumber(overrides.information??importInfo.information_extracted??raw.information_extracted??raw.information,.05,1,.7);
  if(!blob&&!Object.keys(encodings).length)return null;
  return {
    name:String(raw.name||overrides.name||'Vibe'),
    strength,
    information,
    encodings,
    blob,
    previewBlob
  };
}
function parseIndexedVibeLibrary(doc,fileName='Vibe'){
  if(!doc||typeof doc!=='object'||Array.isArray(doc))return [];
  const vibeData=doc.vibeData&&typeof doc.vibeData==='object'?doc.vibeData:null;
  const groups=doc.groups&&typeof doc.groups==='object'?doc.groups:null;
  const vibePresets=doc.vibePresets&&typeof doc.vibePresets==='object'?doc.vibePresets:null;
  if(!vibeData||(!groups&&!vibePresets))return [];

  const out=[];
  const groupedNames=new Set();

  if(groups){
    for(const [groupName,group] of Object.entries(groups)){
      const refs=Array.isArray(group?.vibes)?group.vibes:[];
      const items=[];
      for(const ref of refs){
        const raw=vibeData?.[ref?.vibeDataId];
        const item=indexedVibeItem(raw,{strength:ref?.strength});
        if(item)items.push(item);
      }
      if(!items.length)continue;
      groupedNames.add(groupName);
      const first=items[0];
      out.push({
        name:String(groupName||'Vibe 组合'),
        strength:first.strength,
        information:first.information,
        encodings:null,
        blob:first.blob||null,
        previewBlob:first.previewBlob||null,
        vibeItems:items,
        isGroup:true,
        fileName
      });
    }
  }

  if(vibePresets){
    for(const [presetName,preset] of Object.entries(vibePresets)){
      if(groupedNames.has(presetName))continue;
      const raw=vibeData?.[preset?.vibeDataId];
      const item=indexedVibeItem(raw,{
        strength:preset?.strength,
        information:preset?.infoExtract,
        name:presetName
      });
      if(!item)continue;
      out.push({
        ...item,
        name:String(presetName||item.name),
        fileName
      });
    }
  }
  return out;
}
function parseVibeDocument(doc,fileName='Vibe'){
  const indexed=parseIndexedVibeLibrary(doc,fileName);
  if(indexed.length)return indexed;
  const base=fileName.replace(/\.(?:json|naiv4vibe|naiv4vibebundle)$/i,'')||'Vibe';
  const out=[];
  const documents=Array.isArray(doc)?doc:(Array.isArray(doc?.vibes)?doc.vibes:[doc]);
  for(let idx=0;idx<documents.length;idx++){
    const one=documents[idx];
    if(!one||typeof one!=='object')continue;
    const importInfo=one.importInfo&&typeof one.importInfo==='object'?one.importInfo:{};
    const strength=clampNumber(importInfo.strength??one.strength,0,1,.6);
    const information=clampNumber(importInfo.information_extracted??one.information_extracted??one.information,.05,1,.7);
    const encodings=normalizeEncodingBuckets(one.encodings);
    const imageBlob=base64ToBlob(one.image||'');
    const previewBlob=imageBlob||base64ToBlob(one.thumbnail||'');
    if(Object.keys(encodings).length){
      out.push({
        name:String(one.name||(`${base}${documents.length>1?` ${idx+1}`:''}`)),
        strength,information,encodings,
        blob:imageBlob,previewBlob,
        fileName:fileName
      });
      continue;
    }
    const direct=one.parameters&&typeof one.parameters==='object'?one.parameters:one;
    const before=out.length;
    pushDirectArrayEntries(out,direct,String(one.name||base));
    if(out.length>before)continue;
    const single=base64Payload(one.encoding||one.vibe_encoding||one.reference_image||one.data||'');
    if(single.length>64){
      const model=modelFromVibeKey(importInfo.model||one.model||'nai-diffusion-4-5-full');
      out.push({
        name:String(one.name||base),
        strength,information,
        encodings:{[model]:[{encoding:single,information}]},
        blob:imageBlob,previewBlob,fileName
      });
    }
  }
  if(!out.length&&doc?.parameters&&typeof doc.parameters==='object')pushDirectArrayEntries(out,doc.parameters,base);
  return out;
}
function vibeEncodingFor(asset,model,information){
  const list=asset?.encodings?.[model];
  if(!Array.isArray(list)||!list.length)return null;
  const want=Number(information);
  let exact=list.find(item=>item.information==null||Math.abs(Number(item.information)-want)<0.001);
  if(!exact&&list.length===1&&list[0].information==null)exact=list[0];
  return exact?.encoding||null;
}
async function importVibeDocumentFile(file){
  const text=(await file.text()).replace(/^\uFEFF/,'');
  let doc;
  try{doc=JSON.parse(text);}catch{throw new Error('这个 Vibe / JSON 文件不是有效 JSON');}
  const entries=parseVibeDocument(doc,file.name||'Vibe');
  if(!entries.length)throw new Error('没识别到可用的 Vibe 编码');
  const keys=[];
  for(const entry of entries){
    const key=`vibe-preset:${uid('vibe')}`;
    await putAssetRecord({
      key,
      name:entry.name,
      blob:entry.blob||null,
      previewBlob:entry.previewBlob||null,
      fileName:entry.fileName||file.name||'vibe',
      type:file.type||'application/json',
      strength:entry.strength,
      information:entry.information,
      encodings:entry.encodings,
      vibeItems:entry.vibeItems||null,
      isGroup:Boolean(entry.isGroup),
      imported:true,
      updatedAt:Date.now()
    });
    keys.push(key);
  }
  await renderVibePresets(keys[0]);
  await applyVibePreset(keys[0]);
  if(entries.length>1)showToast(`已导入 ${entries.length} 个 Vibe 预设`);
  else if(entries[0]?.isGroup)showToast(`组合 Vibe「${entries[0].name}」已导入 · ${entries[0].vibeItems?.length||0} 个子 Vibe`);
  else showToast('Vibe 文件已导入');
}
async function saveCurrentVibePreset(){
  const asset=currentVibeAsset||await getLocalAsset('vibe');
  if(!vibeAssetUsable(asset)){showToast('先添加或导入一个 Vibe');return;}
  const fallback=(asset.name||'Vibe').replace(/\.[^.]+$/,'');
  const name=prompt('给这个 Vibe 预设起个名字',fallback);
  if(name===null)return;
  const clean=name.trim();
  if(!clean){showToast('预设名称不能为空');return;}
  const key=`vibe-preset:${uid('vibe')}`;
  await putAssetRecord({
    key,
    name:clean,
    blob:asset.blob||null,
    previewBlob:asset.previewBlob||null,
    encodings:asset.encodings||null,
    vibeItems:asset.vibeItems||null,
    isGroup:Boolean(asset.isGroup),
    fileName:asset.name||asset.fileName||'vibe',
    type:asset.type||asset.blob?.type||'',
    strength:clampNumber(els.vibeStrength.value,0,1,.6),
    information:clampNumber(els.vibeInformation.value,.05,1,.7),
    updatedAt:Date.now()
  });
  await renderVibePresets(key);
  showToast(`Vibe 预设「${clean}」已保存`);
}
async function applyVibePreset(key){
  if(!key){els.deleteVibePresetBtn.disabled=true;return;}
  const preset=await getLocalAsset(key);
  if(!vibeAssetUsable(preset)){showToast('这个 Vibe 预设已不存在');await renderVibePresets();return;}
  await putAssetRecord({
    key:'vibe',
    blob:preset.blob||null,
    previewBlob:preset.previewBlob||null,
    encodings:preset.encodings||null,
    vibeItems:preset.vibeItems||null,
    isGroup:Boolean(preset.isGroup),
    name:preset.name||preset.fileName||'vibe',
    type:preset.type||preset.blob?.type||'',
    updatedAt:Date.now()
  });
  els.vibeStrength.value=String(clampNumber(preset.strength,0,1,.6));
  els.vibeInformation.value=String(clampNumber(preset.information,.05,1,.7));
  els.vibeStrengthValue.textContent=Number(els.vibeStrength.value).toFixed(2);
  els.vibeInformationValue.textContent=Number(els.vibeInformation.value).toFixed(2);
  els.vibeEnabled.checked=true;
  els.referenceEnabled.checked=false;
  await refreshReferenceUi();
  els.vibePresetSelect.value=key;
  els.deleteVibePresetBtn.disabled=false;
  saveSettings();
  showToast(`已载入 Vibe 预设「${preset.name||'未命名'}」`);
}
async function deleteSelectedVibePreset(){
  const key=els.vibePresetSelect.value;
  if(!key)return;
  const preset=await getLocalAsset(key);
  const name=preset?.name||'这个 Vibe 预设';
  if(!confirm(`删除 Vibe 预设「${name}」？`))return;
  await removeLocalAsset(key);
  await renderVibePresets();
  showToast('Vibe 预设已删除');
}
async function refreshReferenceUi(){
  [currentReferenceAsset,currentVibeAsset]=await Promise.all([getLocalAsset('reference'),getLocalAsset('vibe')]);
  if(referencePreviewUrl){URL.revokeObjectURL(referencePreviewUrl);referencePreviewUrl=null;}
  if(vibePreviewUrl){URL.revokeObjectURL(vibePreviewUrl);vibePreviewUrl=null;}

  const hasReference=Boolean(currentReferenceAsset?.blob);
  els.removeReferenceBtn.disabled=!hasReference;
  if(hasReference){
    referencePreviewUrl=URL.createObjectURL(currentReferenceAsset.blob);
    els.referencePreview.src=referencePreviewUrl;
    els.referenceStatus.textContent=currentReferenceAsset.name||'Reference';
    els.referencePreviewWrap.classList.remove('hidden');
  }else{
    els.referencePreview.removeAttribute('src');
    els.referenceStatus.textContent='';
    els.referencePreviewWrap.classList.add('hidden');
    els.referenceEnabled.checked=false;
  }

  const hasVibe=vibeAssetUsable(currentVibeAsset);
  els.removeVibeBtn.disabled=!hasVibe;
  if(hasVibe){
    const firstItem=Array.isArray(currentVibeAsset.vibeItems)?currentVibeAsset.vibeItems[0]:null;
    const preview=currentVibeAsset.blob||currentVibeAsset.previewBlob||firstItem?.blob||firstItem?.previewBlob||null;
    if(preview){
      vibePreviewUrl=URL.createObjectURL(preview);
      els.vibePreview.src=vibePreviewUrl;
    }else{
      els.vibePreview.removeAttribute('src');
    }
    els.vibePreview.style.display=preview?'block':'none';
    const count=Array.isArray(currentVibeAsset.vibeItems)?currentVibeAsset.vibeItems.length:0;
    els.vibeStatus.textContent=count>1
      ? `${currentVibeAsset.name||'组合 Vibe'} · ${count} 个 Vibe · 使用各自参数`
      : (currentVibeAsset.name||'已导入 Vibe 编码');
    els.vibePreviewWrap.classList.remove('hidden');
  }else{
    els.vibePreview.removeAttribute('src');
    els.vibePreview.style.display='block';
    els.vibeStatus.textContent='';
    els.vibePreviewWrap.classList.add('hidden');
    els.vibeEnabled.checked=false;
  }
  const grouped=Boolean(hasVibe&&Array.isArray(currentVibeAsset?.vibeItems)&&currentVibeAsset.vibeItems.length>1);
  els.vibeStrength.disabled=grouped;
  els.vibeInformation.disabled=grouped;
  els.vibeStrength.title=grouped?'组合预设使用每个 Vibe 自己的 Strength':'';
  els.vibeInformation.title=grouped?'组合预设使用每个 Vibe 自己的 Information':'';
  updateReferenceModelHint();
}
function updateReferenceModelHint(){
  const supported=els.model.value.startsWith('nai-diffusion-4-5');
  els.referenceModelHint.textContent=supported?'V4.5 生效':'V5 自动忽略';
  els.referenceModelHint.classList.toggle('warning',!supported);
}
function blobToBase64(blob){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const value=String(reader.result||'');
      const comma=value.indexOf(',');
      resolve(comma>=0?value.slice(comma+1):value);
    };
    reader.onerror=()=>reject(reader.error||new Error('图片读取失败'));
    reader.readAsDataURL(blob);
  });
}
function canvasToBlob(canvas){
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('参考图处理失败')),'image/png'));
}
async function preparePreciseReference(blob){
  const url=URL.createObjectURL(blob);
  try{
    const image=await loadCanvasImage(url);
    const square=Math.abs(image.naturalWidth-image.naturalHeight)<=Math.max(image.naturalWidth,image.naturalHeight)*.04;
    const target=square?[1472,1472]:(image.naturalWidth>image.naturalHeight?[1536,1024]:[1024,1536]);
    const scale=Math.min(target[0]/image.naturalWidth,target[1]/image.naturalHeight);
    const drawW=Math.max(1,Math.round(image.naturalWidth*scale));
    const drawH=Math.max(1,Math.round(image.naturalHeight*scale));
    const canvas=document.createElement('canvas');
    canvas.width=target[0];canvas.height=target[1];
    const ctx=canvas.getContext('2d');
    if(!ctx) throw new Error('浏览器无法处理 Reference');
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(image,Math.floor((canvas.width-drawW)/2),Math.floor((canvas.height-drawH)/2),drawW,drawH);
    return await canvasToBlob(canvas);
  }finally{
    URL.revokeObjectURL(url);
  }
}
async function sha256Hex(blob){
  const digest=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function bytesToBase64(bytes){
  let binary='';
  const chunk=0x8000;
  for(let i=0;i<bytes.length;i+=chunk) binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));
  return btoa(binary);
}
async function encodedVibeFor(blob,model,information,base,key){
  const hash=await sha256Hex(blob);
  const info=Number(information).toFixed(2);
  const cacheKey=`vibe-cache:${hash}:${model}:${info}`;
  const cached=await getLocalAsset(cacheKey);
  if(cached?.encoding)return cached.encoding;

  const image=await blobToBase64(blob);
  const resp=await fetch(`${base}/ai/encode-vibe`,{
    method:'POST',
    headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json',Accept:'application/octet-stream'},
    body:JSON.stringify({
      image,
      model,
      information_extracted:Number(information),
      crop_to_mask:false,
      mask:'',
      focus_seed:1,
      info_extract_seed:1
    })
  });
  const raw=new Uint8Array(await resp.arrayBuffer());
  if(!resp.ok){
    const message=new TextDecoder().decode(raw).slice(0,700).trim();
    throw new Error(message||`Vibe 编码失败 ${resp.status}`);
  }
  const encoding=bytesToBase64(raw);
  await putAssetRecord({key:cacheKey,encoding,updatedAt:Date.now(),model,information:Number(information)});
  return encoding;
}
async function applyReferenceFeatures(naiBody,endpoint,key){
  const useReference=els.referenceEnabled.checked;
  const useVibe=els.vibeEnabled.checked;
  if(!useReference&&!useVibe)return naiBody;
  if(!naiBody.model.startsWith('nai-diffusion-4-5'))return naiBody;
  if(els.apiFormat.value!=='nai')throw new Error('Reference / Vibe 目前只支持 NovelAI 格式接口');
  if(useReference&&useVibe)throw new Error('Precise Reference 和 Vibe 不能同时启用');

  if(useReference){
    const asset=currentReferenceAsset||await getLocalAsset('reference');
    if(!asset?.blob)throw new Error('先添加 Reference 图片');
    const prepared=await preparePreciseReference(asset.blob);
    const image=await blobToBase64(prepared);
    const fidelity=clampNumber(els.referenceFidelity.value,0,1,1);
    naiBody.parameters.director_reference_images=[image];
    naiBody.parameters.director_reference_descriptions=[{
      caption:{base_caption:els.referenceMode.value,char_captions:[]},
      legacy_uc:false
    }];
    naiBody.parameters.director_reference_information_extracted=[1];
    naiBody.parameters.director_reference_strength_values=[clampNumber(els.referenceStrength.value,0,1,.75)];
    naiBody.parameters.director_reference_secondary_strength_values=[1-fidelity];
  }

  if(useVibe){
    const asset=currentVibeAsset||await getLocalAsset('vibe');
    if(!vibeAssetUsable(asset))throw new Error('先添加或导入一个 Vibe');
    const base=naiFetchBase(endpoint);
    const items=Array.isArray(asset.vibeItems)&&asset.vibeItems.length?asset.vibeItems:[asset];
    const encodings=[];
    const strengths=[];
    const informations=[];

    for(const item of items){
      const info=items.length>1
        ? clampNumber(item.information,.05,1,.7)
        : clampNumber(els.vibeInformation.value,.05,1,.7);
      const strength=items.length>1
        ? clampNumber(item.strength,0,1,.6)
        : clampNumber(els.vibeStrength.value,0,1,.6);
      let encoded=vibeEncodingFor(item,naiBody.model,info);
      if(!encoded){
        if(!item.blob)throw new Error(`Vibe「${item.name||'未命名'}」没有当前模型 / Information 的编码，也没有原图可重新编码`);
        encoded=await encodedVibeFor(item.blob,naiBody.model,info,base,key);
      }
      encodings.push(encoded);
      strengths.push(strength);
      informations.push(info);
    }

    naiBody.parameters.reference_image_multiple=encodings;
    naiBody.parameters.reference_strength_multiple=strengths;
    naiBody.parameters.reference_information_extracted_multiple=informations;
    naiBody.parameters.normalize_reference_strength_multiple=true;
  }
  return naiBody;
}
async function addGallery(blob,meta){
  const db=await openDb();
  let id=null;
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('history','readwrite');
    const req=tx.objectStore('history').add({blob,...meta});
    req.onsuccess=()=>{id=req.result;};
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error||new Error('图库写入失败'));
  });
  db.close();
  return id;
}
async function deleteGalleryRecord(id){
  if(id===null||id===undefined||String(id).trim()==='')return false;
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('history','readwrite');
    tx.objectStore('history').delete(Number(id));
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error||new Error('图库删除失败'));
  });
  db.close();
  return true;
}
async function deleteGalleryBridgeItem({galleryId=null,seed='',scenePrompt=''}={}){
  let id=galleryId;
  if(id===null||id===undefined||String(id).trim()===''){
    const items=await getGallery();
    const wantedSeed=String(seed??'').trim();
    const wantedScene=String(scenePrompt??'').trim();
    const match=items.find(item=>{
      const sameSeed=wantedSeed&&String(item.seed??'').trim()===wantedSeed;
      const sameScene=wantedScene&&String(item.scenePrompt??item.prompt??'').trim()===wantedScene;
      return sameSeed&&sameScene;
    });
    id=match?.id??null;
  }
  if(id===null||id===undefined)return false;
  return await deleteGalleryRecord(id);
}
async function getGallery(){
  const db=await openDb();const items=await new Promise((resolve,reject)=>{const tx=db.transaction('history','readonly');const req=tx.objectStore('history').getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);});db.close();return items.sort((a,b)=>(b.id||0)-(a.id||0));
}
async function deleteGalleryItem(id,card){
  const scrollTop=window.scrollY;
  const scrollLeft=window.scrollX;
  await deleteGalleryRecord(id);
  if(card?.isConnected) card.remove();
  const remaining=els.galleryGrid.querySelectorAll('.gallery-card').length;
  els.galleryCount.textContent=`${remaining} 张 · 保存在此设备`;
  if(!remaining){
    const note=document.createElement('div');
    note.className='empty-note';
    note.textContent='图库还是空的。生成第一张图后会自动保存在这里。';
    els.galleryGrid.appendChild(note);
  }
  requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(scrollLeft,scrollTop)));
}
function applyGalleryMeta(item){
  els.scenePrompt.value=item.scenePrompt??item.prompt??'';
  els.extraNegative.value=item.extraNegative??item.negative??'';
  if(item.presetId&&presets.some(p=>p.id===item.presetId)) els.presetSelect.value=item.presetId;
  selectedAnchorIds=(item.anchorIds||[]).filter(id=>anchors.some(a=>a.id===id));
  if(item.model) els.model.value=item.model;if(item.sampler)els.sampler.value=item.sampler;
  if(item.width)els.width.value=item.width;if(item.height)els.height.value=item.height;
  if(item.steps)els.steps.value=item.steps;if(item.cfg!=null)els.cfg.value=item.cfg;
  if(item.referenceMode)els.referenceMode.value=item.referenceMode;
  if(item.referenceStrength!=null)els.referenceStrength.value=String(item.referenceStrength);
  if(item.referenceFidelity!=null)els.referenceFidelity.value=String(item.referenceFidelity);
  if(item.vibeStrength!=null)els.vibeStrength.value=String(item.vibeStrength);
  if(item.vibeInformation!=null)els.vibeInformation.value=String(item.vibeInformation);
  els.referenceStrengthValue.textContent=Number(els.referenceStrength.value).toFixed(2);
  els.referenceFidelityValue.textContent=Number(els.referenceFidelity.value).toFixed(2);
  els.vibeStrengthValue.textContent=Number(els.vibeStrength.value).toFixed(2);
  els.vibeInformationValue.textContent=Number(els.vibeInformation.value).toFixed(2);
  els.referenceEnabled.checked=Boolean(item.referenceEnabled&&currentReferenceAsset?.blob);
  els.vibeEnabled.checked=Boolean(item.vibeEnabled&&vibeAssetUsable(currentVibeAsset));
  if(item.referenceEnabled&&!currentReferenceAsset?.blob)showToast('这张图当时用了 Reference，但当前设备没有对应参考图');
  if(item.vibeEnabled&&!vibeAssetUsable(currentVibeAsset))showToast('这张图当时用了 Vibe，但当前设备没有对应 Vibe 图');
  els.seed.value=item.seed||'';currentSeed=item.seed||'';els.aspect.value=aspectFor(Number(els.width.value),Number(els.height.value));
renderAnchorPicker();updateAssembly();saveSettings();showResult(item.blob,item.seed||'gallery');goView('workbench');
}
async function renderGallery(){
  els.galleryGrid.innerHTML='';
  try{
    const items=await getGallery();els.galleryCount.textContent=`${items.length} 张 · 保存在此设备`;
    if(!items.length){const note=document.createElement('div');note.className='empty-note';note.textContent='图库还是空的。生成第一张图后会自动保存在这里。';els.galleryGrid.appendChild(note);return;}
    for(const item of items){
      const card=document.createElement('article');card.className='gallery-card';
      const ib=document.createElement('button');ib.type='button';ib.className='gallery-image-btn';
      const img=document.createElement('img');const url=URL.createObjectURL(item.blob);img.src=url;img.onload=()=>URL.revokeObjectURL(url);img.alt='图库图片';ib.appendChild(img);ib.addEventListener('click',()=>applyGalleryMeta(item));card.appendChild(ib);
      const meta=document.createElement('div');meta.className='gallery-meta';const strong=document.createElement('strong');strong.textContent=item.presetName||item.model||'NAI';meta.appendChild(strong);
      const span=document.createElement('span');span.textContent=`${item.width||'?'}×${item.height||'?'} · seed ${item.seed||'?'}`;meta.appendChild(span);
      const actions=document.createElement('div');actions.className='gallery-actions';actions.appendChild(makeButton('原图','',()=>saveBlob(item.blob,item.seed?`nai-${item.seed}.png`:`nai-${item.id}.png`)));actions.appendChild(makeButton('水印版','',()=>saveWatermarkedBlob(item.blob,item.seed?`nai-${item.seed}-watermarked.png`:`nai-${item.id}-watermarked.png`).catch(e=>showToast(e?.message||'水印版生成失败'))));actions.appendChild(makeButton('载入','',()=>applyGalleryMeta(item)));actions.appendChild(makeButton('删除','danger',()=>deleteGalleryItem(item.id,card)));meta.appendChild(actions);card.appendChild(meta);els.galleryGrid.appendChild(card);
    }
  }catch(e){console.warn(e);showToast('图库读取失败');}
}

async function exportGalleryZip(){
  const btn = els.exportGalleryZipBtn;
  if (!btn) return;
  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = '正在打包…';
  try{
    const items = await getGallery();
    if(!items.length){ showToast('图库还是空的'); return; }

    const { zipSync, strToU8 } = await import('https://cdn.jsdelivr.net/npm/fflate@0.8.2/+esm');
    const files = {};
    const used = new Map();
    const metadata = [];

    const pad = (n) => String(n).padStart(2,'0');
    const safe = (s) => String(s || '').replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,'_').slice(0,60);

    for(let i=0;i<items.length;i++){
      const item = items[i];
      const d = new Date(item.createdAt || Date.now());
      const stamp = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
      const seed = safe(item.seed || 'noseed');
      const preset = safe(item.presetName || 'nai');
      const base = `${stamp}_${preset}_seed-${seed}`;
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      const name = `${base}${count ? `_${count+1}` : ''}.png`;
      const bytes = new Uint8Array(await item.blob.arrayBuffer());
      files[name] = bytes;

      metadata.push({
        file: name,
        createdAt: item.createdAt || null,
        seed: item.seed || '',
        presetName: item.presetName || '',
        model: item.model || '',
        sampler: item.sampler || '',
        width: item.width || null,
        height: item.height || null,
        steps: item.steps || null,
        cfg: item.cfg ?? null,
        referenceEnabled: Boolean(item.referenceEnabled),
        referenceMode: item.referenceMode || '',
        referenceStrength: item.referenceStrength ?? null,
        referenceFidelity: item.referenceFidelity ?? null,
        referenceName: item.referenceName || '',
        vibeEnabled: Boolean(item.vibeEnabled),
        vibeStrength: item.vibeStrength ?? null,
        vibeInformation: item.vibeInformation ?? null,
        vibeName: item.vibeName || '',
        prompt: item.assembledPrompt || item.scenePrompt || item.prompt || '',
        negative: item.assembledNegative || item.extraNegative || item.negative || ''
      });

      btn.textContent = `正在打包 ${i+1}/${items.length}`;
      if(i % 8 === 0) await new Promise(r => setTimeout(r,0));
    }

    files['metadata.json'] = strToU8(JSON.stringify(metadata, null, 2));
    const zipped = zipSync(files, { level: 0 });
    const blob = new Blob([zipped], { type:'application/zip' });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const day = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `isolde-nai-gallery-${day}.zip`;
    document.body.appendChild(a);
a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    showToast(`已打包 ${items.length} 张图片`);
  }catch(e){
    console.error(e);
    showToast((e?.message || String(e)).slice(0,180));
  }finally{
    btn.disabled = false;
    btn.textContent = originalLabel;
  }
}

async function clearGallery(){
  if(!confirm('清空整个图库？图片会从这台设备的浏览器存储里删除。'))return;
  const db=await openDb();await new Promise((resolve,reject)=>{const tx=db.transaction('history','readwrite');tx.objectStore('history').clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();renderGallery();showToast('图库已清空');
}

syncThemeWithSystem();
els.themeToggle?.addEventListener('click',()=>{
  const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
  saveThemeOverride(next);
  applyTheme(next);
  showToast('已临时切换，系统下次切换时恢复跟随');
});
const handleSystemThemeChange=()=>{
  localStorage.removeItem(THEME_KEY);
  applyTheme(systemTheme());
};
if (themeMedia?.addEventListener) themeMedia.addEventListener('change',handleSystemThemeChange);
else if (themeMedia?.addListener) themeMedia.addListener(handleSystemThemeChange);
window.addEventListener('pageshow',syncThemeWithSystem);
document.addEventListener('visibilitychange',()=>{ if (!document.hidden) syncThemeWithSystem(); });
els.tabs.forEach(b=>b.addEventListener('click',()=>goView(b.dataset.view)));
els.presetSelect.addEventListener('change',()=>{settings.presetId=els.presetSelect.value;updateAssembly();});
els.scenePrompt.addEventListener('input',updateAssembly);
els.extraNegative.addEventListener('input',updateAssembly);
els.qualityTags.addEventListener('input',updateAssembly);
els.qualityPosition.addEventListener('change',updateAssembly);
els.protectTextBlock.addEventListener('change',updateAssembly);
els.aspect.addEventListener('change',()=>setAspect(els.aspect.value));
for(const id of ['sampler','steps','cfg']) els[id].addEventListener('change',saveSettings);
els.model.addEventListener('change',()=>{updateReferenceModelHint();saveSettings();});
for(const id of ['width','height']) els[id].addEventListener('change',()=>{els.aspect.value=aspectFor(Number(els.width.value),Number(els.height.value));saveSettings();});
els.seed.addEventListener('change',saveSettings);
els.clearWorkbenchBtn.addEventListener('click',()=>{els.scenePrompt.value='';els.extraNegative.value='';updateAssembly();els.scenePrompt.focus();});
els.randomSeedBtn.addEventListener('click',()=>{els.seed.value=randomSeed();saveSettings();});
els.jumpAnchorsBtn.addEventListener('click',()=>goView('anchors'));
els.generateBtn.addEventListener('click',()=>generate());
els.saveLink?.addEventListener('click',async()=>{
  if(!currentResultBlob){showToast('还没有可保存的图片');return;}
  const name=els.saveLink.dataset.filename || (currentSeed ? `nai-${currentSeed}.png` : `nai-${Date.now()}.png`);
  try{await saveBlob(currentResultBlob,name);}
  catch(e){console.error(e);showToast(e?.message||'原图保存失败');}
});
els.saveWatermarkedBtn?.addEventListener('click',async()=>{
  if(!currentResultBlob){showToast('还没有可保存的图片');return;}
  if(!currentWatermarkAsset?.blob){showToast('先在设置里上传水印');return;}
  const old=els.saveWatermarkedBtn.textContent;
  els.saveWatermarkedBtn.disabled=true;
  els.saveWatermarkedBtn.textContent='加水印中…';
  try{await saveWatermarkedBlob(currentResultBlob,currentSeed?`nai-${currentSeed}-watermarked.png`:`nai-${Date.now()}-watermarked.png`);}
  catch(e){showToast(e?.message||'水印版生成失败');}
  finally{els.saveWatermarkedBtn.disabled=false;els.saveWatermarkedBtn.textContent=old;}
});
els.regenBtn.addEventListener('click',()=>{
  const seed = currentSeed || els.seed.value.trim();
  if(!seed){ showToast('当前没有固定 Seed'); return; }
  generate({forceSeed:seed});
});
els.newSeedBtn.addEventListener('click',()=>{els.seed.value=randomSeed();generate({forceSeed:els.seed.value});});

els.inspectNaiBtn?.addEventListener('click',()=>{resetNaiInspector();els.naiInspectDialog.showModal();});
els.chooseNaiInspectBtn?.addEventListener('click',()=>els.naiInspectFile?.click());
els.replaceNaiInspectBtn?.addEventListener('click',()=>els.naiInspectFile?.click());
els.naiInspectFile?.addEventListener('change',async()=>{
  const file=els.naiInspectFile.files?.[0];if(!file)return;const old=els.chooseNaiInspectBtn.textContent;els.chooseNaiInspectBtn.disabled=true;els.chooseNaiInspectBtn.textContent='解析中…';
  try{await handleNaiInspectFile(file);}catch(e){console.error(e);showToast((e?.message||'图片解析失败').slice(0,180));}finally{els.chooseNaiInspectBtn.disabled=false;els.chooseNaiInspectBtn.textContent=old;}
});
els.addInspectedPresetBtn?.addEventListener('click',addInspectedPreset);
els.addPresetBtn.addEventListener('click',()=>openPresetEditor());
els.savePresetBtn.addEventListener('click',()=>{
  const name=els.presetName.value.trim();if(!name){els.presetName.focus();return;}
  try{
    const id=els.presetId.value||uid('preset');
    const item={id,name,artist:els.presetArtist.value.trim(),positive:els.presetPositive.value.trim(),negative:els.presetNegative.value.trim(),updatedAt:Date.now()};
    const idx=presets.findIndex(p=>p.id===id);if(idx>=0)presets[idx]={...presets[idx],...item};else presets.unshift(item);
    saveJson(PRESETS_KEY,presets);settings.presetId=id;els.presetDialog.close();
    renderPresetSelect();els.presetSelect.value=id;renderPresetLibrary();updateAssembly();showToast('预设已保存');
  }catch(e){console.error(e);showToast('预设保存失败');}
});
els.addAnchorBtn.addEventListener('click',()=>openAnchorEditor());
els.saveAnchorBtn.addEventListener('click',()=>{
  const name=els.anchorName.value.trim();if(!name){els.anchorName.focus();return;}
  try{
    const id=els.anchorId.value||uid('anchor');
    const item={id,name,prompt:els.anchorPrompt.value.trim(),updatedAt:Date.now()};
    const idx=anchors.findIndex(a=>a.id===id);if(idx>=0)anchors[idx]={...anchors[idx],...item};else anchors.unshift(item);
    saveJson(ANCHORS_KEY,anchors);els.anchorDialog.close();
    renderAnchors();updateAssembly();showToast('角色锚点已保存');
  }catch(e){console.error(e);showToast('角色保存失败');}
});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close)?.close()));

els.apiFormat.addEventListener('change',()=>{updateEndpointUi();saveSettings();});
els.toggleKeyBtn.addEventListener('click',()=>{const hidden=els.apiKey.type==='password';els.apiKey.type=hidden?'text':'password';els.toggleKeyBtn.textContent=hidden?'隐藏':'显示';});
let tokenSaveTimer=null;
els.apiKey.addEventListener('input',()=>{
  clearTimeout(tokenSaveTimer);
  tokenSaveTimer=setTimeout(persistTokenIfRemembered,250);
});
els.apiKey.addEventListener('change',persistTokenIfRemembered);
els.rememberKey.addEventListener('change',()=>{
  if(els.rememberKey.checked) persistTokenIfRemembered();
  else clearSavedToken();
  saveSettings();
});
els.testBtn.addEventListener('click',testConnection);
els.saveSettingsBtn.addEventListener('click',()=>{
  try{rehydrateConnectionFields();normalizedEndpoint(els.apiFormat.value,els.endpoint.value);const key=els.apiKey.value.trim()||loadSavedToken();if(!key)throw new Error('Token 还是空的');if(!els.apiKey.value.trim())els.apiKey.value=key;persistTokenIfRemembered();saveSettings();els.settingsStatus.className='settings-status ok';els.settingsStatus.textContent='设置已保存';setConnectionState('ready',isOfficialBase(els.endpoint.value)?'NAI 官网 · Token 已保存':'接口设置已保存');showToast('接口设置已保存');}
  catch(e){els.settingsStatus.className='settings-status bad';els.settingsStatus.textContent=e.message;}
});
els.clearGalleryBtn.addEventListener('click',clearGallery);
els.exportGalleryZipBtn?.addEventListener('click',exportGalleryZip);
els.exportConfigBtn?.addEventListener('click',exportPortableConfig);
els.importConfigBtn?.addEventListener('click',()=>els.importConfigFile?.click());
els.importConfigFile?.addEventListener('change',()=>importPortableConfig(els.importConfigFile.files?.[0]));
els.uploadWatermarkBtn?.addEventListener('click',()=>els.watermarkFile?.click());
els.watermarkFile?.addEventListener('change',async()=>{
  const file=els.watermarkFile.files?.[0];
  if(!file)return;
  const allowed=new Set(['image/png','image/jpeg','image/webp','image/svg+xml']);
  if(!allowed.has(file.type)){showToast('请选择 PNG、JPG、WebP 或 SVG 水印');els.watermarkFile.value='';return;}
  if(file.size>10*1024*1024){showToast('水印文件请控制在 10MB 以内');els.watermarkFile.value='';return;}
  try{
    await saveWatermarkAsset(file);
    await refreshWatermarkUi();
    showToast('水印已保存到这台设备');
  }catch(e){
    console.error(e);
    showToast('水印保存失败');
  }finally{
    els.watermarkFile.value='';
  }
});
els.removeWatermarkBtn?.addEventListener('click',async()=>{
  try{
    await deleteWatermarkAsset();
    await refreshWatermarkUi();
    showToast('水印已移除');
  }catch(e){
    console.error(e);
    showToast('移除水印失败');
  }
});
els.uploadReferenceBtn?.addEventListener('click',()=>els.referenceFile?.click());
els.referenceFile?.addEventListener('change',async()=>{
  const file=els.referenceFile.files?.[0];
  if(!file)return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)){showToast('Reference 请选择 PNG、JPG 或 WebP');els.referenceFile.value='';return;}
  if(file.size>10*1024*1024){showToast('Reference 请控制在 10MB 以内');els.referenceFile.value='';return;}
  try{
    await putLocalAsset('reference',file);
    await refreshReferenceUi();
    els.referenceEnabled.checked=true;
    els.vibeEnabled.checked=false;
    saveSettings();
    showToast('Reference 已添加');
  }catch(e){console.error(e);showToast('Reference 保存失败');}
  finally{els.referenceFile.value='';}
});
els.removeReferenceBtn?.addEventListener('click',async()=>{
  try{
    await removeLocalAsset('reference');
    els.referenceEnabled.checked=false;
    await refreshReferenceUi();
    saveSettings();
    showToast('Reference 已移除');
  }catch(e){console.error(e);showToast('Reference 移除失败');}
});
els.uploadVibeBtn?.addEventListener('click',()=>els.vibeFile?.click());
els.vibeFile?.addEventListener('change',async()=>{
  const file=els.vibeFile.files?.[0];
  if(!file)return;
  const lower=String(file.name||'').toLowerCase();
  const isImage=['image/png','image/jpeg','image/webp'].includes(file.type)||/\.(png|jpe?g|webp)$/.test(lower);
  const isDocument=/\.(json|naiv4vibe|naiv4vibebundle)$/.test(lower);
  if(!isImage&&!isDocument){showToast('支持 PNG、JPG、WebP、JSON、.naiv4vibe、.naiv4vibeBundle');els.vibeFile.value='';return;}
  const limit=isDocument?32*1024*1024:10*1024*1024;
  if(file.size>limit){showToast(isDocument?'Vibe 文件请控制在 32MB 以内':'Vibe 图片请控制在 10MB 以内');els.vibeFile.value='';return;}
  try{
    if(isDocument){
      await importVibeDocumentFile(file);
    }else{
      await putLocalAsset('vibe',file);
      await refreshReferenceUi();
      els.vibeEnabled.checked=true;
      els.referenceEnabled.checked=false;
      els.vibePresetSelect.value='';
      els.deleteVibePresetBtn.disabled=true;
      saveSettings();
      showToast('Vibe 图片已添加');
    }
  }catch(e){console.error(e);showToast((e?.message||'Vibe 导入失败').slice(0,180));}
  finally{els.vibeFile.value='';}
});
els.removeVibeBtn?.addEventListener('click',async()=>{
  try{
    await removeLocalAsset('vibe');
    els.vibeEnabled.checked=false;
    await refreshReferenceUi();
    saveSettings();
    showToast('Vibe 已移除');
  }catch(e){console.error(e);showToast('Vibe 移除失败');}
});
els.vibePresetSelect?.addEventListener('change',()=>{
  applyVibePreset(els.vibePresetSelect.value).catch(e=>{console.error(e);showToast('Vibe 预设载入失败');});
});
els.saveVibePresetBtn?.addEventListener('click',()=>{
  saveCurrentVibePreset().catch(e=>{console.error(e);showToast('Vibe 预设保存失败');});
});
els.deleteVibePresetBtn?.addEventListener('click',()=>{
  deleteSelectedVibePreset().catch(e=>{console.error(e);showToast('Vibe 预设删除失败');});
});
els.referenceEnabled?.addEventListener('change',()=>{
  if(els.referenceEnabled.checked){
    if(!currentReferenceAsset?.blob){els.referenceEnabled.checked=false;showToast('先添加 Reference 图片');return;}
    if(els.vibeEnabled.checked){els.vibeEnabled.checked=false;showToast('已关闭 Vibe：两者不能同时启用');}
  }
  saveSettings();
});
els.vibeEnabled?.addEventListener('change',()=>{
  if(els.vibeEnabled.checked){
    if(!vibeAssetUsable(currentVibeAsset)){els.vibeEnabled.checked=false;showToast('先添加或导入一个 Vibe');return;}
    if(els.referenceEnabled.checked){els.referenceEnabled.checked=false;showToast('已关闭 Reference：两者不能同时启用');}
  }
  saveSettings();
});
els.referenceMode?.addEventListener('change',saveSettings);
for(const [input,value] of [[els.referenceStrength,els.referenceStrengthValue],[els.referenceFidelity,els.referenceFidelityValue],[els.vibeStrength,els.vibeStrengthValue],[els.vibeInformation,els.vibeInformationValue]]){
  input?.addEventListener('input',()=>{value.textContent=Number(input.value).toFixed(2);});
  input?.addEventListener('change',saveSettings);
}
els.watermarkOpacity?.addEventListener('input',()=>{
  els.watermarkOpacityValue.textContent=`${els.watermarkOpacity.value}%`;
});
els.watermarkOpacity?.addEventListener('change',saveSettings);

window.addEventListener('message',async(event)=>{
  const data=event.data;
  if(event.origin!==window.location.origin||!data||data.source!=='isolde-nai-st'||!data.requestId)return;
  if(data.type==='getAnchors'){
    event.source?.postMessage({
      source:'isolde-nai-web',
      requestId:data.requestId,
      ok:true,
      anchors:anchors.map((item)=>({id:item.id,name:item.name})).filter((item)=>item.name)
    },event.origin);
    return;
  }
  if(data.type==='deleteGallery'){
    try{
      const deleted=await deleteGalleryBridgeItem(data);
      event.source?.postMessage({source:'isolde-nai-web',requestId:data.requestId,ok:true,deleted},event.origin);
    }catch(e){
      event.source?.postMessage({source:'isolde-nai-web',requestId:data.requestId,ok:false,error:e?.message||String(e)},event.origin);
    }
    return;
  }
  if(data.type!=='generate')return;
  const scenes=Array.isArray(data.scenes)?data.scenes.map(x=>String(x||'').trim()).filter(Boolean):[];
  const seeds=Array.isArray(data.seeds)?data.seeds:[];
  const promptOverrides=Array.isArray(data.promptOverrides)?data.promptOverrides:[];
  if(!scenes.length){
    event.source?.postMessage({source:'isolde-nai-web',requestId:data.requestId,ok:false,error:'没有收到画面词'},event.origin);
    return;
  }
  const previousScene=els.scenePrompt.value;
  const results=[];
  try{
    for(let i=0;i<scenes.length;i++){
      const scene=scenes[i];
      els.scenePrompt.value=scene;
      updateAssembly();
      const requestedSeed=String(seeds[i]??'').trim();
      const seed=requestedSeed||String(Math.floor(Math.random()*4294967295));
      const override=promptOverrides[i]&&String(promptOverrides[i].positive||'').trim()?promptOverrides[i]:null;
      const automaticPrompt=override||assemblePrompts(false);
      const result=await generate({forceSeed:seed,throwOnError:true,promptOverride:automaticPrompt});
      if(!result?.blob)throw new Error('图片生成没有返回结果');
      results.push({...result,scenePrompt:scene});
    }
    event.source?.postMessage({source:'isolde-nai-web',requestId:data.requestId,ok:true,results},event.origin);
  }catch(e){
    event.source?.postMessage({source:'isolde-nai-web',requestId:data.requestId,ok:false,error:e?.message||String(e)},event.origin);
  }finally{
    els.scenePrompt.value=previousScene;
    updateAssembly();
  }
});

loadState();
window.addEventListener('pageshow',()=>{
  requestAnimationFrame(()=>{
    rehydrateConnectionFields();
    setTimeout(rehydrateConnectionFields,250);
  });
});
window.addEventListener('focus',()=>setTimeout(rehydrateConnectionFields,0));
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden) setTimeout(rehydrateConnectionFields,0);
});
refreshWatermarkUi().catch(e=>console.warn('水印读取失败',e));
refreshReferenceUi().then(()=>saveSettings()).catch(e=>console.warn('Reference / Vibe 读取失败',e));
renderVibePresets().catch(e=>console.warn('Vibe 预设读取失败',e));
if('serviceWorker' in navigator && !new URLSearchParams(location.search).has('embed')) navigator.serviceWorker.register('./sw.js').catch(()=>{});