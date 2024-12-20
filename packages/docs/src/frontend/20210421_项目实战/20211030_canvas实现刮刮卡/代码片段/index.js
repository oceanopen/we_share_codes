function init() {
  const width = document.getElementById('div').offsetWidth;
  const height = document.getElementById('div').offsetHeight;

  if (!document.getElementById('myCanvas')) {
    const canvas = document.createElement('canvas');

    canvas.setAttribute('width', `${width}px`);
    canvas.setAttribute('height', `${height}px`);
    canvas.id = 'myCanvas';
    document.getElementById('div').appendChild(canvas);
  }

  const myCanvasObject = document.getElementById('myCanvas');
  const ctx = myCanvasObject.getContext('2d');

  // 绘制黑色矩形
  ctx.beginPath();
  ctx.fillStyle = 'gray';
  ctx.rect(0, 0, width, height);
  ctx.closePath();
  ctx.fill();

  // 绘制填充文字
  ctx.beginPath();
  ctx.fillStyle = '#fff';
  ctx.fillText('刮刮卡', 160, 100);
  ctx.closePath();

  let isDown = false; // 鼠标是否按下标志
  let pointerArr = []; // 鼠标移动坐标数组
  let xPointer = 0; // 鼠标当前x坐标
  let yPointer = 0; // 鼠标当前y坐标

  // pc，移动事件兼容写法
  const hastouch = 'ontouchstart' in window;
  const tapstart = hastouch ? 'touchstart' : 'mousedown';
  const tapmove = hastouch ? 'touchmove' : 'mousemove';
  const tapend = hastouch ? 'touchend' : 'mouseup';

  // 鼠标按下
  myCanvasObject.addEventListener(tapstart, function (event) {
    const e = event;

    this.style.cursor = 'move';

    isDown = true;

    xPointer = hastouch ? e.targetTouches[0].clientX - this.offsetLeft : e.clientX - this.offsetLeft;
    yPointer = hastouch ? e.targetTouches[0].clientY - this.offsetTop : e.clientY - this.offsetTop;
    pointerArr.push([xPointer, yPointer]);

    circleReset(ctx);
  });

  // 鼠标按下后拖动
  myCanvasObject.addEventListener(tapmove, function (event) {
    const e = event;

    if (isDown) {
      xPointer = hastouch ? e.targetTouches[0].clientX - this.offsetLeft : e.clientX - this.offsetLeft;
      yPointer = hastouch ? e.targetTouches[0].clientY - this.offsetTop : e.clientY - this.offsetTop;

      // 兼容移动端
      if (xPointer > this.width || yPointer > this.height) {
        return;
      }

      pointerArr.push([xPointer, yPointer]);

      circleReset(ctx);
    }
  });

  // 鼠标抬起取消事件
  myCanvasObject.addEventListener(tapend, () => {
    isDown = false;
    pointerArr = [];
  });

  // 圆形橡皮檫
  function circleReset(ctx) {
    ctx.save();
    ctx.beginPath();

    ctx.moveTo(pointerArr[0][0], pointerArr[0][1]);

    ctx.lineCap = 'round'; // 设置线条两端为圆弧
    ctx.lineJoin = 'round'; // 设置线条转折为圆弧
    ctx.lineWidth = 60;

    ctx.globalCompositeOperation = 'destination-out';

    if (pointerArr.length === 1) {
      ctx.lineTo(pointerArr[0][0] + 1, pointerArr[0][1] + 1);
    }
    else {
      for (let i = 1; i < pointerArr.length; i++) {
        ctx.lineTo(pointerArr[i][0], pointerArr[i][1]);
        ctx.moveTo(pointerArr[i][0], pointerArr[i][1]);
      }
    }

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

init();
