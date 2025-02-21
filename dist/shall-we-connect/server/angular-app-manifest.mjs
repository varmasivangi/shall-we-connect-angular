
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/video-call"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 498, hash: '129452de7a6f7bc62627586dd887206531fcc83f4ae4f83d4b6ed7028fec9789', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1011, hash: 'f8da1b18fd5ad4dd6aae5fb3b23b35d7cb492fdd529d4b7d9c513f6d3cfa0cdc', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 1620, hash: '411383053eadab0d7ecaba91769194438535c8460e8580c115ae91df3c10beab', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'video-call/index.html': {size: 1641, hash: 'c9d98ca34037882ab2f726edddb855289b707d57f69ca16abd35a2876e744cd5', text: () => import('./assets-chunks/video-call_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
