/* GWN Aura root-scoped Web Push service worker. */
'use strict';
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try { data = event.data.json(); }
    catch (_) { data = { body: event.data.text() }; }
  }
  const title = String(data.title || data.notification?.title || 'GWN Aura');
  const body = String(data.body || data.message || data.notification?.body || 'You have a new update.');
  const rawUrl = data.url || data.data?.url || '/';
  let url = '/';
  try { const parsed = new URL(rawUrl, self.location.origin); if (parsed.origin === self.location.origin) url = parsed.href; } catch (_) {}
  const options = {
    body,
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/badge-72.png',
    tag: data.tag || 'gwn-aura-broadcast',
    renotify: Boolean(data.renotify),
    data: { url },
    timestamp: Date.now()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  let target = '/';
  try {
    const parsed = new URL(event.notification.data?.url || '/', self.location.origin);
    if (parsed.origin === self.location.origin) target = parsed.href;
  } catch (_) {}
  event.waitUntil((async function() {
    const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clientsList) {
      if (new URL(client.url).origin === self.location.origin) {
        if ('navigate' in client) await client.navigate(target);
        if ('focus' in client) return client.focus();
      }
    }
    if (self.clients.openWindow) return self.clients.openWindow(target);
  })());
});
self.addEventListener('notificationclose', function() {});
