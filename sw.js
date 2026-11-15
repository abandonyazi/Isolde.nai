const CACHE = 'isolde-nai-v59';
const SHELL = ['./', './index.html', './app.css?v=32', './app.js?v=54', './manifest.webmanifest', './icon.svg?v=16'];
const DB_NAME = 'isolde-nai-gallery';
const DB_VERSION = 4;

function openExportDb(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains('history')) db.createObjectStore('history',{keyPath:'id',autoIncrement:true});
      if(!db.objectStoreNames.contains('assets')) db.createObjectStore('assets',{keyPath:'key'});
      if(!db.objectStoreNames.contains('exportChunks')) db.createObjectStore('exportChunks',{keyPath:'key'});
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
}

function readExportChunk(db,exportId,index){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('exportChunks','readonly');
    const req=tx.objectStore('exportChunks').get(`${exportId}:${index}`);
    req.onsuccess=()=>resolve(req.result?.blob||null);
    req.onerror=()=>reject(req.error);
  });
}

function clearExportChunks(db,exportId){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('exportChunks','readwrite');
    const store=tx.objectStore('exportChunks');
    const req=store.openCursor();
    req.onsuccess=()=>{
      const cursor=req.result;
      if(!cursor) return;
      if(cursor.value?.exportId===exportId) cursor.delete();
      cursor.continue();
    };
    req.onerror=()=>reject(req.error);
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error||new Error('export cleanup failed'));
  });
}

async function exportResponse(url){
  const match=url.pathname.match(/\/__isolde_export__\/([^/]+)$/);
  if(!match) return null;
  const exportId=decodeURIComponent(match[1]);
  const count=Math.max(0,Number(url.searchParams.get('chunks'))||0);
  const size=Math.max(0,Number(url.searchParams.get('size'))||0);
  const rawName=url.searchParams.get('name')||'isolde-nai-gallery.zip';
  const filename=rawName.replace(/[\r\n"]/g,'_');

  if(!exportId||!count) return new Response('Invalid export request',{status:400});

  const db=await openExportDb();
  let index=0;
  let finished=false;

  const cleanup=async()=>{
    if(finished) return;
    finished=true;
    try{ await clearExportChunks(db,exportId); }catch{}
    try{ db.close(); }catch{}
  };

  const stream=new ReadableStream({
    async pull(controller){
      try{
        if(index>=count){
          controller.close();
          await cleanup();
          return;
        }
        const blob=await readExportChunk(db,exportId,index);
        if(!blob) throw new Error(`Missing ZIP chunk ${index+1}/${count}`);
        const bytes=new Uint8Array(await blob.arrayBuffer());
        index++;
        controller.enqueue(bytes);
      }catch(err){
        controller.error(err);
        await cleanup();
      }
    },
    async cancel(){
      await cleanup();
    }
  });

  const headers=new Headers({
    'Content-Type':'application/zip',
    'Content-Disposition':`attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    'Cache-Control':'no-store, no-cache, must-revalidate',
    'Pragma':'no-cache',
    'X-Content-Type-Options':'nosniff'
  });
  if(size) headers.set('Content-Length',String(size));
  return new Response(stream,{status:200,headers});
}

self.addEventListener('message',(event)=>{
  if(event.data?.type==='ISOLDE_ZIP_PING'){
    event.ports?.[0]?.postMessage({ok:true,feature:'isolde-zip-stream-v1'});
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  if(url.pathname.includes('/__isolde_export__/')){
    event.respondWith(exportResponse(url));
    return;
  }

  event.respondWith(
    fetch(req, { cache: 'no-store' })
      .then((resp) => {
        if (resp && resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return resp;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});