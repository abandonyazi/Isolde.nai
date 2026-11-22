const CACHE = 'isolde-nai-v96';
const SHELL = ['./', './index.html', './app.css?v=55', './app.js?v=90', './manifest.webmanifest', './icon.svg?v=16'];
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

function readExportRecord(db,key){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('exportChunks','readonly');
    const req=tx.objectStore('exportChunks').get(key);
    req.onsuccess=()=>resolve(req.result||null);
    req.onerror=()=>reject(req.error);
  });
}

function deleteExportRecord(db,key){
  return new Promise((resolve,reject)=>{
    const tx=db.transaction('exportChunks','readwrite');
    tx.objectStore('exportChunks').delete(key);
    tx.oncomplete=resolve;
    tx.onerror=()=>reject(tx.error);
    tx.onabort=()=>reject(tx.error||new Error('export cleanup failed'));
  });
}

function clearExportRecords(db,exportId){
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

const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function exportResponse(url){
  const match=url.pathname.match(/\/__isolde_export__\/([^/]+)(?:\/[^/]+)?$/);
  if(!match) return null;

  const exportId=decodeURIComponent(match[1]);
  const rawName=url.searchParams.get('name')||'isolde-nai-gallery.zip';
  const filename=rawName.replace(/[\r\n"]/g,'_');
  const started=Math.max(0,Number(url.searchParams.get('started'))||Date.now());

  if(!exportId) return new Response('Invalid export request',{status:400});

  const db=await openExportDb();
  let index=0;
  let finished=false;

  const cleanup=async()=>{
    if(finished) return;
    finished=true;
    try{ await clearExportRecords(db,exportId); }catch{}
    try{ db.close(); }catch{}
  };

  const stream=new ReadableStream({
    async pull(controller){
      try{
        while(true){
          const chunkKey=`${exportId}:${index}`;
          const chunk=await readExportRecord(db,chunkKey);
          if(chunk?.blob){
            const bytes=new Uint8Array(await chunk.blob.arrayBuffer());
            await deleteExportRecord(db,chunkKey).catch(()=>{});
            index++;
            controller.enqueue(bytes);
            return;
          }

          const job=await readExportRecord(db,`${exportId}:job`);
          if(job?.status==='error'){
            throw new Error(job.message||'ZIP 打包失败');
          }
          if(job?.status==='done'){
            const total=Math.max(0,Number(job.chunkCount)||0);
            if(index>=total){
              controller.close();
              await cleanup();
              return;
            }
          }

          if(Date.now()-started>15*60*1000){
            throw new Error('ZIP 下载等待超时');
          }
          await sleep(90);
        }
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
    'Content-Type':'application/octet-stream',
    'Content-Disposition':`attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    'Cache-Control':'no-store, no-cache, must-revalidate',
    'Pragma':'no-cache',
    'X-Content-Type-Options':'nosniff'
  });

  return new Response(stream,{status:200,headers});
}

self.addEventListener('message',(event)=>{
  if(event.data?.type==='ISOLDE_ZIP_PING'){
    event.ports?.[0]?.postMessage({ok:true,feature:'isolde-zip-stream-v2'});
  }
});

self.addEventListener('install',(event)=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate',(event)=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch',(event)=>{
  const req=event.request;
  const url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin) return;

  if(url.pathname.includes('/__isolde_export__/')){
    event.respondWith(exportResponse(url));
    return;
  }

  event.respondWith(
    fetch(req,{cache:'no-store'})
      .then(resp=>{
        if(resp&&resp.ok){
          const copy=resp.clone();
          caches.open(CACHE).then(cache=>cache.put(req,copy)).catch(()=>{});
        }
        return resp;
      })
      .catch(()=>caches.match(req).then(cached=>cached||caches.match('./index.html')))
  );
});