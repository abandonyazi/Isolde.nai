const $ = (id) => document.getElementById(id);
const OFFICIAL_BASE = 'https://image.novelai.net';
const NAI_PROXY_BASE = 'https://isolde-nai-proxy.abandonyazi.workers.dev';
const SETTINGS_KEY = 'isolde_nai_settings_v2';
const TOKEN_KEY = 'isolde_nai_token_v1';
const THEME_KEY = 'isolde_nai_theme_v1';
const PRESETS_KEY = 'isolde_nai_presets_v1';
const ANCHORS_KEY = 'isolde_nai_anchors_v1';
const API_PRESETS_KEY = 'isolde_nai_api_presets_v1';
const QUICK_WORDS_KEY = 'isolde_nai_quick_words_v1';
const QUICK_WORD_CATEGORIES_KEY = 'isolde_nai_quick_word_categories_v1';
const DB_NAME = 'isolde-nai-gallery';
const DB_VERSION = 4;

const els = {
  tabs: [...document.querySelectorAll('.tab')],
  views: [...document.querySelectorAll('.view')],
  miniStatus: $('miniStatus'), themeToggle: $('themeToggle'),
  connectionBanner: $('connectionBanner'), connectionText: $('connectionText'),
  presetSelect: $('presetSelect'), anchorPicker: $('anchorPicker'),
  scenePrompt: $('scenePrompt'), extraNegative: $('extraNegative'),
  qualityTags: $('qualityTags'), qualityPosition: $('qualityPosition'),
  assembledPrompt: $('assembledPrompt'), assembledNegative: $('assembledNegative'),
  aspect: $('aspect'), model: $('model'), sampler: $('sampler'), width: $('width'), height: $('height'), steps: $('steps'), cfg: $('cfg'), guidanceRescale: $('guidanceRescale'), guidanceRescaleValue: $('guidanceRescaleValue'), guidanceRescaleHint: $('guidanceRescaleHint'), seed: $('seed'),
  clearWorkbenchBtn: $('clearWorkbenchBtn'), randomSeedBtn: $('randomSeedBtn'), jumpAnchorsBtn: $('jumpAnchorsBtn'),
  quickWordsBtn: $('quickWordsBtn'), quickWordsMenu: $('quickWordsMenu'), quickWordsDialog: $('quickWordsDialog'),
  quickWordForm: $('quickWordForm'), quickWordId: $('quickWordId'), quickWordFormCategorySelect: $('quickWordFormCategorySelect'), quickWordName: $('quickWordName'), quickWordPrompt: $('quickWordPrompt'), quickWordList: $('quickWordList'), cancelQuickWordEditBtn: $('cancelQuickWordEditBtn'), saveQuickWordBtn: $('saveQuickWordBtn'),
  addQuickWordCategoryBtn: $('addQuickWordCategoryBtn'), manageQuickWordCategoriesBtn: $('manageQuickWordCategoriesBtn'),
  newQuickWordCategoryForm: $('newQuickWordCategoryForm'), newQuickWordCategoryName: $('newQuickWordCategoryName'),
  quickWordCategoryList: $('quickWordCategoryList'),
  insertAnchorPromptsBtn: $('insertAnchorPromptsBtn'), insertAnchorMenu: $('insertAnchorMenu'),
  generateBtn: $('generateBtn'), generateLabel: $('generateLabel'), generateSpinner: $('generateSpinner'),
  emptyResult: $('emptyResult'), resultWrap: $('resultWrap'), resultImage: $('resultImage'), saveLink: $('saveLink'), saveWatermarkedBtn: $('saveWatermarkedBtn'), regenBtn: $('regenBtn'), newSeedBtn: $('newSeedBtn'),
  presetList: $('presetList'), addPresetBtn: $('addPresetBtn'), inspectNaiBtn: $('inspectNaiBtn'), importChatu8Btn: $('importChatu8Btn'), savePresetBtn: $('savePresetBtn'), presetDialog: $('presetDialog'), presetForm: $('presetForm'), presetDialogTitle: $('presetDialogTitle'), presetId: $('presetId'), presetName: $('presetName'), presetArtist: $('presetArtist'), presetPositive: $('presetPositive'), presetNegative: $('presetNegative'),
  naiInspectDialog: $('naiInspectDialog'), naiInspectFile: $('naiInspectFile'), chooseNaiInspectBtn: $('chooseNaiInspectBtn'), replaceNaiInspectBtn: $('replaceNaiInspectBtn'), naiInspectEmpty: $('naiInspectEmpty'), naiInspectResult: $('naiInspectResult'), naiInspectPreview: $('naiInspectPreview'), naiInspectFileName: $('naiInspectFileName'), naiInspectSource: $('naiInspectSource'), naiInspectPresetName: $('naiInspectPresetName'), naiInspectArtist: $('naiInspectArtist'), naiInspectPositive: $('naiInspectPositive'), naiInspectNegative: $('naiInspectNegative'), naiInspectParams: $('naiInspectParams'), addInspectedPresetBtn: $('addInspectedPresetBtn'),
  anchorList: $('anchorList'), addAnchorBtn: $('addAnchorBtn'), addOutfitBtn: $('addOutfitBtn'), saveAnchorBtn: $('saveAnchorBtn'), anchorDialog: $('anchorDialog'), anchorForm: $('anchorForm'), anchorDialogTitle: $('anchorDialogTitle'), anchorId: $('anchorId'), anchorName: $('anchorName'), anchorPrompt: $('anchorPrompt'), anchorOutfitList: $('anchorOutfitList'),
  outfitDialog: $('outfitDialog'), outfitForm: $('outfitForm'), outfitName: $('outfitName'), outfitPrompt: $('outfitPrompt'), outfitCharacterList: $('outfitCharacterList'), saveOutfitBtn: $('saveOutfitBtn'),
  workbenchOutfitPicker: $('workbenchOutfitPicker'),
  galleryGrid: $('galleryGrid'), galleryCount: $('galleryCount'), galleryPresetFilter: $('galleryPresetFilter'), galleryPagination: $('galleryPagination'), clearGalleryBtn: $('clearGalleryBtn'), batchDeleteGalleryBtn: $('batchDeleteGalleryBtn'),
  galleryViewer: $('galleryViewer'), galleryViewerImage: $('galleryViewerImage'), galleryViewerClose: $('galleryViewerClose'), galleryViewerPrev: $('galleryViewerPrev'), galleryViewerNext: $('galleryViewerNext'), galleryViewerCounter: $('galleryViewerCounter'), galleryViewerMeta: $('galleryViewerMeta'),
  galleryExportProgressWrap: $('galleryExportProgressWrap'), galleryExportProgressBar: $('galleryExportProgressBar'), galleryExportProgressText: $('galleryExportProgressText'), galleryExportProgressPercent: $('galleryExportProgressPercent'), downloadGalleryZipBtn: $('downloadGalleryZipBtn'),
  apiPresetSelect: $('apiPresetSelect'), renameApiPresetBtn: $('renameApiPresetBtn'), deleteApiPresetBtn: $('deleteApiPresetBtn'),
  renameApiPresetDialog: $('renameApiPresetDialog'), renameApiPresetForm: $('renameApiPresetForm'), renameApiPresetInput: $('renameApiPresetInput'), saveApiPresetNameBtn: $('saveApiPresetNameBtn'),
  apiFormat: $('apiFormat'), endpoint: $('endpoint'), apiKey: $('apiKey'), rememberKey: $('rememberKey'), keepNaiMetadata: $('keepNaiMetadata'), toggleKeyBtn: $('toggleKeyBtn'), testBtn: $('testBtn'), saveSettingsBtn: $('saveSettingsBtn'), exportGalleryZipBtn: $('exportGalleryZipBtn'), exportConfigBtn: $('exportConfigBtn'), importConfigBtn: $('importConfigBtn'), importConfigFile: $('importConfigFile'), settingsStatus: $('settingsStatus'),
  deleteConfirmDialog: $('deleteConfirmDialog'), deleteConfirmTitle: $('deleteConfirmTitle'), deleteConfirmText: $('deleteConfirmText'), cancelDeleteBtn: $('cancelDeleteBtn'), confirmDeleteBtn: $('confirmDeleteBtn'),
  watermarkFile: $('watermarkFile'), uploadWatermarkBtn: $('uploadWatermarkBtn'), removeWatermarkBtn: $('removeWatermarkBtn'), watermarkOpacity: $('watermarkOpacity'), watermarkOpacityValue: $('watermarkOpacityValue'), watermarkPreviewWrap: $('watermarkPreviewWrap'), watermarkPreview: $('watermarkPreview'), watermarkStatus: $('watermarkStatus'),
  referenceModelHint: $('referenceModelHint'), referenceEnabled: $('referenceEnabled'), referenceFile: $('referenceFile'), uploadReferenceBtn: $('uploadReferenceBtn'), removeReferenceBtn: $('removeReferenceBtn'), referencePreviewWrap: $('referencePreviewWrap'), referencePreview: $('referencePreview'), referenceStatus: $('referenceStatus'), referenceMode: $('referenceMode'), referenceStrength: $('referenceStrength'), referenceStrengthValue: $('referenceStrengthValue'), referenceFidelity: $('referenceFidelity'), referenceFidelityValue: $('referenceFidelityValue'),
  vibeEnabled: $('vibeEnabled'), vibeFile: $('vibeFile'), uploadVibeBtn: $('uploadVibeBtn'), removeVibeBtn: $('removeVibeBtn'), vibePreviewWrap: $('vibePreviewWrap'), vibePreview: $('vibePreview'), vibeStatus: $('vibeStatus'), vibeStackSummary: $('vibeStackSummary'), vibeItemsEditor: $('vibeItemsEditor'), vibePresetSelect: $('vibePresetSelect'), loadVibePresetBtn: $('loadVibePresetBtn'), appendVibePresetBtn: $('appendVibePresetBtn'), saveVibePresetBtn: $('saveVibePresetBtn'), deleteVibePresetBtn: $('deleteVibePresetBtn'), vibeStrength: $('vibeStrength'), vibeStrengthValue: $('vibeStrengthValue'), vibeInformation: $('vibeInformation'), vibeInformationValue: $('vibeInformationValue'),
  toast: $('toast')
};

let settings = {};
let presets = [];
let anchors = [];
let apiPresets = [];
let quickWords = [];
let quickWordCategories = [];
let quickWordsActiveCategory = '';
let selectedAnchorIds = [];
let selectedOutfitIds = {};
const GALLERY_PAGE_SIZE = 30;
const VIBE_LIMIT = 16;
let galleryBatchMode = false;
let selectedGalleryIds = new Set();
let galleryPage = 1;
let galleryPresetFilter = '';
let galleryViewerItems = [];
let galleryViewerIndex = -1;
let galleryViewerObjectUrl = null;
let galleryViewerPointerStartX = null;
let galleryViewerPointerStartY = null;
let pendingDeleteAction = null;
let currentObjectUrl = null;
let currentResultBlob = null;
let currentSeed = '';
let busy = false;
let toastTimer = null;
let sceneInsertSelection = null;
let currentWatermarkAsset = null;
let watermarkPreviewUrl = null;
let currentReferenceAsset = null;
let currentVibeAsset = null;
let referencePreviewUrl = null;
let vibePreviewUrl = null;
let naiInspectPreviewUrl = null;
let currentNaiInspect = null;
let zipWorkerReady = false;
let zipWorkerInitPromise = null;
let preparedGalleryZip = null;



function pingZipWorker(){
  return new Promise((resolve)=>{
    const worker=navigator.serviceWorker?.controller;
    if(!worker){ resolve(false); return; }
    const channel=new MessageChannel();
    const timer=setTimeout(()=>resolve(false),900);
    channel.port1.onmessage=(event)=>{
      clearTimeout(timer);
      resolve(Boolean(event.data?.ok&&event.data?.feature==='isolde-zip-stream-v2'));
    };
    try{
      worker.postMessage({type:'ISOLDE_ZIP_PING'},[channel.port2]);
    }catch{
      clearTimeout(timer);
      resolve(false);
    }
  });
}
async function initZipWorker(){
  if(zipWorkerInitPromise) return zipWorkerInitPromise;
  zipWorkerInitPromise=(async()=>{
    if(!('serviceWorker' in navigator)||new URLSearchParams(location.search).has('embed')) return false;
    const btn=els.exportGalleryZipBtn;
    if(btn) btn.disabled=true;
    try{
      const reg=await navigator.serviceWorker.register('./sw.js?v=100',{updateViaCache:'none'});
      await reg.update().catch(()=>{});
      for(let i=0;i<24;i++){
        if(await pingZipWorker()){
          zipWorkerReady=true;
          return true;
        }
        await new Promise(r=>setTimeout(r,150));
      }
      return false;
    }finally{
      if(btn) btn.disabled=false;
    }
  })();
  return zipWorkerInitPromise;
}
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
let themeProbeTimer = null;

function isStandalonePwa() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function timeTheme(now = new Date()) {
  const hour = now.getHours();
  return hour >= 19 || hour < 7 ? 'dark' : 'light';
}

function systemTheme() {
  if (isStandalonePwa()) return timeTheme();
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readThemeOverride() {
  const raw = localStorage.getItem(THEME_KEY);
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    if ((saved?.theme === 'dark' || saved?.theme === 'light') &&
        (saved?.systemAtOverride === 'dark' || saved?.systemAtOverride === 'light')) {
      return saved;
    }
  } catch {
    if (raw === 'dark' || raw === 'light') {
      const saved = { theme: raw, systemAtOverride: systemTheme() };
      localStorage.setItem(THEME_KEY, JSON.stringify(saved));
      return saved;
    }
  }
  localStorage.removeItem(THEME_KEY);
  return null;
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
    els.themeToggle.title = '临时切换主题，下次自动切换后恢复跟随';
  }
}

function syncThemeImmediately() {
  const saved = readThemeOverride();
  applyTheme(saved?.theme || systemTheme());
}

function followSystemTheme(theme = systemTheme()) {
  clearTimeout(themeProbeTimer);
  themeProbeTimer = null;
  localStorage.removeItem(THEME_KEY);
  applyTheme(theme);
}

function verifySystemThemeAfterResume() {
  clearTimeout(themeProbeTimer);
  const saved = readThemeOverride();

  if (!saved) {
    applyTheme(systemTheme());
    return;
  }

  // Keep manual choice while iOS/PWA settles after opening/foregrounding.
  applyTheme(saved.theme);

  const samples = [systemTheme()];
  setTimeout(() => samples.push(systemTheme()), 260);
  setTimeout(() => samples.push(systemTheme()), 760);
  themeProbeTimer = setTimeout(() => {
    samples.push(systemTheme());
    themeProbeTimer = null;

    const stable = samples.length === 4 && samples.every((value) => value === samples[0]);
    if (!stable) {
      verifySystemThemeAfterResume();
      return;
    }

    const confirmed = samples[0];
    if (confirmed !== saved.systemAtOverride) followSystemTheme(confirmed);
    else applyTheme(saved.theme);
  }, 1450);
}

