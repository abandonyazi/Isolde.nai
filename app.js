const $ = (id) => document.getElementById(id);
const OFFICIAL_BASE = 'https://image.novelai.net';
const SETTINGS_KEY = 'isolde_nai_settings_v2';
const PRESETS_KEY = 'isolde_nai_presets_v1';
const ANCHORS_KEY = 'isolde_nai_anchors_v1';
const DB_NAME = 'isolde-nai-gallery';
const DB_VERSION = 2;

const els = {
  tabs: [...document.querySelectorAll('.tab')],
  views: [...document.querySelectorAll('.view')],
  miniStatus: $('miniStatus'),
  connectionBanner: $('connectionBanner'), connectionText: $('connectionText'),
  presetSelect: $('presetSelect'), anchorPicker: $('anchorPicker'),
  scenePrompt: $('scenePrompt'), extraNegative: $('extraNegative'),
  qualityTags: $('qualityTags'), qualityPosition: $('qualityPosition'), protectTextBlock: $('protectTextBlock'),
  assembledPrompt: $('assembledPrompt'), assembledNegative: $('assembledNegative'),
  aspect: $('aspect'), model: $('model'), sampler: $('sampler'), width: $('width'), height: $('height'), steps: $('steps'), cfg: $('cfg'), seed: $('seed'),
  clearWorkbenchBtn: $('clearWorkbenchBtn'), randomSeedBtn: $('randomSeedBtn'), jumpAnchorsBtn: $('jumpAnchorsBtn'),
  generateBtn: $('generateBtn'), generateLabel: $('generateLabel'), generateSpinner: $('generateSpinner'),
  emptyResult: $('emptyResult'), resultWrap: $('resultWrap'), resultImage: $('resultImage'), saveLink: $('saveLink'), saveWatermarkedBtn: $('saveWatermarkedBtn'), regenBtn: $('regenBtn'), newSeedBtn: $('newSeedBtn'),
  presetList: $('presetList'), addPresetBtn: $('addPresetBtn'), presetDialog: $('presetDialog'), presetForm: $('presetForm'), presetDialogTitle: $('presetDialogTitle'), presetId: $('presetId'), presetName: $('presetName'), presetPositive: $('presetPositive'), presetNegative: $('presetNegative'),
  anchorList: $('anchorList'), addAnchorBtn: $('addAnchorBtn'), anchorDialog: $('anchorDialog'), anchorForm: $('anchorForm'), anchorDialogTitle: $('anchorDialogTitle'), anchorId: $('anchorId'), anchorName: $('anchorName'), anchorPrompt: $('anchorPrompt'),
  galleryGrid: $('galleryGrid'), galleryCount: $('galleryCount'), clearGalleryBtn: $('clearGalleryBtn'),
  apiFormat: $('apiFormat'), endpoint: $('endpoint'), endpointHint: $('endpointHint'), apiKey: $('apiKey'), rememberKey: $('rememberKey'), toggleKeyBtn: $('toggleKeyBtn'), testBtn: $('testBtn'), saveSettingsBtn: $('saveSettingsBtn'), exportGalleryZipBtn: $('exportGalleryZipBtn'), settingsStatus: $('settingsStatus'),
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

function uid(prefix='id') {
  if (crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || '') || fallback; } catch { return fallback; }
}
function saveJson(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
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
  return isOfficialBase(base) ? `${location.origin}/nai-api` : base;
}
function updateEndpointUi() {
  if (els.apiFormat.value === 'nai') {
    if (!els.endpoint.value.trim()) els.endpoint.value = OFFICIAL_BASE;
    els.endpointHint.textContent = 'NAI 官方当前基址。保持默认时会经你自己的站点安全转发，Safari 不会被 CORS 卡住。';
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
  els.apiKey.value = settings.rememberKey === false ? '' : (settings.apiKey || '');
  els.rememberKey.checked = settings.rememberKey !== false;
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
  settings = {
    ...settings,
    apiFormat: els.apiFormat.value,
    endpoint: els.endpoint.value.trim() || OFFICIAL_BASE,
    rememberKey: els.rememberKey.checked,
    apiKey: els.rememberKey.checked ? els.apiKey.value.trim() : '',
    model: els.model.value, sampler: els.sampler.value,
    width: Number(els.width.value), height: Number(els.height.value),
    steps: Number(els.steps.value), cfg: Number(els.cfg.value),
    qualityTags: els.qualityTags.value.trim(),
    qualityPosition: els.qualityPosition.value,
    protectTextBlock: els.protectTextBlock.checked,
    scenePrompt: els.scenePrompt.value,
    extraNegative: els.extraNegative.value,
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
function assemblePrompts() {
  const preset = currentPreset();
  const explicitPlaceholderNames = characterPlaceholderNames(cleanJoin([preset?.positive || '', els.scenePrompt.value]));
  const anchorText = selectedAnchors().filter(a=>!explicitPlaceholderNames.has(a.name)).map(a=>a.prompt);
  const positive = expandCharacterPlaceholders(cleanJoin([preset?.positive || '', ...anchorText, els.scenePrompt.value]));
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
function ucPresetNoneIndex(model) {
  if (model==='nai-diffusion-4-5-curated') return 3;
  if (model.startsWith('nai-diffusion-4')) return 2;
  return 4;
}
function buildNaiPayload(seed=null) {
  const {positive,negative}=assemblePrompts();
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
async function generate({forceSeed=null}={}) {
  if(busy) return;
  const key=els.apiKey.value.trim();
  if(!key){ goView('settings'); showToast('先填 Token'); return; }
  if(!assemblePrompts().positive.trim()){ showToast('画面词和预设都是空的'); els.scenePrompt.focus(); return; }
  let endpoint; try{endpoint=normalizedEndpoint(els.apiFormat.value,els.endpoint.value);}catch(e){showToast(e.message);return;}
  const seed = forceSeed !== null ? String(forceSeed).trim() : els.seed.value.trim();
  currentSeed = seed;
  const naiBody=buildNaiPayload(seed || null);
  busy=true; els.generateBtn.disabled=true; els.generateLabel.textContent='生成中'; els.generateSpinner.classList.remove('hidden'); setConnectionState('ready','正在生成…');
  try{
    let blob;
    if(els.apiFormat.value==='nai'){
      const base=naiFetc
...[output truncated]