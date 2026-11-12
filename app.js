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
    await addGallery(blob,{
      seed,scenePrompt:els.scenePrompt.value,extraNegative:els.extraNegative.value,
      assembledPrompt:naiBody.input,assembledNegative:naiBody.parameters.negative_prompt,
      presetId:p?.id||'',presetName:p?.name||'',anchorIds:[...selectedAnchorIds],
      model:els.model.value,sampler:els.sampler.value,width:Number(els.width.value),height:Number(els.height.value),
      steps:Number(els.steps.value),cfg:Number(els.cfg.value),createdAt:Date.now()
    });
    saveSettings(); setConnectionState('ready','生成完成'); showToast('已生成并保存到图库');
  }catch(e){
    console.error(e); setConnectionState('error','生成失败');
    const msg=e?.message||String(e); showToast(msg.slice(0,200));
  }finally{
    busy=false; els.generateBtn.disabled=false; els.generateLabel.textContent='生成'; els.generateSpinner.classList.add('hidden');
  }
}
function showResult(blob,seed){
  if(currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
  currentResultBlob=blob;
  currentObjectUrl=URL.createObjectURL(blob); els.resultImage.src=currentObjectUrl; els.saveLink.href=currentObjectUrl; els.saveLink.download=seed ? `nai-${seed}.png` : `nai-${Date.now()}.png`;
  els.emptyResult.classList.add('hidden'); els.resultWrap.classList.remove('hidden');
}
function saveBlob(blob,name){
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);
}
function loadCanvasImage(src){
  return new Promise((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>resolve(image);
    image.onerror=()=>reject(new Error('水印素材读取失败'));
    image.src=src;
  });
}
function drawWatermarkPaw(ctx,x,y,size){
  ctx.save(); ctx.translate(x,y);
  ctx.fillStyle='rgba(230,145,174,.86)';
  ctx.strokeStyle='rgba(255,255,255,.72)';
  ctx.lineWidth=Math.max(1,size*.022);
  const dot=(dx,dy,r)=>{ctx.beginPath();ctx.arc(dx,dy,r,0,Math.PI*2);ctx.fill();ctx.stroke();};
  dot(0,size*.12,size*.22); dot(-size*.28,-size*.12,size*.1); dot(-size*.1,-size*.26,size*.1); dot(size*.12,-size*.25,size*.1); dot(size*.3,-size*.08,size*.1);
  ctx.restore();
}
async function addIsoldeWatermark(source){
  const sourceUrl=URL.createObjectURL(source);
  try{
    const [image,badge]=await Promise.all([loadCanvasImage(sourceUrl),loadCanvasImage('./isolde-watermark.svg?v=12')]);
    const canvas=document.createElement('canvas');
    canvas.width=image.naturalWidth; canvas.height=image.naturalHeight;
    const ctx=canvas.getContext('2d');
    if(!ctx) throw new Error('浏览器无法生成水印');
    ctx.drawImage(image,0,0);
    const w=canvas.width,h=canvas.height,short=Math.max(1,Math.min(w,h));
    const paw=Math.max(18,short*.045),stepX=Math.max(120,short*.27),stepY=Math.max(105,short*.23),fontSize=Math.max(13,short*.024),latticeStep=Math.max(120,short*.24);

    ctx.save();
    ctx.globalAlpha=.11;
    ctx.strokeStyle='rgba(226,146,173,.92)';
    ctx.lineWidth=Math.max(1,short*.0016);
    ctx.setLineDash([Math.max(3,short*.005),Math.max(6,short*.009)]);
    for(let offset=-h;offset<w+h;offset+=latticeStep){
      ctx.beginPath();ctx.moveTo(offset,0);ctx.lineTo(offset+h,h);ctx.stroke();
      ctx.beginPath();ctx.moveTo(offset,0);ctx.lineTo(offset-h,h);ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(w/2,h/2); ctx.rotate(-Math.PI/12); ctx.translate(-w/2,-h/2);
    ctx.globalAlpha=.14;
    ctx.font=`700 ${fontSize}px "Brush Script MT","Segoe Script",cursive`;
    ctx.textBaseline='middle';
    ctx.fillStyle='rgba(225,137,168,.98)';
    ctx.strokeStyle='rgba(255,255,255,.72)';
    ctx.lineWidth=Math.max(1,fontSize*.07);
    for(let y=-stepY*2,row=0;y<h+stepY*2;y+=stepY,row++){
      for(let x=-stepX*2+(row%2?stepX/2:0);x<w+stepX*2;x+=stepX){
        drawWatermarkPaw(ctx,x,y,paw);
        const tx=x+paw*.62;
        ctx.strokeText('by Isolde',tx,y+paw*.05);
        ctx.fillText('by Isolde',tx,y+paw*.05);
      }
    }
    ctx.restore();

    const badgeWidth=Math.min(short*.15,180);
    const badgeHeight=badgeWidth*(badge.naturalHeight/Math.max(1,badge.naturalWidth));
    const margin=Math.max(12,short*.022);
    ctx.save(); ctx.globalAlpha=.50;
    ctx.drawImage(badge,w-badgeWidth-margin,h-badgeHeight-margin,badgeWidth,badgeHeight);
    ctx.restore();

    return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('水印导出失败')),'image/png'));
  }finally{
    URL.revokeObjectURL(sourceUrl);
  }
}
async function saveWatermarkedBlob(blob,name){
  const watermarked=await addIsoldeWatermark(blob);
  saveBlob(watermarked,name);
}
async function testConnection(){
  els.settingsStatus.className='settings-status'; els.settingsStatus.textContent='测试中…';
  try{
    const key=els.apiKey.value.trim(); if(!key) throw new Error('先填写 Token');
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
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('history')) db.createObjectStore('history',{keyPath:'id',autoIncrement:true});};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
}
async function addGallery(blob,meta){
  const db=await openDb();
  await new Promise((resolve,reject)=>{const tx=db.transaction('history','readwrite');tx.objectStore('history').add({blob,...meta});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});
  db.close();
}
async function getGallery(){
  const db=await openDb();const items=await new Promise((resolve,reject)=>{const tx=db.transaction('history','readonly');const req=tx.objectStore('history').getAll();req.onsuccess=()=>resolve(req.result||[]);req.onerror=()=>reject(req.error);});db.close();return items.sort((a,b)=>(b.id||0)-(a.id||0));
}
async function deleteGalleryItem(id){
  const db=await openDb();await new Promise((resolve,reject)=>{const tx=db.transaction('history','readwrite');tx.objectStore('history').delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});db.close();renderGallery();
}
function applyGalleryMeta(item){
  els.scenePrompt.value=item.scenePrompt??item.prompt??'';
  els.extraNegative.value=item.extraNegative??item.negative??'';
  if(item.presetId&&presets.some(p=>p.id===item.presetId)) els.presetSelect.value=item.presetId;
  selectedAnchorIds=(item.anchorIds||[]).filter(id=>anchors.some(a=>a.id===id));
  if(item.model) els.model.value=item.model;if(item.sampler)els.sampler.value=item.sampler;
  if(item.width)els.width.value=item.width;if(item.height)els.height.value=item.height;
  if(item.steps)els.steps.value=item.steps;if(item.cfg!=null)els.cfg.value=item.cfg;
  els.seed.value=item.seed||'';currentSeed=item.seed||'';els.aspect.value=aspectFor(Number(els.width.value),Number(els.height.value));
  renderAnchorPicker();updateAssembly();showResult(item.blob,item.seed||'gallery');goView('workbench');
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
      const actions=document.createElement('div');actions.className='gallery-actions';actions.appendChild(makeButton('原图','',()=>saveBlob(item.blob,item.seed?`nai-${item.seed}.png`:`nai-${item.id}.png`)));actions.appendChild(makeButton('水印版','',()=>saveWatermarkedBlob(item.blob,item.seed?`nai-${item.seed}-by-isolde.png`:`nai-${item.id}-by-isolde.png`).catch(e=>showToast(e?.message||'水印版生成失败'))));actions.appendChild(makeButton('载入','',()=>applyGalleryMeta(item)));actions.appendChild(makeButton('删除','danger',()=>deleteGalleryItem(item.id)));meta.appendChild(actions);card.appendChild(meta);els.galleryGrid.appendChild(card);
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

els.tabs.forEach(b=>b.addEventListener('click',()=>goView(b.dataset.view)));
els.presetSelect.addEventListener('change',()=>{settings.presetId=els.presetSelect.value;updateAssembly();});
els.scenePrompt.addEventListener('input',updateAssembly);
els.extraNegative.addEventListener('input',updateAssembly);
els.qualityTags.addEventListener('input',updateAssembly);
els.qualityPosition.addEventListener('change',updateAssembly);
els.protectTextBlock.addEventListener('change',updateAssembly);
els.aspect.addEventListener('change',()=>setAspect(els.aspect.value));
for(const id of ['model','sampler','steps','cfg']) els[id].addEventListener('change',saveSettings);
for(const id of ['width','height']) els[id].addEventListener('change',()=>{els.aspect.value=aspectFor(Number(els.width.value),Number(els.height.value));saveSettings();});
els.seed.addEventListener('change',saveSettings);
els.clearWorkbenchBtn.addEventListener('click',()=>{els.scenePrompt.value='';els.extraNegative.value='';updateAssembly();els.scenePrompt.focus();});
els.randomSeedBtn.addEventListener('click',()=>{els.seed.value=randomSeed();saveSettings();});
els.jumpAnchorsBtn.addEventListener('click',()=>goView('anchors'));
els.generateBtn.addEventListener('click',()=>generate());
els.saveWatermarkedBtn?.addEventListener('click',async()=>{if(!currentResultBlob){showToast('还没有可保存的图片');return;}const old=els.saveWatermarkedBtn.textContent;els.saveWatermarkedBtn.disabled=true;els.saveWatermarkedBtn.textContent='加水印中…';try{await saveWatermarkedBlob(currentResultBlob,currentSeed?`nai-${currentSeed}-by-isolde.png`:`nai-${Date.now()}-by-isolde.png`);}catch(e){showToast(e?.message||'水印版生成失败');}finally{els.saveWatermarkedBtn.disabled=false;els.saveWatermarkedBtn.textContent=old;}});
els.regenBtn.addEventListener('click',()=>{
  const seed = currentSeed || els.seed.value.trim();
  if(!seed){ showToast('当前没有固定 Seed'); return; }
  generate({forceSeed:seed});
});
els.newSeedBtn.addEventListener('click',()=>{els.seed.value=randomSeed();generate({forceSeed:els.seed.value});});

els.addPresetBtn.addEventListener('click',()=>openPresetEditor());
els.presetForm.addEventListener('submit',(e)=>{
  e.preventDefault();const name=els.presetName.value.trim();if(!name)return;
  const id=els.presetId.value||uid('preset');const item={id,name,positive:els.presetPositive.value.trim(),negative:els.presetNegative.value.trim(),updatedAt:Date.now()};
  const idx=presets.findIndex(p=>p.id===id);if(idx>=0)presets[idx]={...presets[idx],...item};else presets.unshift(item);
  saveJson(PRESETS_KEY,presets);settings.presetId=id;renderPresetSelect();els.presetSelect.value=id;renderPresetLibrary();updateAssembly();els.presetDialog.close();showToast('预设已保存');
});
els.addAnchorBtn.addEventListener('click',()=>openAnchorEditor());
els.anchorForm.addEventListener('submit',(e)=>{
  e.preventDefault();const name=els.anchorName.value.trim();if(!name)return;
  const id=els.anchorId.value||uid('anchor');const item={id,name,prompt:els.anchorPrompt.value.trim(),updatedAt:Date.now()};
  const idx=anchors.findIndex(a=>a.id===id);if(idx>=0)anchors[idx]={...anchors[idx],...item};else anchors.unshift(item);
  saveJson(ANCHORS_KEY,anchors);renderAnchors();updateAssembly();els.anchorDialog.close();showToast('角色锚点已保存');
});
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close)?.close()));

els.apiFormat.addEventListener('change',()=>{updateEndpointUi();saveSettings();});
els.toggleKeyBtn.addEventListener('click',()=>{const hidden=els.apiKey.type==='password';els.apiKey.type=hidden?'text':'password';els.toggleKeyBtn.textContent=hidden?'隐藏':'显示';});
els.testBtn.addEventListener('click',testConnection);
els.saveSettingsBtn.addEventListener('click',()=>{
  try{normalizedEndpoint(els.apiFormat.value,els.endpoint.value);if(!els.apiKey.value.trim())throw new Error('Token 还是空的');saveSettings();els.settingsStatus.className='settings-status ok';els.settingsStatus.textContent='设置已保存';setConnectionState('ready',isOfficialBase(els.endpoint.value)?'NAI 官网 · Token 已保存':'接口设置已保存');showToast('接口设置已保存');}
  catch(e){els.settingsStatus.className='settings-status bad';els.settingsStatus.textContent=e.message;}
});
els.clearGalleryBtn.addEventListener('click',clearGallery);
els.exportGalleryZipBtn?.addEventListener('click',exportGalleryZip);

loadState();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});