// invite.studio — Live iframe preview for customize pages
// =========================================================
(function () {
  'use strict';

  function formatDate(val) {
    if (!val) return '';
    const d = new Date(val + 'T12:00:00');
    if (isNaN(d)) return val;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function formatTime(val) {
    if (!val) return '';
    const [h, m] = val.split(':').map(Number);
    if (isNaN(h)) return val;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 || 12;
    return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  function collectData() {
    const data = {};
    // Collect by [data-preview] attribute
    document.querySelectorAll('[data-preview]').forEach(function (el) {
      const key = el.dataset.preview;
      if (!key) return;
      let val = el.value || '';
      if (el.type === 'date') val = formatDate(val);
      else if (el.type === 'time') val = formatTime(val);
      if (val) data[key] = val;
    });
    // Collect by [name] attribute (for form-based customize pages)
    document.querySelectorAll('form [name]').forEach(function (el) {
      const key = el.name;
      if (!key || data[key] !== undefined) return;
      let val = el.value || '';
      if (el.type === 'date') val = formatDate(val);
      else if (el.type === 'time') val = formatTime(val);
      if (val) data[key] = val;
    });
    return data;
  }

  function encodeData(data) {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(data)))); }
    catch (e) { return ''; }
  }

  // ── Init ──────────────────────────────────────────────────
  const templateFile = document.body.dataset.previewTemplate;
  if (!templateFile) return;

  const previewPanel = document.querySelector('.preview-panel, .customize-preview-panel');
  if (!previewPanel) return;

  // Adjust grid layout: 40% form / 60% iframe
  const layout = document.querySelector('.customize-layout');
  if (layout) layout.style.gridTemplateColumns = '40% 60%';

  // Replace preview panel contents with iframe UI
  previewPanel.style.padding = '0';
  previewPanel.style.overflow = 'hidden';

  previewPanel.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;' +
    'padding:8px 14px;background:rgba(0,0,0,0.35);border-bottom:1px solid rgba(201,148,42,0.2);flex-shrink:0;">' +
    '<span style="font-size:0.65rem;letter-spacing:0.25em;color:#c9942a;text-transform:uppercase;font-family:sans-serif;">Live Preview</span>' +
    '<button id="lp-fullscreen-btn" style="background:transparent;border:1px solid rgba(201,148,42,0.55);' +
    'color:#c9942a;padding:4px 12px;font-size:0.7rem;cursor:pointer;border-radius:3px;' +
    'letter-spacing:0.08em;font-family:sans-serif;transition:background 0.2s,color 0.2s;">' +
    'View Full Screen ↗</button>' +
    '</div>' +
    '<iframe id="lp-iframe" src="' + templateFile + '?preview=true" ' +
    'style="flex:1;border:none;width:100%;height:calc(100% - 37px);display:block;" ' +
    'sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>';

  // Make the panel fill the height
  previewPanel.style.display = 'flex';
  previewPanel.style.flexDirection = 'column';
  previewPanel.style.height = '100vh';
  previewPanel.style.position = 'sticky';
  previewPanel.style.top = '0';

  const iframe = document.getElementById('lp-iframe');

  function sendData() {
    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'preview-update', data: collectData() }, '*');
      }
    } catch (e) { /* cross-origin guard */ }
  }

  iframe.addEventListener('load', sendData);
  document.addEventListener('input', sendData);
  document.addEventListener('change', sendData);

  // Hover effect for fullscreen button
  const fsBtn = document.getElementById('lp-fullscreen-btn');
  fsBtn.addEventListener('mouseenter', function () {
    this.style.background = 'rgba(201,148,42,0.15)';
  });
  fsBtn.addEventListener('mouseleave', function () {
    this.style.background = 'transparent';
  });

  fsBtn.addEventListener('click', function () {
    const encoded = encodeData(collectData());
    window.open(templateFile + '?d=' + encoded, '_blank');
  });
})();