function handleSystemThemeChange(event) {
  const next = isStandalonePwa()
    ? timeTheme()
    : (typeof event?.matches === 'boolean'
      ? (event.matches ? 'dark' : 'light')
      : systemTheme());
  followSystemTheme(next);
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
function updateGuidanceRescaleUi() {
  if (!els.guidanceRescale) return;
  const value = clampNumber(els.guidanceRescale.value,0,1,.32);
  els.guidanceRescale.value = String(value);
  if (els.guidanceRescaleValue) els.guidanceRescaleValue.textContent = value.toFixed(2);
  const unsupported = els.model?.value?.includes('full-medium');
  els.guidanceRescale.disabled = Boolean(unsupported);
  if (els.guidanceRescaleHint) {
    els.guidanceRescaleHint.textContent = unsupported
      ? 'V5 Full Medium 不支持 Prompt Guidance Rescale。'
      : '高 CFG 时缓和过饱和和过硬的颜色边缘。';
    els.guidanceRescaleHint.classList.toggle('warning',Boolean(unsupported));
  }
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
  if (els.apiFormat.value === 'nai' && !els.endpoint.value.trim()) els.endpoint.value = OFFICIAL_BASE;
}
function apiPresetDefaultLabel(item) {
  try {
    const host = new URL(item.endpoint).host || item.endpoint;
    return `${item.apiFormat === 'nai' ? 'NovelAI' : 'OpenAI'} · ${host}`;
  } catch {
    return `${item.apiFormat === 'nai' ? 'NovelAI' : 'OpenAI'} · ${item.endpoint || '未命名'}`;
  }
}
function apiPresetLabel(item) {
  return String(item?.name || '').trim() || apiPresetDefaultLabel(item);
}
function renderApiPresets() {
  if (!els.apiPresetSelect) return;
  const current = settings.apiPresetId || els.apiPresetSelect.value || '';
  els.apiPresetSelect.innerHTML = '<option value="">选择已保存的 API 预设</option>';
  for (const item of apiPresets) {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = apiPresetLabel(item);
    els.apiPresetSelect.appendChild(option);
  }
  els.apiPresetSelect.value = apiPresets.some(item => item.id === current) ? current : '';
  const hasCurrent = Boolean(els.apiPresetSelect.value);
  if (els.renameApiPresetBtn) els.renameApiPresetBtn.disabled = !hasCurrent;
  if (els.deleteApiPresetBtn) els.deleteApiPresetBtn.disabled = !hasCurrent;
}
function saveCurrentApiPreset() {
  const endpoint = normalizeBase(els.endpoint.value);
  const apiFormat = els.apiFormat.value;
  const token = els.rememberKey.checked ? (els.apiKey.value.trim() || loadSavedToken()) : '';
  let item = apiPresets.find(p => p.apiFormat === apiFormat && p.endpoint === endpoint);
  if (!item) {
    item = { id: uid('api'), apiFormat, endpoint, token, rememberKey: els.rememberKey.checked, updatedAt: Date.now() };
    apiPresets.unshift(item);
  } else {
    Object.assign(item, { token, rememberKey: els.rememberKey.checked, updatedAt: Date.now() });
  }
  saveJson(API_PRESETS_KEY, apiPresets);
  settings.apiPresetId = item.id;
  saveJson(SETTINGS_KEY, settings);
  renderApiPresets();
  els.apiPresetSelect.value = item.id;
  els.deleteApiPresetBtn.disabled = false;
  return item;
}
function applyApiPreset(id) {
  const item = apiPresets.find(p => p.id === id);
  if (!item) return;
  els.apiFormat.value = item.apiFormat || 'nai';
  els.endpoint.value = item.endpoint || OFFICIAL_BASE;
  els.rememberKey.checked = item.rememberKey !== false;
  els.apiKey.value = item.token || '';
  if (els.rememberKey.checked && item.token) localStorage.setItem(TOKEN_KEY, item.token);
  else clearSavedToken();
  settings.apiPresetId = item.id;
  updateEndpointUi();
  saveSettings();
  els.settingsStatus.className = 'settings-status ok';
  els.settingsStatus.textContent = `已切换到 ${apiPresetLabel(item)}`;
  setConnectionState(item.token ? 'ready' : '', item.token ? 'API 预设已载入' : 'API 预设已载入 · 等待 Token');
  renderApiPresets();
}
function openRenameApiPreset() {
  const id = els.apiPresetSelect?.value;
  const item = apiPresets.find(p => p.id === id);
  if (!item) return;
  els.renameApiPresetInput.value = String(item.name || '').trim() || apiPresetDefaultLabel(item);
  els.renameApiPresetDialog.showModal();
  requestAnimationFrame(() => { els.renameApiPresetInput.focus(); els.renameApiPresetInput.select(); });
}
function saveRenamedApiPreset(event) {
  event?.preventDefault?.();
  const id = els.apiPresetSelect?.value;
  const item = apiPresets.find(p => p.id === id);
  if (!item) { els.renameApiPresetDialog.close(); return; }
  const name = els.renameApiPresetInput.value.trim();
  if (!name) { els.renameApiPresetInput.focus(); return; }
  item.name = name.slice(0,60);
  item.updatedAt = Date.now();
  saveJson(API_PRESETS_KEY, apiPresets);
  renderApiPresets();
  els.apiPresetSelect.value = id;
  settings.apiPresetId = id;
  saveJson(SETTINGS_KEY, settings);
  els.renameApiPresetDialog.close();
  showToast('API 预设名称已修改');
}
function deleteCurrentApiPreset() {
  const id = els.apiPresetSelect?.value;
  const item = apiPresets.find(p => p.id === id);
  if (!item) return;
  requestDeleteConfirmation({
    title:'删除这个 API 预设？',
    message:`将删除「${apiPresetLabel(item)}」预设，不会影响已生成的图片。`,
    confirmText:'删除预设',
    action:async()=>{
      apiPresets = apiPresets.filter(p => p.id !== id);
      saveJson(API_PRESETS_KEY, apiPresets);
      if (settings.apiPresetId === id) settings.apiPresetId = '';
      saveJson(SETTINGS_KEY, settings);
      renderApiPresets();
      showToast('API 预设已删除');
    }
  });
}
function requestDeleteConfirmation({title='确认删除？', message='', confirmText='确认删除', action}) {
  pendingDeleteAction = action;
  els.deleteConfirmTitle.textContent = title;
  els.deleteConfirmText.textContent = message;
  els.confirmDeleteBtn.textContent = confirmText;
  els.confirmDeleteBtn.disabled = false;
  els.cancelDeleteBtn.disabled = false;
  els.deleteConfirmDialog.showModal();
}
function loadState() {
  settings = loadJson(SETTINGS_KEY, {});
  presets = loadJson(PRESETS_KEY, []);
  anchors = loadJson(ANCHORS_KEY, []);
  apiPresets = loadJson(API_PRESETS_KEY, []);
  quickWords = loadJson(QUICK_WORDS_KEY, []);
  quickWordCategories = loadJson(QUICK_WORD_CATEGORIES_KEY, []);

  const oldSamples = new Map([
    ['特写','close-up, face focus'],
    ['全身','full body'],
    ['哭哭','crying, teary eyes'],
    ['仰拍','low angle'],
    ['回头','looking back over shoulder'],
    ['伸手','reaching toward camera']
  ]);
  quickWords = quickWords.filter(item => {
    const sample = oldSamples.get(String(item?.name||'').trim());
    return !(sample && String(item?.prompt||'').trim() === sample && !String(item?.categoryId||'').trim() && !String(item?.category||'').trim());
  });

  // Migrate old string categories into independent category objects.
  const categoryByName = new Map(quickWordCategories.map(item => [String(item?.name||'').trim(), item]).filter(([name])=>name));
  for (const item of quickWords) {
    if (item.categoryId && quickWordCategories.some(category=>category.id===item.categoryId)) continue;
    const oldName = String(item.category||'').trim();
    if (!oldName) continue;
    let category = categoryByName.get(oldName);
    if (!category) {
      category = {id:uid('qwc'),name:oldName,createdAt:Date.now()};
      quickWordCategories.push(category);
      categoryByName.set(oldName,category);
    }
    item.categoryId = category.id;
    delete item.category;
  }
  quickWords = quickWords.filter(item => item.categoryId && quickWordCategories.some(category=>category.id===item.categoryId));
  saveJson(QUICK_WORDS_KEY, quickWords);
  saveJson(QUICK_WORD_CATEGORIES_KEY, quickWordCategories);
  quickWordsActiveCategory = quickWordCategories[0]?.id || '';

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
  selectedAnchorIds = Array.isArray(settings.selectedAnchorIds) ? settings.selectedAnchorIds.filter(id=>anchors.some(anchor=>anchor.id===id)) : [];
  selectedOutfitIds = settings.selectedOutfitIds && typeof settings.selectedOutfitIds === 'object' && !Array.isArray(settings.selectedOutfitIds)
    ? {...settings.selectedOutfitIds}
    : {};
  for (const [anchorId,outfitId] of Object.entries(selectedOutfitIds)) {
    const anchor=anchors.find(item=>item.id===anchorId);
    const outfits=Array.isArray(anchor?.outfits)?anchor.outfits:[];
    if(!anchor||!outfits.some(item=>item?.id===outfitId)) delete selectedOutfitIds[anchorId];
  }
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
  els.cfg.value = settings.cfg ?? 5;
  els.guidanceRescale.value = String(clampNumber(settings.guidanceRescale,0,1,.32));
  updateGuidanceRescaleUi();
  els.seed.value = '';
  els.qualityTags.value = settings.qualityTags || 'masterpiece, best quality, very aesthetic';
  els.qualityPosition.value = settings.qualityPosition || 'prefix';
  els.scenePrompt.value = settings.scenePrompt || '';
  els.extraNegative.value = settings.extraNegative || '';
  els.watermarkOpacity.value = String(Number.isFinite(Number(settings.watermarkOpacity)) ? Math.max(0,Math.min(100,Number(settings.watermarkOpacity))) : 100);
  els.watermarkOpacityValue.textContent = `${els.watermarkOpacity.value}%`;
  if (els.keepNaiMetadata) els.keepNaiMetadata.checked = settings.keepNaiMetadata === true;
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
  renderApiPresets();
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
    steps: Number(els.steps.value), cfg: Number(els.cfg.value), guidanceRescale: Number(els.guidanceRescale.value),
    qualityTags: els.qualityTags.value.trim(),
    qualityPosition: els.qualityPosition.value,
    scenePrompt: els.scenePrompt.value,
    extraNegative: els.extraNegative.value,
    watermarkOpacity: Number(els.watermarkOpacity.value),
    keepNaiMetadata: els.keepNaiMetadata?.checked === true,
    referenceEnabled: els.referenceEnabled.checked,
    referenceMode: els.referenceMode.value,
    referenceStrength: Number(els.referenceStrength.value),
    referenceFidelity: Number(els.referenceFidelity.value),
    vibeEnabled: els.vibeEnabled.checked,
    vibeStrength: Number(els.vibeStrength.value),
    vibeInformation: Number(els.vibeInformation.value),
    presetId: els.presetSelect.value,
    selectedAnchorIds,
    selectedOutfitIds,
    apiPresetId: settings.apiPresetId || ''
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
function anchorOutfits(anchor) {
  return Array.isArray(anchor?.outfits) ? anchor.outfits.filter(item=>item&&typeof item==='object') : [];
}
function selectedOutfit(anchor) {
  if(!anchor)return null;
  const id=selectedOutfitIds[anchor.id];
  return id ? anchorOutfits(anchor).find(item=>item.id===id) || null : null;
}
function outfitPromptForAnchor(anchor) {
  if(!anchor || !selectedAnchorIds.includes(anchor.id)) return '';
  return String(selectedOutfit(anchor)?.prompt||'').trim();
}
function anchorPromptWithOutfit(anchor) {
  return cleanJoin([String(anchor?.prompt||''), outfitPromptForAnchor(anchor)]);
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
    const prompt = anchorPromptWithOutfit(anchor).trim();
    return prompt || match;
  });
}
function applyQualityTags(prompt) {
  const mode = els.qualityPosition.value;
  const q = els.qualityTags.value.trim().replace(/[\s,]+$/,'');
  const p = prompt.trim();
  if (mode === 'off' || !q) return p;
  if (mode === 'prefix') return p ? `${q}, ${p}` : q;
  return p ? `${p.replace(/[\s,]+$/,'')}, ${q}` : q;
}
function stripCharacterPlaceholders(text) {
  return String(text || '')
    .replace(/\[([^\[\]\r\n]{1,100})\]/g, (match, rawName) => anchors.some(a => a.name === rawName.trim()) ? '' : match)
    .replace(/(?:,\s*){2,}/g, ', ')
    .replace(/^[,\s]+|[,\s]+$/g, '');
}
function characterSubjectTag(prompt) {
  return String(prompt || '').split(',').map(part => part.trim()).find(tag =>
    /^\d+\s*(?:girls?|boys?|women?|men|woman|man|others?|people|persons?)$/i.test(tag)
  ) || '';
}
function hasCharacterSubjectTag(prompt) {
  return String(prompt || '').split(',').some(part =>
    /^\d+\s*(?:girls?|boys?|women?|men|woman|man|others?|people|persons?)$/i.test(part.trim())
  );
}
function stripCharacterSubjectTags(prompt) {
  return String(prompt || '').split(',').map(part => part.trim()).filter(Boolean).filter(tag =>
    !/^\d+\s*(?:girls?|boys?|women?|men|woman|man|others?|people|persons?)$/i.test(tag)
  ).join(', ');
}
function characterSubjectTags(prompt) {
  return String(prompt || '').split(',').map(part => part.trim()).filter(tag =>
    /^\d+\s*(?:girls?|boys?|women?|men|woman|man|others?|people|persons?)$/i.test(tag)
  );
}
function subjectTagsFromAnchors(items) {
  return items.map(anchor => characterSubjectTag(anchor?.prompt || '')).filter(Boolean);
}
function orderedAnchorAppearance(items) {
  return items.map(anchor => cleanJoin([
    stripCharacterSubjectTags(anchor?.prompt || ''),
    stripCharacterSubjectTags(outfitPromptForAnchor(anchor))
  ])).filter(Boolean);
}
function assemblePrompts(includeSelectedAnchors = true) {
  const preset = currentPreset();
  const presetPrompt = cleanJoin([preset?.artist || '', preset?.positive || '']);

  // Keep the user's scene prompt intact and place the whole block last.
  // TEXT:, if present, is ordinary scene-prompt content authored by the user.
  const scenePrompt = els.scenePrompt.value;

  const promptWithScene = cleanJoin([presetPrompt, scenePrompt]);
  const explicitPlaceholderNames = characterPlaceholderNames(promptWithScene);
  const chosenAnchors = [];
  const seenAnchors = new Set();
  const addAnchor = (anchor) => {
    if (!anchor || seenAnchors.has(anchor.id)) return;
    seenAnchors.add(anchor.id);
    chosenAnchors.push(anchor);
  };

  if (includeSelectedAnchors) {
    selectedAnchors().filter(a=>!explicitPlaceholderNames.has(a.name)).forEach(addAnchor);
  }
  explicitPlaceholderNames.forEach(name => addAnchor(anchors.find(a => a.name === name)));

  const selectedForBase = includeSelectedAnchors
    ? selectedAnchors().filter(a=>!explicitPlaceholderNames.has(a.name))
    : [];
  const orderedAnchors = [...selectedForBase];
  explicitPlaceholderNames.forEach(name => {
    const anchor = anchors.find(a=>a.name===name);
    if(anchor && !orderedAnchors.some(a=>a.id===anchor.id)) orderedAnchors.push(anchor);
  });

  // NAI-recommended broad order:
  // subject count/type -> character appearance -> style/artist/quality -> scene -> TEXT.
  // Preserve each saved anchor's internal appearance order rather than guessing tag semantics.
  const presetSubjectTags = characterSubjectTags(presetPrompt);
  const subjectTags = presetSubjectTags.length ? presetSubjectTags : subjectTagsFromAnchors(orderedAnchors);
  const appearanceParts = orderedAnchorAppearance(orderedAnchors);
  const presetWithoutPlaceholders = stripCharacterPlaceholders(presetPrompt);
  const presetWithoutSubjects = stripCharacterSubjectTags(presetWithoutPlaceholders);
  const styledPreset = applyQualityTags(presetWithoutSubjects);
  const sceneVisualWithoutPlaceholders = stripCharacterPlaceholders(scenePrompt);

  const positiveVisual = cleanJoin([
    ...subjectTags,
    ...appearanceParts,
    styledPreset,
    sceneVisualWithoutPlaceholders
  ]);
  const positive = positiveVisual;

  const negative = cleanJoin([preset?.negative || '', els.extraNegative.value]);

  if (!supportsCharacterPrompts(els.model.value) || !chosenAnchors.length) {
    return { positive, basePositive: positive, negative, characters: [] };
  }

  // Character-capable models keep full appearance in char_captions.
  // The base prompt keeps only the subject count/type, then style, then scene.
  const baseSubjectTags = presetSubjectTags.length ? presetSubjectTags : subjectTagsFromAnchors(chosenAnchors);
  const baseVisual = cleanJoin([
    ...baseSubjectTags,
    styledPreset,
    sceneVisualWithoutPlaceholders
  ]);
  const basePositive = baseVisual;

  return {
    positive,
    basePositive,
    negative,
    characters: chosenAnchors.map(anchor => ({ name: anchor.name, anchor: anchor.name, prompt: '' })),
  };
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
function closeWorkbenchOutfitPicker() {
  if(!els.workbenchOutfitPicker)return;
  els.workbenchOutfitPicker.innerHTML='';
  els.workbenchOutfitPicker.classList.add('hidden');
}
function renderWorkbenchOutfitPicker(anchor) {
  const box=els.workbenchOutfitPicker;
  const outfits=anchorOutfits(anchor);
  if(!box||!anchor||!outfits.length){closeWorkbenchOutfitPicker();return;}
  box.innerHTML='';
  box.classList.remove('hidden');

  const head=document.createElement('div');
  head.className='workbench-outfit-head';
  const title=document.createElement('strong');
  title.textContent=`${anchor.name} · 服设`;
  const hint=document.createElement('span');
  hint.textContent='选一套，或保持不穿服设';
  head.append(title,hint);
  box.appendChild(head);

  const choices=document.createElement('div');
  choices.className='workbench-outfit-choices';
  const none=document.createElement('button');
  none.type='button'; none.className='outfit-choice';
  none.textContent='不使用服设';
  none.classList.toggle('selected',!selectedOutfit(anchor));
  none.addEventListener('click',()=>{
    delete selectedOutfitIds[anchor.id];
    closeWorkbenchOutfitPicker();
    renderAnchorPicker();
    updateAssembly();
  });
  choices.appendChild(none);

  for(const outfit of outfits){
    const button=document.createElement('button');
    button.type='button'; button.className='outfit-choice';
    button.textContent=outfit.name||'未命名服设';
    button.classList.toggle('selected',selectedOutfit(anchor)?.id===outfit.id);
    button.addEventListener('click',()=>{
      selectedOutfitIds[anchor.id]=outfit.id;
      closeWorkbenchOutfitPicker();
      renderAnchorPicker();
      updateAssembly();
    });
    choices.appendChild(button);
  }
  box.appendChild(choices);
}
function renderAnchorPicker() {
  els.anchorPicker.innerHTML = '';
  if (!anchors.length) {
    const note = document.createElement('div');
    note.className = 'empty-note'; note.textContent = '还没有角色锚点';
    els.anchorPicker.appendChild(note); closeWorkbenchOutfitPicker(); return;
  }
  for (const a of anchors) {
    const b = document.createElement('button');
    const active=selectedAnchorIds.includes(a.id);
    const outfit=active?selectedOutfit(a):null;
    b.type='button'; b.className='anchor-chip';
    b.textContent=outfit ? `${a.name} · ${outfit.name||'服设'}` : a.name;
    b.classList.toggle('selected',active);
    b.addEventListener('click',()=>{
      if(selectedAnchorIds.includes(a.id)){
        selectedAnchorIds=selectedAnchorIds.filter(id=>id!==a.id);
        delete selectedOutfitIds[a.id];
        closeWorkbenchOutfitPicker();
        renderAnchorPicker();
        updateAssembly();
        return;
      }
      selectedAnchorIds=[...selectedAnchorIds,a.id];
      renderAnchorPicker();
      updateAssembly();
      if(anchorOutfits(a).length) renderWorkbenchOutfitPicker(a);
      else closeWorkbenchOutfitPicker();
    });
    els.anchorPicker.appendChild(b);
  }
}
function selectedAnchorList() {
  return selectedAnchorIds.map(id=>anchors.find(anchor=>anchor.id===id)).filter(Boolean);
}
function rememberSceneInsertSelection() {
  const textarea=els.scenePrompt;
  const current=String(textarea.value||'');
  const start=Number.isInteger(textarea.selectionStart)?textarea.selectionStart:current.length;
  const end=Number.isInteger(textarea.selectionEnd)?textarea.selectionEnd:start;
  sceneInsertSelection={start,end};
}
function insertAnchorPrompts(items) {
  const selected=Array.isArray(items)?items.filter(Boolean):[];
  if(!selected.length){showToast('先选角色锚点');return;}
  const prompts=selected
    .map(anchor=>anchorPromptWithOutfit(anchor).trim().replace(/[,\s]+$/g,''))
    .filter(Boolean);
  if(!prompts.length){showToast('选中的角色还没有外观词');return;}

  const textarea=els.scenePrompt;
  const current=String(textarea.value||'');
  const saved=sceneInsertSelection||{};
  const start=Number.isInteger(saved.start)?Math.min(saved.start,current.length):(Number.isInteger(textarea.selectionStart)?textarea.selectionStart:current.length);
  const end=Number.isInteger(saved.end)?Math.min(saved.end,current.length):(Number.isInteger(textarea.selectionEnd)?textarea.selectionEnd:start);
  const before=current.slice(0,start);
  const after=current.slice(end);
  const anchorText=prompts.join(',\n');

  const leftNeedsSep=before&&!/[\s,]$/.test(before);
  const rightNeedsSep=after&&!/^[\s,]/.test(after);
  const inserted=`${leftNeedsSep?', ':''}${anchorText}${rightNeedsSep?', ':''}`;

  textarea.value=before+inserted+after;
  updateAssembly();
  textarea.focus();
  const caret=before.length+inserted.length;
  textarea.setSelectionRange(caret,caret);
  sceneInsertSelection={start:caret,end:caret};
  els.insertAnchorMenu?.classList.add('hidden');
  showToast(selected.length>1?`已插入 ${selected.length} 个角色词`:`已插入「${selected[0].name}」角色词`);
}
function renderInsertAnchorMenu() {
  const menu=els.insertAnchorMenu;
  if(!menu)return;
  const selected=selectedAnchorList();
  menu.innerHTML='';
  if(!selected.length){menu.classList.add('hidden');showToast('先选角色锚点');return;}
  if(selected.length===1){insertAnchorPrompts(selected);return;}

  for(const anchor of selected){
    const b=document.createElement('button');
    b.type='button';
    b.className='scene-insert-option';
    b.textContent=anchor.name;
    b.addEventListener('click',(event)=>{event.stopPropagation();insertAnchorPrompts([anchor]);});
    menu.appendChild(b);
  }
  const all=document.createElement('button');
  all.type='button';
  all.className='scene-insert-option scene-insert-all';
  all.textContent='全部';
  all.addEventListener('click',(event)=>{event.stopPropagation();insertAnchorPrompts(selected);});
  menu.appendChild(all);
  menu.classList.toggle('hidden',!menu.classList.contains('hidden'));
}

function currentQuickWordCategory() {
  return quickWordCategories.find(item=>item.id===quickWordsActiveCategory) || null;
}
function ensureQuickWordActiveCategory() {
  if(!quickWordCategories.some(item=>item.id===quickWordsActiveCategory)) {
    quickWordsActiveCategory = quickWordCategories[0]?.id || '';
  }
  return quickWordsActiveCategory;
}
function quickWordCategoryName(id) {
  return quickWordCategories.find(item=>item.id===id)?.name || '未分类';
}
function renderQuickWordCategorySelect() {
  ensureQuickWordActiveCategory();
  const select=els.quickWordFormCategorySelect;
  if(select){
    select.innerHTML='';
    if(!quickWordCategories.length){
      const option=document.createElement('option');option.value='';option.textContent='先新建分类';select.appendChild(option);select.disabled=true;
    }else{
      select.disabled=false;
      for(const category of quickWordCategories){
        const option=document.createElement('option');option.value=category.id;option.textContent=category.name;select.appendChild(option);
      }
      select.value=quickWordsActiveCategory;
    }
  }
  if(els.saveQuickWordBtn)els.saveQuickWordBtn.disabled=!quickWordCategories.length;
}
function insertTextAtSceneCaret(text,label='快捷词') {
  const value=String(text||'').trim().replace(/^[,\s]+|[,\s]+$/g,'');
  if(!value)return;
  const textarea=els.scenePrompt;
  const current=String(textarea.value||'');
  const saved=sceneInsertSelection||{};
  const start=Number.isInteger(saved.start)?Math.min(saved.start,current.length):(Number.isInteger(textarea.selectionStart)?textarea.selectionStart:current.length);
  const end=Number.isInteger(saved.end)?Math.min(saved.end,current.length):(Number.isInteger(textarea.selectionEnd)?textarea.selectionEnd:start);
  const rawBefore=current.slice(0,start);
  const before=rawBefore.replace(/\s*$/,'');
  const after=current.slice(end).replace(/^[,\s]+/,'');
  const prefix=before?(before.endsWith(',')?' ':', '):'';
  const inserted=`${prefix}${value}, `;
  textarea.value=before+inserted+after;
  const caret=(before+inserted).length;
  textarea.focus();textarea.setSelectionRange(caret,caret);
  sceneInsertSelection={start:caret,end:caret};
  els.quickWordsMenu?.classList.add('hidden');
  updateAssembly();
  showToast(`已插入「${label}」`);
}
function resetQuickWordEditor() {
  if(!els.quickWordForm)return;
  els.quickWordId.value='';
  if(els.quickWordFormCategorySelect)els.quickWordFormCategorySelect.value=quickWordsActiveCategory||'';
  els.quickWordName.value='';
  els.quickWordPrompt.value='';
  els.cancelQuickWordEditBtn?.classList.add('hidden');
}
function renderQuickWordList() {
  if(!els.quickWordList)return;
  ensureQuickWordActiveCategory();
  els.quickWordList.innerHTML='';
  if(!quickWordCategories.length){
    const note=document.createElement('div');note.className='empty-note';note.textContent='先新建一个分类，再往里面添加快捷词';els.quickWordList.appendChild(note);return;
  }
  const visible=quickWords.filter(item=>item.categoryId===quickWordsActiveCategory);
  if(!visible.length){
    const note=document.createElement('div');note.className='empty-note';note.textContent='这个分类还没有快捷词';els.quickWordList.appendChild(note);return;
  }
  for(const item of visible){
    const row=document.createElement('div');row.className='quick-word-row';
    const text=document.createElement('div');text.className='quick-word-row-text';
    const strong=document.createElement('strong');strong.textContent=item.name;
    const span=document.createElement('span');span.textContent=item.prompt;
    text.append(strong,span);
    const actions=document.createElement('div');actions.className='quick-word-row-actions';
    actions.appendChild(makeButton('编辑','small-btn',()=>{
      els.quickWordId.value=item.id;
      if(els.quickWordFormCategorySelect)els.quickWordFormCategorySelect.value=item.categoryId||quickWordsActiveCategory;
      els.quickWordName.value=item.name;els.quickWordPrompt.value=item.prompt;
      els.cancelQuickWordEditBtn.classList.remove('hidden');els.quickWordName.focus();
    }));
    actions.appendChild(makeButton('删除','small-btn danger',()=>{
      quickWords=quickWords.filter(q=>q.id!==item.id);
      saveJson(QUICK_WORDS_KEY,quickWords);
      renderQuickWordList();renderQuickWordsMenu();showToast('快捷词已删除');
    }));
    row.append(text,actions);els.quickWordList.appendChild(row);
  }
}
function openQuickWordsManager() {
  ensureQuickWordActiveCategory();
  resetQuickWordEditor();
  renderQuickWordCategorySelect();
  renderQuickWordCategoryManager();
  renderQuickWordList();
  els.newQuickWordCategoryForm?.classList.add('hidden');
  els.quickWordCategoryList?.classList.add('hidden');
  els.quickWordsMenu?.classList.add('hidden');
  els.quickWordsDialog?.showModal();
}
function renderQuickWordsMenuBody(body) {
  if(!body)return;
  body.innerHTML='';
  const chips=document.createElement('div');chips.className='quick-word-chips';
  const visible=quickWords.filter(item=>item.categoryId===quickWordsActiveCategory);
  if(visible.length){
    for(const item of visible){
      const b=document.createElement('button');b.type='button';b.className='quick-word-chip';b.textContent=item.name;
      b.addEventListener('click',(event)=>{event.stopPropagation();insertTextAtSceneCaret(item.prompt,item.name);});
      chips.appendChild(b);
    }
  }else{
    const note=document.createElement('span');note.className='quick-word-empty';
    note.textContent=quickWordCategories.length?'这个分类还没有快捷词':'还没有分类';
    chips.appendChild(note);
  }
  body.appendChild(chips);
}
function renderQuickWordsMenu() {
  const menu=els.quickWordsMenu;if(!menu)return;
  ensureQuickWordActiveCategory();
  menu.innerHTML='';

  const selectWrap=document.createElement('div');selectWrap.className='quick-word-popup-category';
  const select=document.createElement('select');select.className='quick-word-popup-select';
  const body=document.createElement('div');body.className='quick-word-menu-body';
  if(!quickWordCategories.length){
    const option=document.createElement('option');option.value='';option.textContent='还没有分类';select.appendChild(option);select.disabled=true;
  }else{
    for(const category of quickWordCategories){
      const option=document.createElement('option');option.value=category.id;option.textContent=category.name;select.appendChild(option);
    }
    select.value=quickWordsActiveCategory;
    select.addEventListener('pointerdown',(event)=>event.stopPropagation());
    select.addEventListener('click',(event)=>event.stopPropagation());
    select.addEventListener('change',(event)=>{
      event.stopPropagation();
      quickWordsActiveCategory=select.value;
      renderQuickWordsMenuBody(body);
    });
  }
  selectWrap.appendChild(select);

  renderQuickWordsMenuBody(body);

  const manage=document.createElement('button');manage.type='button';manage.className='quick-word-manage';manage.textContent='＋ 管理快捷词';
  manage.addEventListener('click',(event)=>{event.stopPropagation();openQuickWordsManager();});

  menu.append(selectWrap,body,manage);
}
function toggleQuickWordsMenu() {
  renderQuickWordsMenu();
  els.insertAnchorMenu?.classList.add('hidden');
  els.quickWordsMenu?.classList.toggle('hidden');
}
function saveQuickWord(event) {
  event?.preventDefault?.();
  ensureQuickWordActiveCategory();
  const categoryId=els.quickWordFormCategorySelect?.value||'';
  if(!categoryId){showToast('先新建一个分类');return;}
  const name=els.quickWordName.value.trim();
  const prompt=els.quickWordPrompt.value.trim().replace(/[,\s]+$/g,'');
  if(!name){els.quickWordName.focus();return;}
  if(!prompt){els.quickWordPrompt.focus();return;}
  const id=els.quickWordId.value||uid('qw');
  const item={id,categoryId,name:name.slice(0,24),prompt,updatedAt:Date.now()};
  const existing=quickWords.findIndex(q=>q.id===id);
  if(existing>=0)quickWords[existing]={...quickWords[existing],...item};else quickWords.unshift(item);
  quickWordsActiveCategory=categoryId;
  saveJson(QUICK_WORDS_KEY,quickWords);
  renderQuickWordCategorySelect();
  resetQuickWordEditor();renderQuickWordList();renderQuickWordsMenu();showToast('快捷词已保存');
}
function openNewQuickWordCategory() {
  els.newQuickWordCategoryName.value='';
  requestAnimationFrame(()=>els.newQuickWordCategoryName?.focus());
}
function saveNewQuickWordCategory(event) {
  event?.preventDefault?.();
  const name=els.newQuickWordCategoryName.value.trim().slice(0,20);
  if(!name){els.newQuickWordCategoryName.focus();return;}
  const existing=quickWordCategories.find(item=>item.name===name);
  if(existing){
    quickWordsActiveCategory=existing.id;
    renderQuickWordCategorySelect();renderQuickWordCategoryManager();renderQuickWordList();renderQuickWordsMenu();
    els.newQuickWordCategoryName.value='';
    els.newQuickWordCategoryForm?.classList.add('hidden');
    showToast('这个分类已经存在');
    return;
  }
  const item={id:uid('qwc'),name,createdAt:Date.now()};
  quickWordCategories.push(item);
  quickWordsActiveCategory=item.id;
  saveJson(QUICK_WORD_CATEGORIES_KEY,quickWordCategories);
  els.newQuickWordCategoryName.value='';
  els.newQuickWordCategoryForm?.classList.add('hidden');
  els.quickWordCategoryList?.classList.add('hidden');
  renderQuickWordCategorySelect();renderQuickWordCategoryManager();renderQuickWordList();renderQuickWordsMenu();
  showToast('分类已新建');
}
function renderQuickWordCategoryManager() {
  if(!els.quickWordCategoryList)return;
  els.quickWordCategoryList.innerHTML='';
  if(!quickWordCategories.length){
    const note=document.createElement('div');note.className='empty-note';note.textContent='还没有分类';els.quickWordCategoryList.appendChild(note);return;
  }
  for(const category of quickWordCategories){
    const row=document.createElement('div');row.className='quick-category-manage-row';
    const info=document.createElement('div');info.className='quick-category-manage-info';
    const strong=document.createElement('strong');strong.textContent=category.name;
    const count=quickWords.filter(item=>item.categoryId===category.id).length;
    const span=document.createElement('span');span.textContent=`${count} 个快捷词`;
    info.append(strong,span);
    const del=makeButton('删除分类','small-btn danger',()=>{
      requestDeleteConfirmation({
        title:`删除分类「${category.name}」？`,
        message:count?`这个分类里的 ${count} 个快捷词也会一起删除，无法撤销。`:'这个分类会被删除，无法撤销。',
        confirmText:'确认删除分类',
        action:async()=>{
          quickWords=quickWords.filter(item=>item.categoryId!==category.id);
          quickWordCategories=quickWordCategories.filter(item=>item.id!==category.id);
          if(quickWordsActiveCategory===category.id)quickWordsActiveCategory=quickWordCategories[0]?.id||'';
          saveJson(QUICK_WORDS_KEY,quickWords);
          saveJson(QUICK_WORD_CATEGORIES_KEY,quickWordCategories);
          renderQuickWordCategoryManager();renderQuickWordCategorySelect();resetQuickWordEditor();renderQuickWordList();renderQuickWordsMenu();
          showToast('分类已删除');
        }
      });
    });
    row.append(info,del);els.quickWordCategoryList.appendChild(row);
  }
}
function makeButton(text, cls, fn) {
  const b = document.createElement('button');
  b.type='button'; b.textContent=text; b.className=cls; b.addEventListener('click',fn); return b;
}
function collectChatu8Presets() {
  try {
    if (window.parent && window.parent !== window) {
      const host = window.parent.IsoldeNaiHost;
      if (host && typeof host.getChatu8Presets === 'function') {
        const snapshot = host.getChatu8Presets();
        if (snapshot && typeof snapshot === 'object') {
          return {
            found: Boolean(snapshot.found),
            activeName: String(snapshot.activeName || '').trim(),
            items: Array.isArray(snapshot.items) ? snapshot.items.map((item) => ({
              name: String((item && item.name) || '').trim(),
              artist: String((item && item.artist) || '').trim(),
              positive: String((item && item.positive) || '').trim(),
              negative: String((item && item.negative) || '').trim(),
            })).filter((item) => item.name) : [],
          };
        }
      }
    }
  } catch {}

  try {
    const api = globalThis.SillyTavern || (window.parent && window.parent !== window ? window.parent.SillyTavern : null);
    const context = api && typeof api.getContext === 'function' ? api.getContext() : null;
    const root = context?.extensionSettings?.['st-chatu8'];
    if (!root || typeof root !== 'object' || !root.yushe || typeof root.yushe !== 'object') {
      return { found:false, activeName:'', items:[] };
    }
    const activeName = typeof root.yusheid_novelai === 'string' ? root.yusheid_novelai.trim() : '';
    const items = [];
    for (const [name, value] of Object.entries(root.yushe)) {
      if (!String(name || '').trim() || !value || typeof value !== 'object') continue;
      items.push({
        name:String(name).trim(),
        artist:typeof value.fixedPrompt === 'string' ? value.fixedPrompt.trim() : '',
        positive:typeof value.fixedPrompt_end === 'string' ? value.fixedPrompt_end.trim() : '',
        negative:typeof value.negativePrompt === 'string' ? value.negativePrompt.trim() : '',
      });
    }
    return { found:true, activeName, items };
  } catch {
    return { found:false, activeName:'', items:[] };
  }
}

function importChatu8Presets() {
  const source = collectChatu8Presets();
  if (!source.found) {
    showToast('没有检测到智绘姬预设；这个入口只在安装了智绘姬的酒馆里生效');
    return;
  }
  if (!source.items.length) {
    showToast('检测到智绘姬，但里面还没有提示词预设');
    return;
  }

  let added=0, overwritten=0, skipped=0;
  const plan = source.items.map((item) => {
    const existing = presets.find((preset) => preset.name === item.name);
    if (!existing) return { state:'add', item };
    const same =
      String(existing.artist || '').trim() === item.artist &&
      String(existing.positive || '').trim() === item.positive &&
      String(existing.negative || '').trim() === item.negative;
    return { state:same?'skip':'overwrite', item, existing };
  });
  for (const entry of plan) {
    if (entry.state === 'add') added++;
    else if (entry.state === 'overwrite') overwritten++;
    else skipped++;
  }

  if (!added && !overwritten) {
    const active = source.activeName && presets.find((preset) => preset.name === source.activeName);
    if (active) {
      settings.presetId = active.id;
      renderPresetSelect();
      els.presetSelect.value = active.id;
      updateAssembly();
    }
    showToast('智绘姬预设已经全部同步，无需重复导入');
    return;
  }

  const message = [
    '从智绘姬导入提示词预设？',
    added ? '新增 ' + added + ' 个' : '',
    overwritten ? '同名覆盖 ' + overwritten + ' 个' : '',
    skipped ? '相同跳过 ' + skipped + ' 个' : '',
    overwritten ? '同名预设会保留 Isolde.nai 的 ID，但画师串、正面和负面会更新。' : '',
  ].filter(Boolean).join('\n');
  if (!confirm(message)) return;

  const importedIds = new Map();
  for (const entry of plan) {
    const item = entry.item;
    if (entry.state === 'skip') {
      importedIds.set(item.name, entry.existing.id);
      continue;
    }
    if (entry.state === 'overwrite') {
      entry.existing.artist = item.artist;
      entry.existing.positive = item.positive;
      entry.existing.negative = item.negative;
      entry.existing.importedFrom = 'st-chatu8';
      entry.existing.updatedAt = Date.now();
      importedIds.set(item.name, entry.existing.id);
      continue;
    }
    const created = {
      id:uid('preset'),
      name:item.name,
      artist:item.artist,
      positive:item.positive,
      negative:item.negative,
      importedFrom:'st-chatu8',
      updatedAt:Date.now(),
    };
    presets.unshift(created);
    importedIds.set(item.name, created.id);
  }

  saveJson(PRESETS_KEY,presets);
  const activeId = source.activeName ? importedIds.get(source.activeName) : '';
  if (activeId) settings.presetId = activeId;
  renderPresetSelect();
  if (activeId) els.presetSelect.value = activeId;
  renderPresetLibrary();
  updateAssembly();

  const parts=[];
  if(added)parts.push('新增 '+added);
  if(overwritten)parts.push('覆盖 '+overwritten);
  if(skipped)parts.push('跳过 '+skipped);
  if(activeId)parts.push('已切到智绘姬当前预设');
  showToast('智绘姬导入完成：'+parts.join('，'));
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
    const h=document.createElement('h3'); h.textContent=a.name; title.appendChild(h);
    const outfitCount=anchorOutfits(a).length;
    if(outfitCount){
      const badge=document.createElement('span');
      badge.className='anchor-outfit-count';
      badge.textContent=`${outfitCount} 套服设`;
      title.appendChild(badge);
    }
    card.appendChild(title);
    const actions=document.createElement('div'); actions.className='card-actions anchor-card-actions';
    actions.appendChild(makeButton('编辑','small-btn',()=>openAnchorEditor(a)));
    actions.appendChild(makeButton(selectedAnchorIds.includes(a.id)?'取消选中':'加入工作台','small-btn',()=>{
      const active=selectedAnchorIds.includes(a.id);
      selectedAnchorIds = active ? selectedAnchorIds.filter(id=>id!==a.id) : [...selectedAnchorIds,a.id];
      if(active) delete selectedOutfitIds[a.id];
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
function renderAnchorOutfitEditor(anchor) {
  const host=els.anchorOutfitList;
  if(!host)return;
  host.innerHTML='';
  if(!anchor){
    const note=document.createElement('div');
    note.className='empty-note';
    note.textContent='保存角色后，可以从角色页的「+ 服设」给它添加衣服。';
    host.appendChild(note);
    return;
  }
  const outfits=anchorOutfits(anchor);
  if(!outfits.length){
    const note=document.createElement('div');
    note.className='empty-note';
    note.textContent='这个角色还没有服设。';
    host.appendChild(note);
    return;
  }
  for(const outfit of outfits){
    const details=document.createElement('details');
    details.className='outfit-edit-card';
    const summary=document.createElement('summary');
    summary.textContent=outfit.name||'未命名服设';
    details.appendChild(summary);

    const body=document.createElement('div');
    body.className='outfit-edit-body';
    const nameLabel=document.createElement('label');
    nameLabel.className='field compact-field';
    nameLabel.innerHTML='<span>服设名称</span>';
    const nameInput=document.createElement('input');
    nameInput.value=outfit.name||'';
    nameInput.placeholder='例如：白衬衫 / 冬季校服';
    nameLabel.appendChild(nameInput);

    const promptLabel=document.createElement('label');
    promptLabel.className='field compact-field';
    promptLabel.innerHTML='<span>服装词</span>';
    const promptInput=document.createElement('textarea');
    promptInput.rows=4;
    promptInput.value=outfit.prompt||'';
    promptInput.placeholder='只写可见服装，例如：white shirt, black trousers, ...';
    promptLabel.appendChild(promptInput);

    const actions=document.createElement('div');
    actions.className='outfit-edit-actions';
    actions.appendChild(makeButton('保存修改','small-btn',()=>{
      const nextName=nameInput.value.trim();
      if(!nextName){nameInput.focus();return;}
      outfit.name=nextName;
      outfit.prompt=promptInput.value.trim();
      outfit.updatedAt=Date.now();
      saveJson(ANCHORS_KEY,anchors);
      renderAnchorOutfitEditor(anchor);
      renderAnchors();
      updateAssembly();
      showToast('服设已修改');
    }));
    actions.appendChild(makeButton('删除','small-btn danger',()=>{
      if(!confirm(`删除「${outfit.name||'这套服设'}」？`))return;
      anchor.outfits=anchorOutfits(anchor).filter(item=>item.id!==outfit.id);
      if(selectedOutfitIds[anchor.id]===outfit.id)delete selectedOutfitIds[anchor.id];
      saveJson(ANCHORS_KEY,anchors);
      renderAnchorOutfitEditor(anchor);
      renderAnchors();
      updateAssembly();
      showToast('服设已删除');
    }));
    body.append(nameLabel,promptLabel,actions);
    details.appendChild(body);
    host.appendChild(details);
  }
}
function openAnchorEditor(a=null) {
  els.anchorDialogTitle.textContent=a?'编辑角色':'新增角色';
  els.anchorId.value=a?.id||''; els.anchorName.value=a?.name||''; els.anchorPrompt.value=a?.prompt||'';
  renderAnchorOutfitEditor(a);
  els.anchorDialog.showModal();
}
function renderOutfitCharacterOptions() {
  if(!els.outfitCharacterList)return;
  els.outfitCharacterList.innerHTML='';
  if(!anchors.length){
    const note=document.createElement('div');
    note.className='empty-note';
    note.textContent='先添加角色，才能给角色加服设。';
    els.outfitCharacterList.appendChild(note);
    return;
  }
  const preselected=new Set(selectedAnchorIds);
  for(const anchor of anchors){
    const label=document.createElement('label');
    label.className='outfit-character-option';
    const input=document.createElement('input');
    input.type='checkbox';
    input.value=anchor.id;
    input.checked=preselected.has(anchor.id);
    const span=document.createElement('span');
    span.textContent=anchor.name;
    label.append(input,span);
    els.outfitCharacterList.appendChild(label);
  }
}
function openOutfitCreator() {
  if(!anchors.length){showToast('先添加角色');return;}
  els.outfitName.value='';
  els.outfitPrompt.value='';
  renderOutfitCharacterOptions();
  els.outfitDialog.showModal();
}
function saveSharedOutfit() {
  const name=els.outfitName.value.trim();
  const prompt=els.outfitPrompt.value.trim();
  if(!name){els.outfitName.focus();return;}
  const ids=[...els.outfitCharacterList.querySelectorAll('input[type="checkbox"]:checked')].map(input=>input.value);
  if(!ids.length){showToast('至少选一个角色');return;}
  const now=Date.now();
  let added=0;
  for(const id of ids){
    const anchor=anchors.find(item=>item.id===id);
    if(!anchor)continue;
    const outfits=anchorOutfits(anchor);
    outfits.push({id:uid('outfit'),name,prompt,updatedAt:now});
    anchor.outfits=outfits;
    anchor.updatedAt=now;
    added++;
  }
  saveJson(ANCHORS_KEY,anchors);
  els.outfitDialog.close();
  renderAnchors();
  updateAssembly();
  showToast(`服设已加入 ${added} 个角色`);
}
function deleteAnchor(id) {
  const a=anchors.find(x=>x.id===id);
  if (!a || !confirm(`删除角色「${a.name}」？`)) return;
  anchors=anchors.filter(x=>x.id!==id); selectedAnchorIds=selectedAnchorIds.filter(x=>x!==id);
  delete selectedOutfitIds[id];
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
async function gunzipBytes(bytes){
  if(typeof DecompressionStream==='function'){
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const out=await new Response(stream).arrayBuffer();
    return new Uint8Array(out);
  }
  const mod=await import('https://cdn.jsdelivr.net/npm/fflate@0.8.2/+esm');
  return mod.gunzipSync(bytes);
}
function stealthByteReader(imageData,width,height,mode='alpha'){
  const data=imageData.data;
  const pixelCount=width*height;
  const bitsPerPixel=mode==='rgb'?3:1;
  const capacity=pixelCount*bitsPerPixel;
  const bitAt=(bitIndex)=>{
    const pixelIndex=Math.floor(bitIndex/bitsPerPixel);
    if(pixelIndex<0||pixelIndex>=pixelCount)return 0;
    const x=Math.floor(pixelIndex/height),y=pixelIndex%height;
    const base=(y*width+x)*4;
    if(mode==='rgb')return data[base+(bitIndex%3)]&1;
    return data[base+3]&1;
  };
  const bytesAt=(startBit,count)=>{
    const out=new Uint8Array(count);
    for(let i=0;i<count;i++){
      let value=0;
      for(let b=0;b<8;b++)value=(value<<1)|bitAt(startBit+i*8+b);
      out[i]=value;
    }
    return out;
  };
  return {capacity,bitAt,bytesAt};
}
async function readStealthPngMetadata(file){
  const url=URL.createObjectURL(file);
  try{
    const image=await loadCanvasImage(url);
    const width=image.naturalWidth,height=image.naturalHeight;
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return null;
    ctx.drawImage(image,0,0);
    const imageData=ctx.getImageData(0,0,width,height);
    const sigBytes=new TextEncoder().encode('stealth_pnginfo').length;
    for(const mode of ['alpha','rgb']){
      const reader=stealthByteReader(imageData,width,height,mode);
      if(reader.capacity<(sigBytes*8+32))continue;
      let signature='';
      try{signature=new TextDecoder().decode(reader.bytesAt(0,sigBytes));}catch{continue;}
      const allowed=mode==='alpha'
        ? new Set(['stealth_pnginfo','stealth_pngcomp'])
        : new Set(['stealth_rgbinfo','stealth_rgbcomp']);
      if(!allowed.has(signature))continue;
      let lengthBits=0;
      for(let i=0;i<32;i++)lengthBits=lengthBits*2+reader.bitAt(sigBytes*8+i);
      if(!Number.isFinite(lengthBits)||lengthBits<=0||lengthBits>NAI_META_MAX*8)continue;
      const payloadStart=sigBytes*8+32;
      if(payloadStart+lengthBits>reader.capacity)continue;
      const payload=reader.bytesAt(payloadStart,Math.floor(lengthBits/8));
      const raw=signature.endsWith('comp')?await gunzipBytes(payload):payload;
      const text=new TextDecoder('utf-8').decode(raw).trim();
      if(text)return {text,signature,mode};
    }
  }catch(e){console.warn('Stealth PNG metadata 解析失败',e);}
  finally{URL.revokeObjectURL(url);}
  return null;
}
async function destroyStealthAlphaMetadata(blob){
  if(!(blob instanceof Blob)||blob.type&&blob.type!=='image/png')return blob;
  const url=URL.createObjectURL(blob);
  try{
    const image=await loadCanvasImage(url);
    const width=image.naturalWidth,height=image.naturalHeight;
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return blob;
    ctx.drawImage(image,0,0);
    const imageData=ctx.getImageData(0,0,width,height);
    const data=imageData.data;
    let effectivelyOpaque=true;
    for(let i=3;i<data.length;i+=4){if(data[i]<254){effectivelyOpaque=false;break;}}
    for(let i=3;i<data.length;i+=4){
      data[i]=effectivelyOpaque?255:(data[i]&0xFE);
    }
    ctx.putImageData(imageData,0,0);
    return await new Promise((resolve,reject)=>canvas.toBlob(result=>result?resolve(result):reject(new Error('PNG 清理失败')),'image/png'));
  }finally{URL.revokeObjectURL(url);}
}
async function sanitizeNaiPngMetadata(blob){
  const stealthClean=await destroyStealthAlphaMetadata(blob);
  return await stripPngMetadata(stealthClean);
}

async function readNaiPngText(file){
  if(file.size>40*1024*1024)throw new Error('图片太大，请控制在 40MB 以内');
  const buffer=await file.arrayBuffer(),bytes=new Uint8Array(buffer);
  if(bytes.length<33||!bytesEqualAt(bytes,NAI_PNG_SIGNATURE))throw new Error('请选择 PNG 图片');
  const view=new DataView(buffer),width=view.getUint32(16,false),height=view.getUint32(20,false),entries=[];let offset=8,count=0,totalText=0;
  while(offset+12<=bytes.length&&count++<4096){
    const length=view.getUint32(offset,false),type=new TextDecoder('iso-8859-1').decode(bytes.subarray(offset+4,offset+8)),start=offset+8,end=start+length,next=end+4;
    if(end<start||next>bytes.length)break;
    if(['tEXt','zTXt','iTXt'].includes(type)){try{const entry=await decodeNaiTextChunk(type,bytes.subarray(start,end));if(entry){totalText+=entry.text.length;if(totalText<=NAI_META_MAX)entries.push(entry);}}catch{}}
    offset=next;if(type==='IEND')break;
  }
  const stealth=await readStealthPngMetadata(file);
  return {entries,width,height,stealth};
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
  if(!raw&&data.stealth?.text)raw=nestedNaiMetadata(data.stealth.text,sourceEntry);
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
function normalizeCharacterCaption(value) {
  const normalized = String(value || '').split(',').map((part)=>{
    const tag=part.trim();
    const counted = tag.match(/^\d+\s*(girls?|boys?|women?|men|woman|man|others?|people|persons?)$/i);
    if (!counted) return tag;
    const kind = counted[1].toLowerCase();
    if (kind.startsWith('girl')) return 'girl';
    if (kind.startsWith('boy')) return 'boy';
    if (kind === 'women' || kind === 'woman') return 'woman';
    if (kind === 'men' || kind === 'man') return 'man';
    if (kind.startsWith('other')) return 'other';
    return 'person';
  }).filter(Boolean);
  const subject = normalized.filter(tag => /^(?:girl|boy|woman|man|other|person)$/i.test(tag));
  const rest = normalized.filter(tag => !/^(?:girl|boy|woman|man|other|person)$/i.test(tag));
  return [...subject, ...rest].join(', ');
}
function supportsCharacterPrompts(model) {
  return model.startsWith('nai-diffusion-5') || model.includes('nai-diffusion-4-5');
}
function resolveAutomaticCharacters(value) {
  if(!Array.isArray(value))return[];
  return value.map((character)=>{
    if(!character||typeof character!=='object')return null;
    const anchorName=String(character.anchor||'').trim();
    const saved=anchorName?anchors.find((item)=>item.name===anchorName):null;
    const savedPrompt=String(saved?.prompt||'').trim();
    const currentPrompt=String(character.prompt||character.appearance||'').trim();
    const prompt=cleanJoin([savedPrompt,currentPrompt]);
    if(!prompt)return null;
    return {name:String(character.name||anchorName||'').trim(),anchor:saved?saved.name:'',prompt};
  }).filter(Boolean);
}
function buildNaiPayload(seed=null,promptOverride=null,sizeOverride=null) {
  const source=promptOverride&&typeof promptOverride==='object'?promptOverride:assemblePrompts();
  const positive=String(source.basePositive ?? source.positive ?? '');
  const negative=String(source.negative||'');
  const model=els.model.value;
  const isV5=model.startsWith('nai-diffusion-5');
  const characters=resolveAutomaticCharacters(source.characters);
  const charCaptions=supportsCharacterPrompts(model)
    ? characters.map((character)=>({char_caption:normalizeCharacterCaption(character.prompt),centers:[{x:0.5,y:0.5}]}))
    : [];
  const widthSource=sizeOverride&&Number.isFinite(Number(sizeOverride.width))?sizeOverride.width:els.width.value;
  const heightSource=sizeOverride&&Number.isFinite(Number(sizeOverride.height))?sizeOverride.height:els.height.value;
  const width=Math.round(clampNumber(widthSource,256,2048,1024)/64)*64;
  const height=Math.round(clampNumber(heightSource,256,2048,1024)/64)*64;
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
    image_format:'png',
    v4_prompt:{caption:{base_caption:positive,char_captions:charCaptions},use_coords:false,use_order:true},
    v4_negative_prompt:{
      caption:{base_caption:negative,char_captions:charCaptions.map(()=>({char_caption:'',centers:[{x:0.5,y:0.5}]}))},
      legacy_uc:false
    },
    characterPrompts:[]
  };
  if (seed !== null && seed !== undefined && String(seed).trim() !== '') {
    params.seed = Number(seed);
  }
  if (!model.includes('full-medium')) params.cfg_rescale=clampNumber(els.guidanceRescale.value,0,1,.32);
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
async function generate({forceSeed=null,throwOnError=false,promptOverride=null,sizeOverride=null}={}) {
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
  const naiBody=buildNaiPayload(seed || null,promptOverride,sizeOverride);
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
    const galleryBlob=blob;
    const galleryId=await addGallery(galleryBlob,{
      seed,scenePrompt:els.scenePrompt.value,extraNegative:els.extraNegative.value,
      assembledPrompt:naiBody.input,assembledNegative:naiBody.parameters.negative_prompt,
      presetId:p?.id||'',presetName:p?.name||'',anchorIds:[...selectedAnchorIds],
      model:els.model.value,sampler:els.sampler.value,width:naiBody.parameters.width,height:naiBody.parameters.height,
      steps:Number(els.steps.value),cfg:Number(els.cfg.value),cfgRescale:Number(els.guidanceRescale.value),
      referenceEnabled:els.referenceEnabled.checked,referenceMode:els.referenceMode.value,referenceStrength:Number(els.referenceStrength.value),referenceFidelity:Number(els.referenceFidelity.value),referenceName:currentReferenceAsset?.name||'',
      vibeEnabled:els.vibeEnabled.checked,vibeStrength:Number(els.vibeStrength.value),vibeInformation:Number(els.vibeInformation.value),vibeName:currentVibeAsset?.name||'',
      createdAt:Date.now()
    });
    saveSettings(); setConnectionState('ready','生成完成'); showToast('已生成并保存到图库');
    return {
      blob,seed,prompt:naiBody.input,negative:naiBody.parameters.negative_prompt,
      width:naiBody.parameters.width,height:naiBody.parameters.height,galleryId,
      characters:resolveAutomaticCharacters(promptSource.characters)
    };
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
function pngChunkType(bytes,offset){
  return String.fromCharCode(bytes[offset+4],bytes[offset+5],bytes[offset+6],bytes[offset+7]);
}
async function stripPngMetadata(blob){
  if(!(blob instanceof Blob) || blob.type && blob.type!=='image/png') return blob;
  const bytes=new Uint8Array(await blob.arrayBuffer());
  if(bytes.length<8 || bytes[0]!==0x89 || bytes[1]!==0x50 || bytes[2]!==0x4e || bytes[3]!==0x47) return blob;

  const parts=[bytes.slice(0,8)];
  const removable=new Set(['tEXt','zTXt','iTXt','eXIf','tIME']);
  let offset=8;
  while(offset+12<=bytes.length){
    const length=((bytes[offset]<<24)>>>0)+(bytes[offset+1]<<16)+(bytes[offset+2]<<8)+bytes[offset+3];
    const end=offset+12+length;
    if(end>bytes.length) return blob;
    const type=pngChunkType(bytes,offset);
    if(!removable.has(type)) parts.push(bytes.slice(offset,end));
    offset=end;
    if(type==='IEND') break;
  }
  return new Blob(parts,{type:'image/png'});
}
function withExtension(name,ext){
  return String(name||'image').replace(/\.[a-z0-9]+$/i,'')+'.'+ext;
}
async function encodeHighQualityJpeg(blob,quality=.98){
  const url=URL.createObjectURL(blob);
  try{
    const image=await loadCanvasImage(url);
    const canvas=document.createElement('canvas');
    canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const ctx=canvas.getContext('2d');
    if(!ctx)throw new Error('浏览器无法生成 JPEG');
    ctx.fillStyle='#fff';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(image,0,0);
    return await new Promise((resolve,reject)=>canvas.toBlob(
      result=>result?resolve(result):reject(new Error('JPEG 导出失败')),
      'image/jpeg',
      quality
    ));
  }finally{
    URL.revokeObjectURL(url);
  }
}
async function encodePng(blob){
  const url=URL.createObjectURL(blob);
  try{
    const image=await loadCanvasImage(url);
    const canvas=document.createElement('canvas');
    canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const ctx=canvas.getContext('2d');
    if(!ctx)throw new Error('浏览器无法生成 PNG');
    ctx.drawImage(image,0,0);
    return await new Promise((resolve,reject)=>canvas.toBlob(
      result=>result?resolve(result):reject(new Error('PNG 导出失败')),
      'image/png'
    ));
  }finally{
    URL.revokeObjectURL(url);
  }
}
async function saveImageBlob(blob,name){
  if(blob?.type==='image/jpeg'){
    return saveBlob(blob,withExtension(name,'jpg'));
  }
  if(els.keepNaiMetadata?.checked){
    return saveBlob(blob,withExtension(name,'png'));
  }
  const output=await encodeHighQualityJpeg(blob,.98);
  return saveBlob(output,withExtension(name,'jpg'));
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
        return true;
      }
    }catch(e){
      if(e?.name==='AbortError') return false;
      console.warn('iOS 文件分享失败，回退普通下载',e);
    }
  }
  fallbackDownload(blob,name);
  return true;
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
  const output=await encodeHighQualityJpeg(watermarked,.98);
  await saveBlob(output,withExtension(name,'jpg'));
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
      if(!db.objectStoreNames.contains('exportChunks')) db.createObjectStore('exportChunks',{keyPath:'key'});
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
  const hasSelected=Boolean(els.vibePresetSelect.value);
  els.loadVibePresetBtn.disabled=!hasSelected;
  els.appendVibePresetBtn.disabled=!hasSelected;
  els.deleteVibePresetBtn.disabled=!hasSelected;
}
function vibeAssetUsable(asset){
  if(!asset)return false;
  if(Array.isArray(asset.vibeItems)&&asset.vibeItems.some(vibeAssetUsable))return true;
  if(asset.blob instanceof Blob)return true;
  const buckets=asset.encodings&&typeof asset.encodings==='object'?Object.values(asset.encodings):[];
  return buckets.some(list=>Array.isArray(list)&&list.some(item=>typeof item?.encoding==='string'&&item.encoding.length>64));
}
function vibeLeafItems(asset,out=[]){
  if(!asset||out.length>=VIBE_LIMIT)return out;
  if(Array.isArray(asset.vibeItems)&&asset.vibeItems.length){
    for(const item of asset.vibeItems){
      vibeLeafItems(item,out);
      if(out.length>=VIBE_LIMIT)break;
    }
    return out;
  }
  if(vibeAssetUsable(asset))out.push(asset);
  return out;
}
function normalizeVibeLeaf(item,index=0,{useGlobalForSingle=false}={}){
  const source=item&&typeof item==='object'?item:{};
  const strength=useGlobalForSingle
    ? clampNumber(els.vibeStrength.value,0,1,.6)
    : clampNumber(source.strength,0,1,.6);
  const information=useGlobalForSingle
    ? clampNumber(els.vibeInformation.value,.05,1,.7)
    : clampNumber(source.information,.05,1,.7);
  return {
    ...source,
    id:String(source.id||uid('vibeitem')),
    name:String(source.name||source.fileName||`Vibe ${index+1}`),
    enabled:source.enabled!==false,
    strength,
    information
  };
}
function currentVibeStackItems(asset=currentVibeAsset){
  const leaves=vibeLeafItems(asset,[]);
  const single=leaves.length===1&&!Array.isArray(asset?.vibeItems);
  return leaves.slice(0,VIBE_LIMIT).map((item,index)=>normalizeVibeLeaf(item,index,{useGlobalForSingle:single}));
}
function vibeStackStrength(items=currentVibeStackItems()){
  return items.filter(item=>item.enabled!==false).reduce((sum,item)=>sum+clampNumber(item.strength,0,1,.6),0);
}
async function persistVibeStack(items,name='Multivibe'){
  const clean=(Array.isArray(items)?items:[])
    .filter(vibeAssetUsable)
    .slice(0,VIBE_LIMIT)
    .map((item,index)=>normalizeVibeLeaf(item,index));
  if(!clean.length){
    await removeLocalAsset('vibe');
    currentVibeAsset=null;
    els.vibeEnabled.checked=false;
    await refreshReferenceUi();
    saveSettings();
    return;
  }
  if(clean.length===1){
    const one=clean[0];
    await putAssetRecord({
      ...one,
      key:'vibe',
      name:one.name||name||'Vibe',
      vibeItems:null,
      isGroup:false,
      updatedAt:Date.now()
    });
    els.vibeStrength.value=String(clampNumber(one.strength,0,1,.6));
    els.vibeInformation.value=String(clampNumber(one.information,.05,1,.7));
    els.vibeStrengthValue.textContent=Number(els.vibeStrength.value).toFixed(2);
    els.vibeInformationValue.textContent=Number(els.vibeInformation.value).toFixed(2);
  }else{
    await putAssetRecord({
      key:'vibe',
      name:String(name||currentVibeAsset?.name||'Multivibe'),
      vibeItems:clean,
      isGroup:true,
      updatedAt:Date.now()
    });
  }
  await refreshReferenceUi();
  saveSettings();
}
async function appendVibeAssets(assets,name='Multivibe'){
  const current=currentVibeStackItems();
  const incoming=[];
  for(const asset of Array.isArray(assets)?assets:[]){
    for(const leaf of vibeLeafItems(asset,[])){
      if(incoming.length>=VIBE_LIMIT)break;
      incoming.push(normalizeVibeLeaf(leaf,incoming.length));
    }
    if(incoming.length>=VIBE_LIMIT)break;
  }
  const room=Math.max(0,VIBE_LIMIT-current.length);
  if(!room){showToast('最多同时叠加 16 个 Vibe');return 0;}
  const added=incoming.slice(0,room).map(item=>({...item,id:uid('vibeitem')}));
  if(!added.length)return 0;
  await persistVibeStack([...current,...added],currentVibeAsset?.name||name);
  return added.length;
}
function renderVibeStackUi(){
  if(!els.vibeStackSummary||!els.vibeItemsEditor)return;
  const items=currentVibeStackItems();
  const grouped=items.length>1;
  els.vibeStackSummary.classList.toggle('hidden',!grouped);
  els.vibeItemsEditor.classList.toggle('hidden',!grouped);
  els.vibeItemsEditor.replaceChildren();
  if(!grouped)return;

  const updateSummary=()=>{
    const enabled=items.filter(item=>item.enabled!==false).length;
    const total=vibeStackStrength(items);
    els.vibeStackSummary.textContent=`Multivibe · 已启用 ${enabled}/${items.length} · 总 Strength ${total.toFixed(2)}`;
    els.vibeStackSummary.classList.toggle('warning',total>1.0001);
  };
  updateSummary();

  items.forEach((item,index)=>{
    const card=document.createElement('div');
    card.className='vibe-stack-item';
    card.classList.toggle('disabled',item.enabled===false);

    const head=document.createElement('div');
    head.className='vibe-stack-item-head';
    const title=document.createElement('strong');
    title.textContent=item.name||`Vibe ${index+1}`;
    const controls=document.createElement('div');
    controls.className='vibe-stack-item-actions';

    const toggle=document.createElement('label');
    toggle.className='mini-switch';
    const checkbox=document.createElement('input');
    checkbox.type='checkbox';
    checkbox.checked=item.enabled!==false;
    const toggleText=document.createElement('span');
    toggleText.textContent='启用';
    toggle.append(checkbox,toggleText);

    const remove=document.createElement('button');
    remove.type='button';
    remove.className='text-btn danger';
    remove.textContent='删除';
    controls.append(toggle,remove);
    head.append(title,controls);
    card.appendChild(head);

    const makeSlider=(labelText,min,max,step,value,locked,onValue)=>{
      const label=document.createElement('label');
      label.className='vibe-stack-slider';
      const span=document.createElement('span');
      span.textContent=labelText;
      const input=document.createElement('input');
      input.type='range';
      input.min=String(min);
      input.max=String(max);
      input.step=String(step);
      input.value=String(value);
      input.disabled=locked;
      const out=document.createElement('strong');
      out.textContent=Number(value).toFixed(2);
      input.addEventListener('input',()=>{
        const next=Number(input.value);
        out.textContent=next.toFixed(2);
        onValue(next);
        updateSummary();
      });
      input.addEventListener('change',()=>persistVibeStack(items,currentVibeAsset?.name||'Multivibe').catch(e=>{console.error(e);showToast('Vibe 参数保存失败');}));
      if(locked)label.title='这个 Vibe 只有预编码，Information 固定';
      label.append(span,input,out);
      return label;
    };

    card.appendChild(makeSlider('Strength',0,1,.05,item.strength,false,value=>{item.strength=value;}));
    const infoLocked=!(item.blob instanceof Blob);
    card.appendChild(makeSlider('Information',.05,1,.05,item.information,infoLocked,value=>{item.information=value;}));

    checkbox.addEventListener('change',()=>{
      item.enabled=checkbox.checked;
      card.classList.toggle('disabled',!item.enabled);
      updateSummary();
      persistVibeStack(items,currentVibeAsset?.name||'Multivibe').catch(e=>{console.error(e);showToast('Vibe 状态保存失败');});
    });
    remove.addEventListener('click',()=>{
      const next=items.filter(entry=>entry.id!==item.id);
      persistVibeStack(next,currentVibeAsset?.name||'Multivibe').then(()=>showToast('Vibe 已移除')).catch(e=>{console.error(e);showToast('Vibe 移除失败');});
    });

    els.vibeItemsEditor.appendChild(card);
  });
}
async function appendSelectedVibePreset(){
  const key=els.vibePresetSelect.value;
  if(!key){showToast('先选择一个 Vibe 预设');return;}
  const preset=await getLocalAsset(key);
  if(!vibeAssetUsable(preset)){showToast('这个 Vibe 预设已不存在');await renderVibePresets();return;}
  const added=await appendVibeAssets([preset],preset.name||'Multivibe');
  if(added)showToast(`已追加 ${added} 个 Vibe`);
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
  renderVibeStackUi();
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
    const items=currentVibeStackItems(asset).filter(item=>item.enabled!==false).slice(0,VIBE_LIMIT);
    if(!items.length)throw new Error('当前没有启用的 Vibe');
    const encodings=[];
    const strengths=[];
    const informations=[];

    for(const item of items){
      const info=clampNumber(item.information,.05,1,.7);
      const strength=clampNumber(item.strength,0,1,.6);
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
function restoreGalleryScroll(scrollLeft,scrollTop){
  requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(scrollLeft,scrollTop)));
}
function syncGalleryGridState(){
  const remaining=els.galleryGrid.querySelectorAll('.gallery-card').length;
  els.galleryCount.textContent=`${remaining} 张 · 保存在此设备`;
  if(!remaining&&!els.galleryGrid.querySelector('.empty-note')){
    const note=document.createElement('div');
    note.className='empty-note';
    note.textContent='图库还是空的。生成第一张图后会自动保存在这里。';
    els.galleryGrid.appendChild(note);
  }
  return remaining;
}
function setGalleryBatchMode(enabled){
  galleryBatchMode=Boolean(enabled);
  if(!galleryBatchMode) selectedGalleryIds.clear();
  els.galleryGrid.querySelectorAll('.gallery-card').forEach(card=>{
    card.classList.toggle('gallery-batch-mode',galleryBatchMode);
    if(!galleryBatchMode){
      card.classList.remove('gallery-selected');
      card.querySelector('.gallery-selection-cancel')?.classList.add('hidden');
    }
  });
  updateBatchDeleteButton();
}
async function deleteGalleryItem(id){
  const scrollTop=window.scrollY;
  const scrollLeft=window.scrollX;
  await deleteGalleryRecord(id);
  selectedGalleryIds.delete(id);
  await renderGallery();
  restoreGalleryScroll(scrollLeft,scrollTop);
}
function updateBatchDeleteButton(){
  if(!els.batchDeleteGalleryBtn) return;
  if(!galleryBatchMode) els.batchDeleteGalleryBtn.textContent='批量删除';
  else if(!selectedGalleryIds.size) els.batchDeleteGalleryBtn.textContent='退出批量';
  else els.batchDeleteGalleryBtn.textContent=`删除已选（${selectedGalleryIds.size}）`;
}
function setGallerySelected(card,id,selected){
  if(selected) selectedGalleryIds.add(id);
  else selectedGalleryIds.delete(id);
  card.classList.toggle('gallery-selected',selected);
  card.querySelector('.gallery-selection-cancel')?.classList.toggle('hidden',!selected);
  updateBatchDeleteButton();
}
async function deleteSelectedGalleryItems(){
  const ids=[...selectedGalleryIds];
  if(!ids.length)return;
  const scrollTop=window.scrollY;
  const scrollLeft=window.scrollX;
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('history','readwrite');
    const store=tx.objectStore('history');
    ids.forEach(id=>store.delete(Number(id)));
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error||new Error('批量删除失败'));
  });
  db.close();
  setGalleryBatchMode(false);
  await renderGallery();
  restoreGalleryScroll(scrollLeft,scrollTop);
  showToast(`已删除 ${ids.length} 张图片`);
}
function applyGalleryMeta(item){
  els.scenePrompt.value=item.scenePrompt??item.prompt??'';
  els.extraNegative.value=item.extraNegative??item.negative??'';
  if(item.presetId&&presets.some(p=>p.id===item.presetId)) els.presetSelect.value=item.presetId;
  selectedAnchorIds=(item.anchorIds||[]).filter(id=>anchors.some(a=>a.id===id));
  if(item.model) els.model.value=item.model;if(item.sampler)els.sampler.value=item.sampler;
  if(item.width)els.width.value=item.width;if(item.height)els.height.value=item.height;
  if(item.steps)els.steps.value=item.steps;if(item.cfg!=null)els.cfg.value=item.cfg;
  if(item.cfgRescale!=null)els.guidanceRescale.value=String(clampNumber(item.cfgRescale,0,1,.32));
  updateGuidanceRescaleUi();
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

function closeGalleryViewer(){
  if(!els.galleryViewer) return;
  els.galleryViewer.classList.remove('open');
  els.galleryViewer.setAttribute('aria-hidden','true');
  document.documentElement.classList.remove('gallery-viewer-open');
  document.body.classList.remove('gallery-viewer-open');
  if(galleryViewerObjectUrl){
    URL.revokeObjectURL(galleryViewerObjectUrl);
    galleryViewerObjectUrl=null;
  }
  if(els.galleryViewerImage) els.galleryViewerImage.removeAttribute('src');
  galleryViewerIndex=-1;
}

function galleryViewerMove(delta){
  if(!galleryViewerItems.length) return;
  const next=(galleryViewerIndex+delta+galleryViewerItems.length)%galleryViewerItems.length;
  showGalleryViewerItem(next);
}

function showGalleryViewerItem(index){
  if(!els.galleryViewer||!galleryViewerItems.length) return;
  const count=galleryViewerItems.length;
  galleryViewerIndex=((Number(index)||0)%count+count)%count;
  const item=galleryViewerItems[galleryViewerIndex];

  if(galleryViewerObjectUrl) URL.revokeObjectURL(galleryViewerObjectUrl);
  galleryViewerObjectUrl=URL.createObjectURL(item.blob);
  els.galleryViewerImage.src=galleryViewerObjectUrl;
  els.galleryViewerImage.alt=`图库图片 ${galleryViewerIndex+1}/${count}`;
  els.galleryViewerCounter.textContent=`${galleryViewerIndex+1} / ${count}`;
  els.galleryViewerMeta.textContent=`${item.width||'?'}×${item.height||'?'} · seed ${item.seed||'?'}`;
  const multiple=count>1;
  els.galleryViewerPrev.classList.toggle('hidden',!multiple);
  els.galleryViewerNext.classList.toggle('hidden',!multiple);
}

function openGalleryViewer(items,index){
  if(!els.galleryViewer||!Array.isArray(items)||!items.length) return;
  galleryViewerItems=items;
  els.galleryViewer.classList.add('open');
  els.galleryViewer.setAttribute('aria-hidden','false');
  document.documentElement.classList.add('gallery-viewer-open');
  document.body.classList.add('gallery-viewer-open');
  showGalleryViewerItem(index);
}

function initGalleryViewer(){
  if(!els.galleryViewer) return;
  els.galleryViewerClose?.addEventListener('click',closeGalleryViewer);
  els.galleryViewerPrev?.addEventListener('click',()=>galleryViewerMove(-1));
  els.galleryViewerNext?.addEventListener('click',()=>galleryViewerMove(1));
  els.galleryViewer.addEventListener('click',(event)=>{
    if(event.target===els.galleryViewer) closeGalleryViewer();
  });
  els.galleryViewer.addEventListener('pointerdown',(event)=>{
    if(event.pointerType==='mouse') return;
    galleryViewerPointerStartX=event.clientX;
    galleryViewerPointerStartY=event.clientY;
  },{passive:true});
  els.galleryViewer.addEventListener('pointerup',(event)=>{
    if(galleryViewerPointerStartX===null||galleryViewerPointerStartY===null) return;
    const dx=event.clientX-galleryViewerPointerStartX;
    const dy=event.clientY-galleryViewerPointerStartY;
    galleryViewerPointerStartX=null;
    galleryViewerPointerStartY=null;
    if(Math.abs(dx)<54||Math.abs(dx)<=Math.abs(dy)*1.15) return;
    galleryViewerMove(dx<0?1:-1);
  },{passive:true});
  window.addEventListener('keydown',(event)=>{
    if(!els.galleryViewer.classList.contains('open')) return;
    if(event.key==='Escape') closeGalleryViewer();
    else if(event.key==='ArrowLeft') galleryViewerMove(-1);
    else if(event.key==='ArrowRight') galleryViewerMove(1);
  });
}

function galleryItemPresetKey(item){
  if(item?.presetId) return `id:${item.presetId}`;
  if(item?.presetName) return `name:${item.presetName}`;
  return 'none';
}
function galleryItemPresetLabel(item){
  if(item?.presetId){
    const current=presets.find(p=>p.id===item.presetId);
    if(current?.name) return current.name;
  }
  return item?.presetName || '无预设';
}
function renderGalleryPresetFilter(items){
  if(!els.galleryPresetFilter) return;
  const groups=new Map();
  for(const item of items){
    const key=galleryItemPresetKey(item);
    const group=groups.get(key)||{key,label:galleryItemPresetLabel(item),count:0};
    group.count++;
    groups.set(key,group);
  }
  const current=galleryPresetFilter;
  els.galleryPresetFilter.replaceChildren();
  const all=document.createElement('option');
  all.value='';
  all.textContent=`全部预设 · ${items.length} 张`;
  els.galleryPresetFilter.appendChild(all);
  [...groups.values()]
    .sort((a,b)=>a.label.localeCompare(b.label,'zh-CN'))
    .forEach(group=>{
      const option=document.createElement('option');
      option.value=group.key;
      option.textContent=`${group.label} · ${group.count} 张`;
      els.galleryPresetFilter.appendChild(option);
    });
  galleryPresetFilter=groups.has(current)?current:'';
  els.galleryPresetFilter.value=galleryPresetFilter;
}
function galleryPageTokens(current,total){
  if(total<=7) return Array.from({length:total},(_,i)=>i+1);
  const values=new Set([1,total,current,current-1,current+1]);
  const pages=[...values].filter(page=>page>=1&&page<=total).sort((a,b)=>a-b);
  const tokens=[];
  for(let i=0;i<pages.length;i++){
    if(i&&pages[i]-pages[i-1]>1) tokens.push('…');
    tokens.push(pages[i]);
  }
  return tokens;
}
function renderGalleryPagination(totalItems){
  if(!els.galleryPagination) return;
  const totalPages=Math.max(1,Math.ceil(totalItems/GALLERY_PAGE_SIZE));
  galleryPage=Math.min(Math.max(1,galleryPage),totalPages);
  els.galleryPagination.replaceChildren();
  if(totalPages<=1){
    els.galleryPagination.classList.add('hidden');
    return;
  }
  els.galleryPagination.classList.remove('hidden');
  const makeNav=(label,page,disabled=false)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='gallery-page-btn';
    button.textContent=label;
    button.disabled=disabled;
    if(!disabled) button.addEventListener('click',()=>goGalleryPage(page));
    return button;
  };
  els.galleryPagination.appendChild(makeNav('‹',galleryPage-1,galleryPage<=1));
  const numbers=document.createElement('div');
  numbers.className='gallery-page-numbers';
  for(const token of galleryPageTokens(galleryPage,totalPages)){
    if(token==='…'){
      const dots=document.createElement('span');
      dots.className='gallery-page-dots';
      dots.textContent='…';
      numbers.appendChild(dots);
      continue;
    }
    const button=makeNav(String(token),token,false);
    button.classList.toggle('active',token===galleryPage);
    button.setAttribute('aria-current',token===galleryPage?'page':'false');
    numbers.appendChild(button);
  }
  els.galleryPagination.appendChild(numbers);
  els.galleryPagination.appendChild(makeNav('›',galleryPage+1,galleryPage>=totalPages));
}
async function goGalleryPage(page){
  const next=Math.max(1,Number(page)||1);
  if(next===galleryPage) return;
  galleryPage=next;
  await renderGallery();
  const top=document.querySelector('.gallery-toolbar')?.getBoundingClientRect().top??0;
  if(top<0) window.scrollTo({top:window.scrollY+top-12,behavior:'smooth'});
}
async function renderGallery(){
  try{
    const items=await getGallery();
    const validIds=new Set(items.map(item=>item.id));
    selectedGalleryIds=new Set([...selectedGalleryIds].filter(id=>validIds.has(id)));
    renderGalleryPresetFilter(items);

    const filteredItems=galleryPresetFilter
      ? items.filter(item=>galleryItemPresetKey(item)===galleryPresetFilter)
      : items;
    const totalPages=Math.max(1,Math.ceil(filteredItems.length/GALLERY_PAGE_SIZE));
    galleryPage=Math.min(Math.max(1,galleryPage),totalPages);
    const start=(galleryPage-1)*GALLERY_PAGE_SIZE;
    const pageItems=filteredItems.slice(start,start+GALLERY_PAGE_SIZE);

    if(galleryPresetFilter) els.galleryCount.textContent=`${filteredItems.length} / ${items.length} 张 · 保存在此设备`;
    else els.galleryCount.textContent=`${items.length} 张 · 保存在此设备`;
    updateBatchDeleteButton();
    renderGalleryPagination(filteredItems.length);

    const fragment=document.createDocumentFragment();
    if(!items.length){
      galleryBatchMode=false;selectedGalleryIds.clear();updateBatchDeleteButton();
      const note=document.createElement('div');
      note.className='empty-note gallery-empty-note';
      note.textContent='图库还是空的。生成第一张图后会自动保存在这里。';
      fragment.appendChild(note);
      els.galleryGrid.replaceChildren(fragment);
      return;
    }
    if(!filteredItems.length){
      galleryBatchMode=false;selectedGalleryIds.clear();updateBatchDeleteButton();
      const note=document.createElement('div');
      note.className='empty-note gallery-empty-note';
      note.textContent='这个预设还没有生成记录。';
      fragment.appendChild(note);
      els.galleryGrid.replaceChildren(fragment);
      return;
    }

    for(const item of pageItems){
      const card=document.createElement('article');
      card.className='gallery-card';
      card.dataset.galleryId=String(item.id);
      if(galleryBatchMode) card.classList.add('gallery-batch-mode');
      const selected=selectedGalleryIds.has(item.id);
      if(selected) card.classList.add('gallery-selected');

      const ib=document.createElement('button');
      ib.type='button';
      ib.className='gallery-image-btn';
      const img=document.createElement('img');
      const url=URL.createObjectURL(item.blob);
      img.src=url;
      img.onload=()=>URL.revokeObjectURL(url);
      img.onerror=()=>URL.revokeObjectURL(url);
      img.alt='图库图片';
      ib.appendChild(img);
      ib.addEventListener('click',()=>{
        if(galleryBatchMode) setGallerySelected(card,item.id,!selectedGalleryIds.has(item.id));
        else openGalleryViewer(filteredItems,filteredItems.findIndex(entry=>entry.id===item.id));
      });
      card.appendChild(ib);

      const cancel=document.createElement('button');
      cancel.type='button';
      cancel.className='gallery-selection-cancel'+(selected?'':' hidden');
      cancel.textContent='取消';
      cancel.addEventListener('click',(event)=>{event.stopPropagation();setGallerySelected(card,item.id,false);});
      card.appendChild(cancel);

      const meta=document.createElement('div');
      meta.className='gallery-meta';
      const strong=document.createElement('strong');
      strong.textContent=galleryItemPresetLabel(item)||item.model||'NAI';
      meta.appendChild(strong);
      const span=document.createElement('span');
      span.textContent=`${item.width||'?'}×${item.height||'?'} · seed ${item.seed||'?'}`;
      meta.appendChild(span);
      const actions=document.createElement('div');
      actions.className='gallery-actions';
      actions.appendChild(makeButton('保存图片','',()=>saveImageBlob(item.blob,item.seed?`nai-${item.seed}.png`:`nai-${item.id}.png`)));
      actions.appendChild(makeButton('水印版','',()=>saveWatermarkedBlob(item.blob,item.seed?`nai-${item.seed}-watermarked.png`:`nai-${item.id}-watermarked.png`).catch(e=>showToast(e?.message||'水印版生成失败'))));
      actions.appendChild(makeButton('载入','',()=>applyGalleryMeta(item)));
      actions.appendChild(makeButton('删除','danger',()=>requestDeleteConfirmation({
        title:'删除这张图片？',
        message:'这张图片会从当前设备的图库中删除。',
        confirmText:'确认删除',
        action:async()=>{await deleteGalleryItem(item.id);showToast('图片已删除');}
      })));
      meta.appendChild(actions);
      card.appendChild(meta);
      fragment.appendChild(card);
    }
    els.galleryGrid.replaceChildren(fragment);
  }catch(e){
    console.warn(e);
    showToast('图库读取失败');
  }
}
const ZIP_CRC_TABLE=(()=>{
  const table=new Uint32Array(256);
  for(let n=0;n<256;n++){
    let c=n;
    for(let k=0;k<8;k++) c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);
    table[n]=c>>>0;
  }
  return table;
})();
function zipCrcUpdate(crc,bytes){
  let c=crc>>>0;
  for(let i=0;i<bytes.length;i++) c=ZIP_CRC_TABLE[(c^bytes[i])&0xff]^(c>>>8);
  return c>>>0;
}
function zipU16(value){
  const out=new Uint8Array(2);
  new DataView(out.buffer).setUint16(0,value&0xffff,true);
  return out;
}
function zipU32(value){
  const out=new Uint8Array(4);
  new DataView(out.buffer).setUint32(0,value>>>0,true);
  return out;
}
function zipJoin(parts){
  let size=0;
  for(const part of parts) size+=part.length;
  const out=new Uint8Array(size);
  let offset=0;
  for(const part of parts){out.set(part,offset);offset+=part.length;}
  return out;
}
function zipDosDateTime(value){
  const d=value instanceof Date?value:new Date(value||Date.now());
  const year=Math.max(1980,d.getFullYear());
  const date=((year-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
  const time=(d.getHours()<<11)|(d.getMinutes()<<5)|Math.floor(d.getSeconds()/2);
  return {date:date&0xffff,time:time&0xffff};
}
function zipLocalHeader(nameBytes,stamp){
  return zipJoin([
    zipU32(0x04034b50),zipU16(20),zipU16(0x0808),zipU16(0),
    zipU16(stamp.time),zipU16(stamp.date),zipU32(0),zipU32(0),zipU32(0),
    zipU16(nameBytes.length),zipU16(0),nameBytes
  ]);
}
function zipDataDescriptor(crc,size){
  return zipJoin([zipU32(0x08074b50),zipU32(crc),zipU32(size),zipU32(size)]);
}
function zipCentralHeader(entry){
  return zipJoin([
    zipU32(0x02014b50),zipU16(20),zipU16(20),zipU16(0x0808),zipU16(0),
    zipU16(entry.stamp.time),zipU16(entry.stamp.date),zipU32(entry.crc),
    zipU32(entry.size),zipU32(entry.size),zipU16(entry.nameBytes.length),
    zipU16(0),zipU16(0),zipU16(0),zipU16(0),zipU32(0),zipU32(entry.offset),
    entry.nameBytes
  ]);
}
function zipEndOfCentralDirectory(count,centralSize,centralOffset){
  return zipJoin([
    zipU32(0x06054b50),zipU16(0),zipU16(0),zipU16(count),zipU16(count),
    zipU32(centralSize),zipU32(centralOffset),zipU16(0)
  ]);
}
async function streamStoredZipEntry({name,blob,createdAt,onChunk,offset}){
  const enc=new TextEncoder();
  const nameBytes=enc.encode(name);
  const stamp=zipDosDateTime(createdAt);
  const local=zipLocalHeader(nameBytes,stamp);
  await onChunk(local);

  let crc=0xffffffff;
  let size=0;
  if(typeof blob.stream==='function'){
    const reader=blob.stream().getReader();
    try{
      while(true){
        const part=await reader.read();
        if(part.done) break;
        const bytes=part.value instanceof Uint8Array?part.value:new Uint8Array(part.value);
        if(!bytes.length) continue;
        crc=zipCrcUpdate(crc,bytes);
        size+=bytes.length;
        await onChunk(bytes);
      }
    }finally{
      reader.releaseLock?.();
    }
  }else{
    const bytes=new Uint8Array(await blob.arrayBuffer());
    crc=zipCrcUpdate(crc,bytes);
    size=bytes.length;
    await onChunk(bytes);
  }
  crc=(crc^0xffffffff)>>>0;
  const descriptor=zipDataDescriptor(crc,size);
  await onChunk(descriptor);
  return {
    nameBytes,stamp,crc,size,offset,
    written:local.length+size+descriptor.length
  };
}

function setGalleryExportProgress(value,text){
  const pct=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
  if(els.galleryExportProgressBar) els.galleryExportProgressBar.value=pct;
  if(els.galleryExportProgressPercent) els.galleryExportProgressPercent.textContent=`${pct}%`;
  if(els.galleryExportProgressText) els.galleryExportProgressText.textContent=text||'';
}
function resetPreparedGalleryZip(){
  preparedGalleryZip=null;
  if(els.downloadGalleryZipBtn) els.downloadGalleryZipBtn.disabled=true;
}
async function buildPreparedGalleryZipBlob(exportId,chunkCount){
  const db=await openDb();
  try{
    const parts=[];
    for(let i=0;i<chunkCount;i++){
      const part=await new Promise((resolve,reject)=>{
        const tx=db.transaction('exportChunks','readonly');
        const req=tx.objectStore('exportChunks').get(`${exportId}:${i}`);
        req.onsuccess=()=>resolve(req.result?.blob||null);
        req.onerror=()=>reject(req.error);
      });
      if(!part) throw new Error(`ZIP 临时块缺失：${i+1}/${chunkCount}`);
      parts.push(part);
      if(i%64===0) await new Promise(r=>setTimeout(r,0));
    }
    return new Blob(parts,{type:'application/zip'});
  }finally{
    db.close();
  }
}
async function clearGalleryExportChunks(){
  const db=await openDb();
  try{
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('exportChunks','readwrite');
      tx.objectStore('exportChunks').clear();
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error||new Error('临时 ZIP 清理失败'));
    });
  }finally{
    db.close();
  }
}
async function exportGalleryZip(){
  const btn=els.exportGalleryZipBtn;
  if(!btn) return;
  if(!zipWorkerReady){
    showToast('下载服务还在准备，请重新打开网页后再试');
    initZipWorker().catch(()=>{});
    return;
  }

  resetPreparedGalleryZip();
  setGalleryExportProgress(0,'正在准备图库…');

  const originalLabel=btn.textContent;
  btn.disabled=true;
  btn.textContent='正在打包…';
  let db=null;
  let jobStarted=false;
  let exportId='';

  try{
    await clearGalleryExportChunks();
    db=await openDb();

    const keys=await new Promise((resolve,reject)=>{
      const tx=db.transaction('history','readonly');
      const req=tx.objectStore('history').getAllKeys();
      req.onsuccess=()=>resolve(req.result||[]);
      req.onerror=()=>reject(req.error);
    });
    if(!keys.length){
      setGalleryExportProgress(0,'图库还是空的');
      showToast('图库还是空的');
      return;
    }
    keys.sort((a,b)=>Number(b)-Number(a));

    const pad=(n)=>String(n).padStart(2,'0');
    const now=new Date();
    const day=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
    const filename=`isolde-nai-gallery-${day}.zip`;
    exportId=uid('zip');

    const writeJob=(patch)=>new Promise((resolve,reject)=>{
      const tx=db.transaction('exportChunks','readwrite');
      tx.objectStore('exportChunks').put({
        key:`${exportId}:job`,
        exportId,
        kind:'job',
        filename,
        createdAt:Date.now(),
        ...patch
      });
      tx.oncomplete=resolve;
      tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error||new Error('ZIP 状态写入失败'));
    });

    await writeJob({status:'building',chunkCount:0,totalBytes:0});
    jobStarted=true;

    const readRecord=(key)=>new Promise((resolve,reject)=>{
      const tx=db.transaction('history','readonly');
      const req=tx.objectStore('history').get(key);
      req.onsuccess=()=>resolve(req.result||null);
      req.onerror=()=>reject(req.error);
    });

    let chunkIndex=0;
    let totalBytes=0;
    let writeChain=Promise.resolve();
    const storeZipChunk=async(data)=>{
      if(!data?.length) return;
      const index=chunkIndex++;
      totalBytes+=data.length;
      const blob=new Blob([data],{type:'application/octet-stream'});
      writeChain=writeChain.then(()=>new Promise((resolve,reject)=>{
        const tx=db.transaction('exportChunks','readwrite');
        tx.objectStore('exportChunks').put({
          key:`${exportId}:${index}`,
          exportId,
          kind:'chunk',
          index,
          createdAt:Date.now(),
          blob
        });
        tx.oncomplete=resolve;
        tx.onerror=()=>reject(tx.error);
        tx.onabort=()=>reject(tx.error||new Error('ZIP 临时块写入失败'));
      }));
      await writeChain;
    };

    const centralEntries=[];
    let zipOffset=0;
    const used=new Map();
    const safe=(value)=>String(value||'').replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,'_').slice(0,60);
    let packed=0;

    for(let i=0;i<keys.length;i++){
      const item=await readRecord(keys[i]);
      if(!item?.blob) continue;

      const d=new Date(item.createdAt||Date.now());
      const stamp=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
      const seed=safe(item.seed||'noseed');
      const preset=safe(item.presetName||'nai');
      const base=`${stamp}_${preset}_seed-${seed}`;
      const duplicateCount=used.get(base)||0;
      used.set(base,duplicateCount+1);
      const name=`${base}${duplicateCount?`_${duplicateCount+1}`:''}.png`;

      const pngBlob=item.blob?.type==='image/png' ? item.blob : await encodePng(item.blob);
      const zipEntry=await streamStoredZipEntry({
        name,
        blob:pngBlob,
        createdAt:item.createdAt||Date.now(),
        onChunk:storeZipChunk,
        offset:zipOffset
      });
      centralEntries.push(zipEntry);
      zipOffset+=zipEntry.written;

      packed++;
      const pct=Math.min(98,Math.round(((i+1)/keys.length)*98));
      setGalleryExportProgress(pct,`正在打包 ${i+1} / ${keys.length}`);
      if(i%3===0) await new Promise(r=>setTimeout(r,0));
    }
    setGalleryExportProgress(99,'正在整理 ZIP…');

    const centralOffset=zipOffset;
    let centralSize=0;
    for(const entry of centralEntries){
      const header=zipCentralHeader(entry);
      centralSize+=header.length;
      zipOffset+=header.length;
      await storeZipChunk(header);
    }
    const eocd=zipEndOfCentralDirectory(centralEntries.length,centralSize,centralOffset);
    await storeZipChunk(eocd);
    await writeChain;

    await writeJob({status:'done',chunkCount:chunkIndex,totalBytes,packed,finishedAt:Date.now()});

    setGalleryExportProgress(99,'正在准备下载文件…');
    const preparedBlob=await buildPreparedGalleryZipBlob(exportId,chunkIndex);
    preparedGalleryZip={blob:preparedBlob,filename,packed,exportId};

    if(els.downloadGalleryZipBtn) els.downloadGalleryZipBtn.disabled=false;
    setGalleryExportProgress(100,`打包完成 · ${packed} 张图片`);
    showToast('图库 ZIP 已准备好');
    jobStarted=false;
  }catch(e){
    console.error(e);
    resetPreparedGalleryZip();
    setGalleryExportProgress(0,'打包失败');
    if(db&&jobStarted&&exportId){
      try{
        const tx=db.transaction('exportChunks','readwrite');
        tx.objectStore('exportChunks').put({
          key:`${exportId}:job`,
          exportId,
          kind:'job',
          status:'error',
          message:e?.message||String(e),
          createdAt:Date.now(),
          finishedAt:Date.now()
        });
      }catch{}
    }
    showToast((e?.message||String(e)).slice(0,180));
  }finally{
    if(db) db.close();
    btn.disabled=false;
    btn.textContent=originalLabel;
  }
}
async function downloadPreparedGalleryZip(){
  if(!preparedGalleryZip?.blob){
    showToast('先完成图库打包');
    return;
  }
  const btn=els.downloadGalleryZipBtn;
  const ready=preparedGalleryZip;
  if(btn) btn.disabled=true;
  try{
    const saved=await saveBlob(ready.blob,ready.filename);
    if(saved){
      setGalleryExportProgress(100,'文件已交给系统保存');
      preparedGalleryZip=null;
      clearGalleryExportChunks().catch(()=>{});
    }else{
      if(btn) btn.disabled=false;
      setGalleryExportProgress(100,`打包完成 · ${ready.packed} 张图片`);
    }
  }catch(e){
    console.error(e);
    if(btn) btn.disabled=false;
    showToast((e?.message||'ZIP 保存失败').slice(0,180));
  }
}

