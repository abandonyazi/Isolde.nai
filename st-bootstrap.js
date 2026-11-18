const VERSION = '0.9.37';
const MAIN_MODULE = './st-extension.js?ver=' + VERSION;
const WORKBENCH_URL = new URL('./index.html?embed=1&ver=' + VERSION, import.meta.url).href;
const WAND_ENTRY_ID = 'isolde-nai-wand-entry';
const FALLBACK_HOST_ID = 'isolde-nai-bootstrap-host';
const SETTINGS_ENTRY_ID = 'isolde-nai-settings-entry';
const STATUS_ID = 'isolde-nai-bootstrap-status';

function closeWandMenu() {
  const menu = document.getElementById('extensionsMenu');
  if (menu) menu.style.display = 'none';
}

function ensureFallbackWorkbench() {
  let host = document.getElementById(FALLBACK_HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = FALLBACK_HOST_ID;
    host.style.setProperty('display', 'contents', 'important');
    document.body.appendChild(host);
  }

  const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
  let panel = shadow.getElementById('isolde-nai-bootstrap-workbench');
  if (panel) return panel;

  const style = document.createElement('style');
  style.textContent = `
    :host{all:initial}
    *{box-sizing:border-box}
    #isolde-nai-bootstrap-workbench{
      position:fixed;
      top:0;
      right:0;
      bottom:0;
      left:0;
      width:100%;
      height:100vh;
      height:100dvh;
      z-index:2147483000;
      display:none;
      align-items:flex-end;
      justify-content:center;
      background:rgba(9,14,22,.54);
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px);
      font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;
    }
    .isolde-fallback-window{
      width:min(100%,860px);
      height:94vh;
      height:94dvh;
      display:grid;
      grid-template-rows:auto minmax(0,1fr);
      overflow:hidden;
      background:#f3f7fb;
      border-radius:20px 20px 0 0;
      box-shadow:0 -12px 40px rgba(0,0,0,.22);
    }
    .isolde-fallback-bar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      min-height:54px;
      padding:10px 14px;
      padding-top:max(10px,env(safe-area-inset-top));
      background:rgba(18,35,50,.96);
      color:#eef6fb;
    }
    .isolde-fallback-bar strong{font-size:16px}
    .isolde-fallback-bar button{
      border:1px solid rgba(255,255,255,.22);
      border-radius:999px;
      padding:7px 13px;
      background:rgba(255,255,255,.10);
      color:inherit;
      font:inherit;
    }
    iframe{
      display:block;
      width:100%;
      height:100%;
      min-width:0;
      min-height:0;
      border:0;
      background:#f3f7fb;
    }
    @media(max-width:640px){
      .isolde-fallback-window{
        width:100%;
        max-width:none;
        height:96vh;
        height:96dvh;
      }
    }
  `;

  panel = document.createElement('section');
  panel.id = 'isolde-nai-bootstrap-workbench';
  panel.setAttribute('aria-label', 'Isolde.nai 工作台兜底');

  const windowEl = document.createElement('div');
  windowEl.className = 'isolde-fallback-window';

  const bar = document.createElement('div');
  bar.className = 'isolde-fallback-bar';

  const title = document.createElement('strong');
  title.textContent = 'Isolde.nai · 酒馆版';

  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = '收起';
  close.addEventListener('click', () => {
    panel.style.display = 'none';
  });

  const iframe = document.createElement('iframe');
  iframe.title = 'Isolde.nai 工作台';
  iframe.loading = 'eager';
  iframe.src = WORKBENCH_URL;

  bar.append(title, close);
  windowEl.append(bar, iframe);
  panel.appendChild(windowEl);
  shadow.append(style, panel);
  return panel;
}

function openWorkbench() {
  closeWandMenu();

  if (typeof globalThis.IsoldeNaiOpenWorkbench === 'function') {
    globalThis.IsoldeNaiOpenWorkbench();
    return;
  }

  const panel = ensureFallbackWorkbench();
  panel.style.display = 'flex';
}

