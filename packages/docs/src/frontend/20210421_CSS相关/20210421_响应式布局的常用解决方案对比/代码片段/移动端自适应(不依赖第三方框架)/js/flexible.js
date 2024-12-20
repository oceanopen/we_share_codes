;(function (win) {
  const doc = win.document;
  const docEl = doc.documentElement;
  const metaEl = doc.querySelector('meta[name="viewport"]');
  let dpr = 0;
  let scale = 0;
  let resizeTimer = null;

  if (metaEl) {
    const match = metaEl.getAttribute('content').match(/initial-scale=([\d.]+)/);
    if (match) {
      scale = Number.parseFloat(match[1]);
      dpr = Number.parseInt(1 / scale);
    }
  }
  else {
    console.warn('仅支持根据已有的meta标签来设置缩放比例，完整实现请参考 https://www.npmjs.com/package/lib-flexible ');
  }

  function refreshRem() {
    let width = docEl.getBoundingClientRect().width;
    if (width / dpr > 750) {
      width = 750 * dpr;
    }
    const rem = width / 10;
    docEl.style.fontSize = `${rem}px`;
    win.rem = rem;
  }

  win.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshRem, 300);
    },
    false,
  );

  refreshRem();
})(window);