async function clearGallery(){
  requestDeleteConfirmation({
    title:'清空整个图库？',
    message:'所有图片都会从这台设备的浏览器存储里删除，这个操作无法撤销。',
    confirmText:'确认清空',
    action:async()=>{
      const db=await openDb();
      await new Promise((resolve,reject)=>{const tx=db.transaction('history','readwrite');tx.objectStore('history').clear();tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('图库清空失败'));});
      db.close();galleryBatchMode=false;selectedGalleryIds.clear();await renderGallery();showToast('图库已清空');
    }
  });
}

syncThemeImmediately();
verifySystemThemeAfterResume();

els.themeToggle?.addEventListener('click',()=>{
  const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
  saveThemeOverride(next);
  clearTimeout(themeProbeTimer);
  themeProbeTimer=null;
  applyTheme(next);
  showToast('已临时切换，下次 07:00 / 19:00 自动恢复');
});

if (themeMedia?.addEventListener) themeMedia.addEventListener('change',handleSystemThemeChange);
else if (themeMedia?.addListener) themeMedia.addListener(handleSystemThemeChange);

window.addEventListener('pageshow',verifySystemThemeAfterResume);
window.addEventListener('focus',verifySystemThemeAfterResume);
document.addEventListener('visibilitychange',()=>{
  if (!document.hidden) verifySystemThemeAfterResume();
});