function ensureWandEntry() {
  if (document.getElementById(WAND_ENTRY_ID)) return true;
  const menu = document.getElementById('extensionsMenu');
  if (!menu) return false;

  const container = document.createElement('div');
  container.id = 'isolde-nai-wand-container';
  container.className = 'extension_container interactable';
  container.tabIndex = 0;

  const item = document.createElement('a');
  item.id = WAND_ENTRY_ID;
  item.className = 'list-group-item';
  item.href = '#';
  item.title = 'Isolde.nai';

  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-palette';

  const label = document.createElement('span');
  label.textContent = 'Isolde.nai';

  item.append(icon, label);
  item.addEventListener('click', (event) => {
    event.preventDefault();
    openWorkbench();
  });
  container.appendChild(item);
  menu.appendChild(container);
  return true;
}

function installWandEntry() {
  if (ensureWandEntry()) return;
  const timer = window.setInterval(() => {
    if (ensureWandEntry()) window.clearInterval(timer);
  }, 500);
  window.setTimeout(() => window.clearInterval(timer), 30000);
}

function setBootstrapStatus(text, tone = 'normal') {
  const status = document.getElementById(STATUS_ID);
  if (!status) return;
  status.textContent = text;
  status.style.opacity = tone === 'error' ? '1' : '.75';
  status.style.color = tone === 'error' ? '#d66' : '';
}

function ensureSettingsEntry() {
  if (document.getElementById(SETTINGS_ENTRY_ID)) return true;
  const root = document.getElementById('extensions_settings');
  if (!root) return false;

  const section = document.createElement('div');
  section.id = SETTINGS_ENTRY_ID;
  section.className = 'extension-settings';

  const drawer = document.createElement('div');
  drawer.className = 'inline-drawer';

  const header = document.createElement('div');
  header.className = 'inline-drawer-toggle inline-drawer-header';

  const title = document.createElement('b');
  title.textContent = 'Isolde.nai';

  const chevron = document.createElement('div');
  chevron.className = 'inline-drawer-icon fa-solid fa-circle-chevron-down';

  const body = document.createElement('div');
  body.className = 'inline-drawer-content';

  const status = document.createElement('div');
  status.id = STATUS_ID;
  status.textContent = '酒馆扩展已安装 · 正在加载主插件';
  status.style.marginBottom = '10px';
  status.style.opacity = '.75';

  const openButton = document.createElement('button');
  openButton.type = 'button';
  openButton.className = 'menu_button';
  openButton.textContent = '打开 Isolde.nai 工作台';
  openButton.style.width = '100%';
  openButton.addEventListener('click', openWorkbench);

  const hint = document.createElement('div');
  hint.textContent = '悬浮球不可见时，可从这里或魔法棒菜单进入。';
  hint.style.marginTop = '8px';
  hint.style.fontSize = '.85em';
  hint.style.opacity = '.65';

  body.append(status, openButton, hint);
  header.append(title, chevron);
  drawer.append(header, body);
  section.appendChild(drawer);
  root.prepend(section);
  return true;
}

function installSettingsEntry() {
  if (ensureSettingsEntry()) return;
  const timer = window.setInterval(() => {
    if (ensureSettingsEntry()) window.clearInterval(timer);
  }, 500);
  window.setTimeout(() => window.clearInterval(timer), 30000);
}

installWandEntry();
installSettingsEntry();

import(MAIN_MODULE)
  .then(() => {
    queueMicrotask(() => {
      setBootstrapStatus(
        typeof globalThis.IsoldeNaiOpenWorkbench === 'function'
          ? '主插件已加载 · 工作台可用'
          : '主插件已载入 · 正在初始化界面'
      );
    });
    window.setTimeout(() => {
      if (typeof globalThis.IsoldeNaiOpenWorkbench === 'function') {
        setBootstrapStatus('主插件已加载 · 工作台可用');
      }
    }, 300);
  })
  .catch((error) => {
    console.error('[Isolde.nai] main extension failed to load; fallback entry remains available.', error);
    setBootstrapStatus('主插件加载失败 · 已启用兜底工作台', 'error');
    const item = document.getElementById(WAND_ENTRY_ID);
    if (item) item.title = 'Isolde.nai 主插件加载失败 · 点击打开兜底工作台';
  });
