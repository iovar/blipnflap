const cacheName = 'blockyflap-cache-v1';

const cachedFiles = [
    '/',
    'audio/sounds.mp3',
    'css/main.css',
    'js/app.js',
    'js/audio.js',
    'js/config.js',
    'js/game.js',
    'js/screen.js',
    'icon.png',
    'index.html',
    'sw.js',
    'manifest.json',
];

self.addEventListener('install', event => {
	self.skipWaiting();

	event.waitUntil(
		caches.open(cacheName).then((cache) => {
            console.log('ADD' ,cachedFiles);
			return cache.addAll();
		})
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => (
            Promise.all(
                keys.map((key) => ![cacheName].includes(key) && caches.delete(key))
            )
        ))
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.open(cacheName).then((cache) => {
			return cache.match(event.request).then((response) => {
				return response || fetch(event.request).then((networkResponse) => {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
				});
			})
		})
	);
});