setInterval(()=>{
  if (document.hidden) return;
  const saved=readThemeOverride();
  if (!saved) {
    const current=systemTheme();
    if (document.documentElement.dataset.theme !== current) applyTheme(current);
    return;
  }
  if (systemTheme() !== saved.systemAtOverride && !themeProbeTimer) {
    verifySystemThemeAfterResume();
  }
},2000);

els.tabs.forEach(b=>b.addEventListener('click',()=>goView(b.dataset.view)));
els.presetSelect.addEventListener('change',()=>{settings.presetId=els.presetSelect.value;updateAssembly();});
els.scenePrompt.addEventListener('input',updateAssembly);
els.extraNegative.addEventListener('input',updateAssembly);
els.qualityTags.addEventListener('input',updateAssembly);
els.qualityPosition.addEventListener('change',updateAssembly);
els.aspect.addEventListener('change',()=>setAspect(els.aspect.value));
for(const id of ['sampler','steps','cfg']) els[id].addEventListener('change',saveSettings);
els.guidanceRescale?.addEventListener('input',()=>{updateGuidanceRescaleUi();});
els.guidanceRescale?.addEventListener('change',saveSettings);
els.model.addEventListener('change',()=>{updateReferenceModelHint();updateGuidanceRescaleUi();saveSettings();});
for(const id of ['width','height']) els[id].addEventListener('change',()=>{els.aspect.value=aspectFor(Number(els.width.value),Number(els.height.value));saveSettings();});
els.seed.addEventListener('change',saveSettings);
els.clearWorkbenchBtn.addEventListener('click',()=>{els.scenePrompt.value='';els.extraNegative.value='';updateAssembly();els.scenePrompt.focus();});
els.randomSeedBtn.addEventListener('click',()=>{els.seed.value=randomSeed();saveSettings();});
els.jumpAnchorsBtn.addEventListener('click',()=>goView('anchors'));
els.quickWordsBtn?.addEventListener('pointerdown',rememberSceneInsertSelection);
els.quickWordsBtn?.addEventListener('click',(event)=>{event.stopPropagation();toggleQuickWordsMenu();});
els.quickWordsMenu?.addEventListener('pointerdown',(event)=>event.stopPropagation());
els.quickWordsMenu?.addEventListener('click',(event)=>event.stopPropagation());
els.quickWordForm?.addEventListener('submit',saveQuickWord);
els.cancelQuickWordEditBtn?.addEventListener('click',()=>resetQuickWordEditor());
els.quickWordFormCategorySelect?.addEventListener('change',()=>{
  quickWordsActiveCategory=els.quickWordFormCategorySelect.value;
  renderQuickWordList();
  renderQuickWordsMenu();
});
els.addQuickWordCategoryBtn?.addEventListener('click',()=>{
  const opening=els.newQuickWordCategoryForm?.classList.contains('hidden');
  els.quickWordCategoryList?.classList.add('hidden');
  els.newQuickWordCategoryForm?.classList.toggle('hidden',!opening);
  if(opening){
    els.newQuickWordCategoryName.value='';
    requestAnimationFrame(()=>els.newQuickWordCategoryName.focus());
  }
});
els.manageQuickWordCategoriesBtn?.addEventListener('click',()=>{
  const opening=els.quickWordCategoryList?.classList.contains('hidden');
  els.newQuickWordCategoryForm?.classList.add('hidden');
  renderQuickWordCategoryManager();
  els.quickWordCategoryList?.classList.toggle('hidden',!opening);
});
els.newQuickWordCategoryForm?.addEventListener('submit',saveNewQuickWordCategory);
els.insertAnchorPromptsBtn?.addEventListener('pointerdown',rememberSceneInsertSelection);
els.insertAnchorPromptsBtn?.addEventListener('click',(event)=>{event.stopPropagation();els.quickWordsMenu?.classList.add('hidden');renderInsertAnchorMenu();});
els.insertAnchorMenu?.addEventListener('pointerdown',(event)=>event.stopPropagation());
document.addEventListener('click',(event)=>{
  const target=event.target;
  if(!els.insertAnchorMenu?.contains(target)&&!els.insertAnchorPromptsBtn?.contains(target))els.insertAnchorMenu?.classList.add('hidden');
  if(!els.quickWordsMenu?.contains(target)&&!els.quickWordsBtn?.contains(target))els.quickWordsMenu?.classList.add('hidden');
});
document.addEventListener('keydown',(event)=>{if(event.key==='Escape'){els.insertAnchorMenu?.classList.add('hidden');els.quickWordsMenu?.classList.add('hidden');}});
els.generateBtn.addEventListener('click',()=>generate());
els.saveLink?.addEventListener('click',async()=>{
  if(!currentResultBlob){showToast('还没有可保存的图片');return;}
  const name=els.saveLink.dataset.filename || (currentSeed ? `nai-${currentSeed}.png` : `nai-${Date.now()}.png`);
  try{await saveImageBlob(currentResultBlob,name);}
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
els.importChatu8Btn?.addEventListener('click',importChatu8Presets);
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
els.addOutfitBtn?.addEventListener('click',openOutfitCreator);
els.saveOutfitBtn?.addEventListener('click',saveSharedOutfit);
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

els.apiPresetSelect?.addEventListener('change',()=>{
  const id=els.apiPresetSelect.value;
  if(id) applyApiPreset(id);
  else {
    if(els.renameApiPresetBtn) els.renameApiPresetBtn.disabled=true;
    if(els.deleteApiPresetBtn) els.deleteApiPresetBtn.disabled=true;
  }
});
els.renameApiPresetBtn?.addEventListener('click',openRenameApiPreset);
els.renameApiPresetForm?.addEventListener('submit',saveRenamedApiPreset);
els.deleteApiPresetBtn?.addEventListener('click',deleteCurrentApiPreset);
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
  try{rehydrateConnectionFields();normalizedEndpoint(els.apiFormat.value,els.endpoint.value);const key=els.apiKey.value.trim()||loadSavedToken();if(!key)throw new Error('Token 还是空的');if(!els.apiKey.value.trim())els.apiKey.value=key;persistTokenIfRemembered();saveSettings();const preset=saveCurrentApiPreset();els.settingsStatus.className='settings-status ok';els.settingsStatus.textContent=`设置已保存 · ${apiPresetLabel(preset)}`;setConnectionState('ready',isOfficialBase(els.endpoint.value)?'NAI 官网 · Token 已保存':'接口设置已保存');showToast('接口设置与 API 预设已保存');}
  catch(e){els.settingsStatus.className='settings-status bad';els.settingsStatus.textContent=e.message;}
});
els.galleryPresetFilter?.addEventListener('change',async()=>{
  galleryPresetFilter=els.galleryPresetFilter.value||'';
  galleryPage=1;
  setGalleryBatchMode(false);
  await renderGallery();
});
els.batchDeleteGalleryBtn?.addEventListener('click',()=>{
  if(!galleryBatchMode){
    selectedGalleryIds.clear();setGalleryBatchMode(true);return;
  }
  if(!selectedGalleryIds.size){
    setGalleryBatchMode(false);return;
  }
  const count=selectedGalleryIds.size;
  requestDeleteConfirmation({
    title:`删除已选的 ${count} 张图片？`,
    message:'这些图片会从当前设备的图库中删除。',
    confirmText:`删除 ${count} 张`,
    action:deleteSelectedGalleryItems
  });
});
els.clearGalleryBtn.addEventListener('click',clearGallery);
els.cancelDeleteBtn?.addEventListener('click',()=>{if(!els.confirmDeleteBtn.disabled){pendingDeleteAction=null;els.deleteConfirmDialog.close();}});
els.confirmDeleteBtn?.addEventListener('click',async()=>{
  if(!pendingDeleteAction)return;
  const action=pendingDeleteAction;
  els.confirmDeleteBtn.disabled=true;els.cancelDeleteBtn.disabled=true;
  try{await action();pendingDeleteAction=null;els.deleteConfirmDialog.close();}
  catch(e){console.error(e);els.confirmDeleteBtn.disabled=false;els.cancelDeleteBtn.disabled=false;showToast((e?.message||'删除失败').slice(0,160));}
});
els.deleteConfirmDialog?.addEventListener('cancel',(event)=>{event.preventDefault();if(!els.confirmDeleteBtn.disabled){pendingDeleteAction=null;els.deleteConfirmDialog.close();}});

