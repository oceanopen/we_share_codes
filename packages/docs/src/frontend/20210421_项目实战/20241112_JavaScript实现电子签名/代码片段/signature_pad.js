document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('signature-pad');
  // eslint-disable-next-line no-undef
  const signaturePad = new SignaturePad(canvas);
  let undoStack = [];
  let redoStack = [];

  function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
  }

  function saveState() {
    console.log('endStroke || signaturePad.toData:', signaturePad.toData());
    undoStack.push(deepCopy(signaturePad.toData()));
    redoStack = [];
  }
  // 撤销
  function undo() {
    if (undoStack.length > 0) {
      // 撤销后，支持重做操作恢复当前状态
      redoStack.push(deepCopy(signaturePad.toData()));

      // 因为停止绘制后，会自动保存当前状态，所以需要把当前状态给忽略
      undoStack.pop();

      // 重置为上一个状态
      signaturePad.clear();
      if (undoStack.length) {
        const lastStroke = undoStack[undoStack.length - 1];
        signaturePad.fromData(lastStroke, {
          clear: false,
        });
      }
    }
  }
  // 重做
  function redo() {
    if (redoStack.length > 0) {
      // 重做后，支持撤销操作恢复当前状态
      undoStack.push(deepCopy(signaturePad.toData()));

      const nextState = redoStack.pop();
      signaturePad.clear();
      signaturePad.fromData(nextState);
    }
  }

  document.getElementById('undo').addEventListener('click', undo);
  document.getElementById('redo').addEventListener('click', redo);
  document.getElementById('clear').addEventListener('click', () => {
    signaturePad.clear();
    undoStack = [];
    redoStack = [];
  });

  document.getElementById('save-png').addEventListener('click', () => {
    if (!signaturePad.isEmpty()) {
      const dataURL = signaturePad.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'signature.png';
      link.click();
    }
  });

  document.getElementById('save-jpeg').addEventListener('click', () => {
    if (!signaturePad.isEmpty()) {
      const dataURL = signaturePad.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'signature.jpeg';
      link.click();
    }
  });

  // 绘图结束时保存状态
  signaturePad.addEventListener('endStroke', () => {
    saveState();
  });

  // 初始画布设置
  function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);

    signaturePad.clear(); // 否则 isEmpty() 可能会返回错误值

    if (undoStack.length > 0) {
      signaturePad.fromData(undoStack[undoStack.length - 1]);
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
});
