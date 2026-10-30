/* Prop Hunt demo service worker: cache-first for the demo page + photo/sound pack.
   The 7.5MB source EXR (assets/sky_2k.exr) is intentionally NOT cached: it is the
   source asset only and is never loaded at runtime (the tonemapped JPG is). */
var CACHE = "prophunt-demo-v1";
var URLS = [
  "./",
  "index.html",
  "assets/grass_color.jpg",
  "assets/asphalt_color.jpg",
  "assets/siding_color.jpg",
  "assets/roof_color.jpg",
  "assets/plaster_color.jpg",
  "assets/sky_tonemapped.jpg",
  "assets/gunshot.ogg",
  "assets/rain.ogg",
  "assets/thunder.ogg",
  "assets/footstep.mp3"
];
self.addEventListener("install", function(ev){
  ev.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(URLS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(ev){
  ev.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener("fetch", function(ev){
  if(ev.request.method !== "GET") return;
  ev.respondWith(caches.match(ev.request, { ignoreSearch:true }).then(function(hit){
    if(hit) return hit;
    return fetch(ev.request).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(ev.request, copy); });
      return res;
    }).catch(function(){ return hit; });
  }));
});
