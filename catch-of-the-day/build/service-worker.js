'use strict';
var precacheConfig = [
    ['/index.html', 'deaf2736f5b7dcd457fe36e8088e488b'],
    ['/static/css/main.e9fe9013.css', '0ffce6f8bc169c764153e05686dd79da'],
    ['/static/js/main.f8fc38fa.js', 'e87ea8febd8fe91f6e239cd08fcaa3fa'],
    ['/static/media/anchor.d2f8799a.svg', 'd2f8799a13e6db2022d9a7de22776705'],
    [
      '/static/media/blanch_caps_inline-webfont.1461f8e9.woff',
      '1461f8e9d2084c70c00830348efe1766',
    ],
    [
      '/static/media/blanch_caps_inline-webfont.73a576a8.eot',
      '73a576a8254aeafebcdc66fe9fd41ac8',
    ],
    [
      '/static/media/blanch_caps_inline-webfont.7bbffda6.svg',
      '7bbffda6bcacac8360f0ee00bb03dc04',
    ],
    [
      '/static/media/blanch_caps_inline-webfont.8345e1b3.ttf',
      '8345e1b3362c1d640f0f11b5aae1d5bc',
    ],
    [
      '/static/media/haymaker-webfont.4c3fb584.eot',
      '4c3fb584d3f63821357c8a9cff97f360',
    ],
    [
      '/static/media/haymaker-webfont.751e5627.woff',
      '751e56274d3ea1c651ea824f902bb987',
    ],
    [
      '/static/media/haymaker-webfont.cf798e30.svg',
      'cf798e30eda73d84b25c4ae233fe5e21',
    ],
    [
      '/static/media/haymaker-webfont.e9535f20.ttf',
      'e9535f20ca175cc3fdfe2816f7c47168',
    ],
  ],
  cacheName =
    'sw-precache-v3-sw-precache-webpack-plugin-' +
    (self.registration ? self.registration.scope : ''),
  ignoreUrlParametersMatching = [/^utm_/],
  addDirectoryIndex = function(e, t) {
    var n = new URL(e);
    return '/' === n.pathname.slice(-1) && (n.pathname += t), n.toString();
  },
  cleanResponse = function(t) {
    return t.redirected
      ? ('body' in t ? Promise.resolve(t.body) : t.blob()).then(function(e) {
          return new Response(e, {
            headers: t.headers,
            status: t.status,
            statusText: t.statusText,
          });
        })
      : Promise.resolve(t);
  },
  createCacheKey = function(e, t, n, a) {
    var r = new URL(e);
    return (
      (a && r.pathname.match(a)) ||
        (r.search +=
          (r.search ? '&' : '') +
          encodeURIComponent(t) +
          '=' +
          encodeURIComponent(n)),
      r.toString()
    );
  },
  isPathWhitelisted = function(e, t) {
    if (0 === e.length) return !0;
    var n = new URL(t).pathname;
    return e.some(function(e) {
      return n.match(e);
    });
  },
  stripIgnoredUrlParameters = function(e, n) {
    var t = new URL(e);
    return (
      (t.hash = ''),
      (t.search = t.search
        .slice(1)
        .split('&')
        .map(function(e) {
          return e.split('=');
        })
        .filter(function(t) {
          return n.every(function(e) {
            return !e.test(t[0]);
          });
        })
        .map(function(e) {
          return e.join('=');
        })
        .join('&')),
      t.toString()
    );
  },
  hashParamName = '_sw-precache',
  urlsToCacheKeys = new Map(
    precacheConfig.map(function(e) {
      var t = e[0],
        n = e[1],
        a = new URL(t, self.location),
        r = createCacheKey(a, hashParamName, n, /\.\w{8}\./);
      return [a.toString(), r];
    }),
  );
function setOfCachedUrls(e) {
  return e
    .keys()
    .then(function(e) {
      return e.map(function(e) {
        return e.url;
      });
    })
    .then(function(e) {
      return new Set(e);
    });
}
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(function(a) {
        return setOfCachedUrls(a).then(function(n) {
          return Promise.all(
            Array.from(urlsToCacheKeys.values()).map(function(t) {
              if (!n.has(t)) {
                var e = new Request(t, { credentials: 'same-origin' });
                return fetch(e).then(function(e) {
                  if (!e.ok)
                    throw new Error(
                      'Request for ' +
                        t +
                        ' returned a response with status ' +
                        e.status,
                    );
                  return cleanResponse(e).then(function(e) {
                    return a.put(t, e);
                  });
                });
              }
            }),
          );
        });
      })
      .then(function() {
        return self.skipWaiting();
      }),
  );
}),
  self.addEventListener('activate', function(e) {
    var n = new Set(urlsToCacheKeys.values());
    e.waitUntil(
      caches
        .open(cacheName)
        .then(function(t) {
          return t.keys().then(function(e) {
            return Promise.all(
              e.map(function(e) {
                if (!n.has(e.url)) return t.delete(e);
              }),
            );
          });
        })
        .then(function() {
          return self.clients.claim();
        }),
    );
  }),
  self.addEventListener('fetch', function(t) {
    if ('GET' === t.request.method) {
      var e,
        n = stripIgnoredUrlParameters(
          t.request.url,
          ignoreUrlParametersMatching,
        ),
        a = 'index.html';
      (e = urlsToCacheKeys.has(n)) ||
        ((n = addDirectoryIndex(n, a)), (e = urlsToCacheKeys.has(n)));
      var r = '/index.html';
      !e &&
        'navigate' === t.request.mode &&
        isPathWhitelisted(['^(?!\\/__).*'], t.request.url) &&
        ((n = new URL(r, self.location).toString()),
        (e = urlsToCacheKeys.has(n))),
        e &&
          t.respondWith(
            caches
              .open(cacheName)
              .then(function(e) {
                return e.match(urlsToCacheKeys.get(n)).then(function(e) {
                  if (e) return e;
                  throw Error(
                    'The cached response that was expected is missing.',
                  );
                });
              })
              .catch(function(e) {
                return (
                  console.warn(
                    'Couldn\'t serve response for "%s" from cache: %O',
                    t.request.url,
                    e,
                  ),
                  fetch(t.request)
                );
              }),
          );
    }
  });
