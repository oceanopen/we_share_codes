document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('signature-pad');
  const ctx = canvas.getContext('2d');
  let drawing = false;
  let strokeStyle = 'pen';
  let signatureData = null;

  function setStrokeStyle() {
    if (strokeStyle === 'pen') {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
    }
    else if (strokeStyle === 'brush') {
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
    }
  }

  function resizeCanvas() {
    if (signatureData) {
      const img = new Image();
      img.src = signatureData;
      img.onload = function () {
        // 因为设置尺寸会清除画布内容，所以以下代码可不必要
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // 缓存绘制内容
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        setStrokeStyle();
      };
    }
    else {
      // 默认会自动清除绘制内容
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      setStrokeStyle();
    }
  }

  function startDrawing(e) {
    e.preventDefault();
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(
      e.offsetX || e.touches[0].clientX - canvas.offsetLeft,
      e.offsetY || e.touches[0].clientY - canvas.offsetTop,
    );
  }

  function draw(e) {
    e.preventDefault();
    if (drawing) {
      ctx.lineTo(
        e.offsetX || e.touches[0].clientX - canvas.offsetLeft,
        e.offsetY || e.touches[0].clientY - canvas.offsetTop,
      );
      ctx.stroke();
    }
  }

  function stopDrawing() {
    drawing = false;
    signatureData = canvas.toDataURL();
  }

  function exportCanvas(format) {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d');

    // 用白色填充背景
    exportCtx.fillStyle = '#fff';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // 绘制签名
    exportCtx.drawImage(canvas, 0, 0);

    // 导出画布
    const dataURL = exportCanvas.toDataURL(`image/${format}`);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `signature.${format}`;
    link.click();
  }

  // 鼠标事件
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  // 触摸事件
  canvas.addEventListener('touchstart', startDrawing, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', stopDrawing);
  canvas.addEventListener('touchcancel', stopDrawing);

  document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    signatureData = null;
  });

  document.getElementById('stroke-style').addEventListener('change', (e) => {
    strokeStyle = e.target.value;
    setStrokeStyle();
  });

  // 初始画布设置
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.getElementById('export-png').addEventListener('click', () => {
    exportCanvas('png');
  });

  document.getElementById('export-jpeg').addEventListener('click', () => {
    exportCanvas('jpeg');
  });
});
