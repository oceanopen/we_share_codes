const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

setInterval(() => {
  ctx.save();
  ctx.clearRect(0, 0, 350, 350);
  // 设置中心点，此时 [175，175] 变成了坐标的 [0, 0]
  ctx.translate(175, 175);
  ctx.save();

  /**
   * 画大圆
   */
  ctx.beginPath();
  // 画圆线使用 arc(中心点X,中心点Y,半径,起始角度,结束角度)
  ctx.arc(0, 0, 100, 0, 2 * Math.PI);
  // 执行画线段的操作 stroke
  ctx.stroke();
  ctx.closePath();

  /**
   * 画小圆
   */
  ctx.beginPath();
  // 画圆线使用 arc(中心点X,中心点Y,半径,起始角度,结束角度)
  ctx.arc(0, 0, 5, 0, 2 * Math.PI);
  // 执行画线段的操作 stroke
  ctx.stroke();
  ctx.closePath();

  /**
   * 获取当前 时，分，秒
   */
  const time = new Date();
  const hour = time.getHours() % 12;
  const min = time.getMinutes();
  const sec = time.getSeconds();

  /**
   * 画时针
   */
  // 计算角度从 12 点位置开始计算，但坐标位置从 x 轴方向开始偏移，所以需要减去 90°
  ctx.rotate(((2 * Math.PI) / 12) * hour + ((2 * Math.PI) / 12) * (min / 60) - Math.PI / 2);
  ctx.beginPath();
  // moveTo 设置画线起点
  ctx.moveTo(-10, 0);
  // lineTo 设置画线经过点
  ctx.lineTo(40, 0);
  // 设置线宽
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  ctx.closePath();
  // 恢复成上一次save的状态
  ctx.restore();
  // 恢复完再保存一次
  ctx.save();

  // 分针
  ctx.rotate(((2 * Math.PI) / 60) * min + ((2 * Math.PI) / 60) * (sec / 60) - Math.PI / 2);
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(60, 0);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'blue';
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
  ctx.save();

  // 秒针
  ctx.rotate(((2 * Math.PI) / 60) * sec - Math.PI / 2);
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(80, 0);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'red';
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
  ctx.save();

  // 绘制非整点刻度，也是跟绘制时分秒针一样，只不过刻度是死的
  ctx.lineWidth = 1;
  for (let i = 0; i < 60; i++) {
    ctx.rotate((2 * Math.PI) / 60);
    ctx.beginPath();
    ctx.moveTo(90, 0);
    ctx.lineTo(100, 0);
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
  }
  ctx.restore();
  ctx.save();

  // 绘制整点刻度
  ctx.lineWidth = 5;
  for (let i = 0; i < 12; i++) {
    ctx.rotate((2 * Math.PI) / 12);
    ctx.beginPath();
    ctx.moveTo(85, 0);
    ctx.lineTo(100, 0);
    ctx.stroke();
    ctx.closePath();
  }

  // 恢复成最初 save 的状态
  ctx.restore();
  ctx.restore();
}, 1000);
