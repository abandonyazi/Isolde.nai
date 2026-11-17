const MAIN_MODULE = './st-extension.js';
const WORKBENCH_URL = new URL('./index.html?embed=1', import.meta.url).href;
const WAND_ENTRY_ID = 'isolde-nai-wand-entry';
const FALLBACK_ID = 'isolde-nai-bootstrap-workbench';
const SETTINGS_ENTRY_ID = 'isolde-nai-settings-entry';
const STATUS_ID = 'isolde-nai-bootstrap-status';

function closeWandMenu() {
  const menu = document.getElementById('extensionsMenu');
  if (menu) menu.style.display = 'none';
}

function closeFallbackWorkbench() {
  const panel = document.getElementById(FALLBACK_ID);
  if (panel) panel.style.display = 'none';
}

function ensureFallbackWorkbench() {
  let panel = document.getElementById(FALLBACK_ID);
  if (panel) return panel;

  panel = document.createElement('section');
  panel.id = FALLBACK_ID;
  panel.setAttribute('aria-label', 'Isolde.nai 工作台');
  Object.assign(panel.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '32000',
    display: 'none',
    flexDirection: 'column',
    background: 'rgba(9, 14, 22, .96)',
  });

  const bar = document.createElement('div');
  Object.assign(bar.style, {
    minHeight: '48px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    background: 'rgba(20, 28, 40, .96)',
    color: '#fff',
    borderBottom: '1px solid rgba(255,255,255,.12)',
  });

  const title = document.createElement('strong');
  title.textContent = 'Isolde.nai · 酒馆版';

  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = '收起';
  Object.assign(close.style, {
    padding: '7px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,.18)',
    background: 'rgba(255,255,255,.08)',
    color: '#fff',
  });
  close.addEventListener('click', closeFallbackWorkbench);

  const iframe = document.createElement('iframe');
  iframe.title = 'Isolde.nai 工作台';
  iframe.src = WORKBENCH_URL;
  Object.assign(iframe.style, {
    flex: '1 1 auto',
    width: '100%',
    minHeight: '0',
    border: '0',
    background: '#fff',
  });

  bar.append(title, close);
  panel.append(bar, iframe);
  document.body.appendChild(panel);
  return panel;
}

function openWorkbench() {
  closeWandMenu();

  const nativeWorkbench = document.getElementById('isolde-nai-workbench');
  if (nativeWorkbench) {
    nativeWorkbench.classList.add('open');
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
  container.className = 'extension_container';

  const item = document.createElement('div');
  item.id = WAND_ENTRY_ID;
  item.className = 'list-group-item flex-container flexGap5 interactable';
  item.title = '打开 Isolde.nai';

  const icon = document.createElement('div');
  icon.className = 'fa-fw fa-solid fa-palette extensionsMenuExtensionButton';

  const label = document.createElement('span');
  label.textContent = 'Isolde.nai';

  item.append(icon, label);
  item.addEventListener('click', openWorkbench);
  container.appendChild(item);
  menu.prepend(container);
  return true;
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

  const observer = new MutationObserver(() => {
    if (ensureSettingsEntry()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.setTimeout(() => observer.disconnect(), 30000);
}

function installWandEntry() {
  if (ensureWandEntry()) return;

  const observer = new MutationObserver(() => {
    if (ensureWandEntry()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.setTimeout(() => observer.disconnect(), 30000);
}

installWandEntry();
installSettingsEntry();

import(MAIN_MODULE)
  .then(() => {
    setBootstrapStatus('主插件已加载 · 工作台可用');
  })
  .catch((error) => {
    console.error('[Isolde.nai] main extension failed to load; fallback entries remain available.', error);
    setBootstrapStatus('主插件加载失败 · 仍可打开工作台', 'error');
    const item = document.getElementById(WAND_ENTRY_ID);
    if (item) item.title = 'Isolde.nai 主插件加载失败 · 点击打开工作台';
  });