els.exportGalleryZipBtn?.addEventListener('click',exportGalleryZip);
els.downloadGalleryZipBtn?.addEventListener('click',downloadPreparedGalleryZip);
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
  const files=[...(els.vibeFile.files||[])];
  if(!files.length)return;
  try{
    const documents=files.filter(file=>/\.(json|naiv4vibe|naiv4vibebundle)$/i.test(String(file.name||'')));
    const images=files.filter(file=>['image/png','image/jpeg','image/webp'].includes(file.type)||/\.(png|jpe?g|webp)$/i.test(String(file.name||'')));
    const unsupported=files.length-documents.length-images.length;
    if(unsupported)showToast('有文件未识别，仅支持 PNG、JPG、WebP、JSON、.naiv4vibe、.naiv4vibeBundle');

    for(const file of images){
      if(file.size>10*1024*1024){showToast(`${file.name} 超过 10MB，已跳过`);continue;}
    }
    const validImages=images.filter(file=>file.size<=10*1024*1024);
    if(validImages.length){
      const added=await appendVibeAssets(validImages.map(file=>({
        name:file.name||'Vibe',
        fileName:file.name||'Vibe',
        type:file.type,
        blob:file,
        previewBlob:file,
        strength:.6,
        information:.7,
        enabled:true
      })),'Multivibe');
      if(added){
        els.vibeEnabled.checked=true;
        els.referenceEnabled.checked=false;
        saveSettings();
        showToast(added<validImages.length?`已添加 ${added} 个，达到 16 个上限`:`已添加 ${added} 个 Vibe`);
      }
    }

    for(const file of documents){
      if(file.size>32*1024*1024){showToast(`${file.name} 超过 32MB，已跳过`);continue;}
      await importVibeDocumentFile(file);
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
  const has=Boolean(els.vibePresetSelect.value);
  els.loadVibePresetBtn.disabled=!has;
  els.appendVibePresetBtn.disabled=!has;
  els.deleteVibePresetBtn.disabled=!has;
});
els.loadVibePresetBtn?.addEventListener('click',()=>{
  applyVibePreset(els.vibePresetSelect.value).catch(e=>{console.error(e);showToast('Vibe 预设载入失败');});
});
els.appendVibePresetBtn?.addEventListener('click',()=>{
  appendSelectedVibePreset().catch(e=>{console.error(e);showToast('Vibe 预设追加失败');});
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
  input?.addEventListener('input',()=>{value.textContent=Number(input.value).toFixed(2);if(input===els.vibeStrength||input===els.vibeInformation)renderVibeStackUi();});
  input?.addEventListener('change',saveSettings);
}
els.watermarkOpacity?.addEventListener('input',()=>{
  els.watermarkOpacityValue.textContent=`${els.watermarkOpacity.value}%`;
});
els.watermarkOpacity?.addEventListener('change',saveSettings);
els.keepNaiMetadata?.addEventListener('change',()=>{
  saveSettings();
  showToast(els.keepNaiMetadata.checked ? '保存图片时将保留 NAI 元数据' : '保存图片时将移除 NAI 元数据');
});

window.addEventListener('message',async(event)=>{
  const data=event.data;
  if(event.origin!==window.location.origin||!data||data.source!=='isolde-nai-st'||!data.requestId)return;
  if(data.type==='getAnchors'){
    event.source?.postMessage({
      source:'isolde-nai-web',
      requestId:data.requestId,
      ok:true,
      anchors:anchors.map((item)=>({
        id:item.id,
        name:String(item.name||'').trim()
      })).filter((item)=>item.name)
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
  if(data.type==='prepareDownload'){
    try{
      if(!(data.blob instanceof Blob))throw new Error('没有收到可下载的图片');
      const keepMetadata=els.keepNaiMetadata?.checked===true;
      let output;
      let extension;
      if(data.watermarked){
        const watermarked=await addCustomWatermark(data.blob);
        output=await encodeHighQualityJpeg(watermarked,.98);
        extension='jpg';
      }else if(keepMetadata){
        output=data.blob.type==='image/png' ? data.blob : await encodePng(data.blob);
        extension='png';
      }else{
        output=await encodeHighQualityJpeg(data.blob,.98);
        extension='jpg';
      }
      event.source?.postMessage({
        source:'isolde-nai-web',
        requestId:data.requestId,
        ok:true,
        blob:output,
        extension,
        mimeType:output.type|| (extension==='jpg'?'image/jpeg':'image/png'),
        keepNaiMetadata:keepMetadata,
        watermarked:data.watermarked===true
      },event.origin);
    }catch(e){
      event.source?.postMessage({source:'isolde-nai-web',requestId:data.requestId,ok:false,error:e?.message||String(e)},event.origin);
    }
    return;
  }
  if(data.type!=='generate')return;
  const scenePlans=Array.isArray(data.scenePlans)&&data.scenePlans.length
    ? data.scenePlans.map((item)=>({
        prompt:String((item&&item.prompt)||'').trim(),
        characters:Array.isArray(item&&item.characters)?item.characters:[],
        width:Number(item&&item.width)||undefined,
        height:Number(item&&item.height)||undefined,
      })).filter((item)=>item.prompt)
    : (Array.isArray(data.scenes)?data.scenes.map((value)=>({prompt:String(value||'').trim(),characters:[]})).filter((item)=>item.prompt):[]);
  const seeds=Array.isArray(data.seeds)?data.seeds:[];
  const promptOverrides=Array.isArray(data.promptOverrides)?data.promptOverrides:[];
  const sizeOverrides=Array.isArray(data.sizeOverrides)?data.sizeOverrides:[];
  if(!scenePlans.length){
    event.source?.postMessage({source:'isolde-nai-web',requestId:data.requestId,ok:false,error:'没有收到画面词'},event.origin);
    return;
  }
  const previousScene=els.scenePrompt.value;
  const results=[];
  try{
    for(let i=0;i<scenePlans.length;i++){
      const scenePlan=scenePlans[i];
      const scene=scenePlan.prompt;
      els.scenePrompt.value=scene;
      updateAssembly();
      const requestedSeed=String(seeds[i]??'').trim();
      const seed=requestedSeed||String(Math.floor(Math.random()*4294967295));
      const override=promptOverrides[i]&&String(promptOverrides[i].positive||'').trim()?promptOverrides[i]:null;
      const automaticPrompt={...(override||assemblePrompts(false)),characters:scenePlan.characters};
      const externalSize=sizeOverrides[i]&&typeof sizeOverrides[i]==='object'?sizeOverrides[i]:null;
      const sizeOverride={
        width:Number(scenePlan.width)||Number(externalSize?.width)||undefined,
        height:Number(scenePlan.height)||Number(externalSize?.height)||undefined,
      };
      const result=await generate({
        forceSeed:seed,
        throwOnError:true,
        promptOverride:automaticPrompt,
        sizeOverride:sizeOverride.width&&sizeOverride.height?sizeOverride:null,
      });
      if(!result?.blob)throw new Error('图片生成没有返回结果');
      results.push({...result,scenePrompt:scene,characters:result.characters||resolveAutomaticCharacters(scenePlan.characters)});
    }
    event.source?.postMessage({source:'isolde-nai-web',requestId:data.requestId,ok:true,results},event.origin);
  }catch(e){
    event.source?.postMessage({source:'isolde-nai-web',requestId:data.requestId,ok:false,error:e?.message||String(e)},event.origin);
  }finally{
    els.scenePrompt.value=previousScene;
    updateAssembly();
  }
});

initGalleryViewer();
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
initZipWorker().catch(e=>console.warn('ZIP 下载服务初始化失败',e));