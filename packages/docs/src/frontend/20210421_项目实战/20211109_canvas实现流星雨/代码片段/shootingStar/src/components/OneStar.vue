<template>
  <div class="wrapper">
    <canvas id="myCanvas" ref="canvasRef" width="1000" height="600" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

// 坐标
class Crood {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  setCrood(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Crood(this.x, this.y);
  }
}

// 流星
class ShootingStar {
  public init: Crood;
  public final: Crood;
  public size: number;
  public speed: number; // 速度：像素/s
  public dur: number; // 飞行总时间，单位 ms
  public pass: number; // 已过去的时间
  public prev: Crood;
  public now: Crood;
  public onDistory: (() => void) | null;

  constructor(init = new Crood(), final = new Crood(), size = 3, speed = 200, onDistory: (() => void) | null = null) {
    this.init = init; // 初始位置
    this.final = final; // 最终位置
    this.size = size; // 大小
    this.speed = speed; // 速度：像素/s

    // 飞行总时间
    this.dur
      = (Math.sqrt((this.final.x - this.init.x) ** 2 + (this.final.y - this.init.y) ** 2) * 1000) / this.speed;

    this.pass = 0; // 已过去的时间
    this.prev = this.init.copy(); // 上一帧位置
    this.now = this.init.copy(); // 当前位置
    this.onDistory = onDistory;
  }

  draw(ctx: CanvasRenderingContext2D, delta: number) {
    this.pass += delta;
    this.pass = Math.min(this.pass, this.dur);

    const percent = this.pass / this.dur;

    this.now.setCrood(
      this.init.x + (this.final.x - this.init.x) * percent,
      this.init.y + (this.final.y - this.init.y) * percent,
    );

    ctx.strokeStyle = '#fff';
    ctx.lineCap = 'round';
    ctx.lineWidth = this.size;

    ctx.beginPath();
    ctx.moveTo(this.now.x, this.now.y);
    ctx.lineTo(this.prev.x, this.prev.y);
    ctx.stroke();
    ctx.closePath();

    this.prev.setCrood(this.now.x, this.now.y);
    if (this.pass === this.dur) {
      this.distory();
    }
  }

  distory() {
    this.onDistory && this.onDistory();
  }
}

export default defineComponent({
  setup() {
    const canvasRef = ref<null | HTMLCanvasElement>(null);

    onMounted(() => {
      const cvs = canvasRef.value as HTMLCanvasElement;
      const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;

      let T: number;
      const shootingStar = new ShootingStar(new Crood(100, 100), new Crood(400, 400), 3, 200, () => {
        cancelAnimationFrame(T);
      });

      const tick = (function () {
        const now = new Date().getTime();
        let last = now;
        let delta: number;

        return function () {
          delta = now - last;
          delta = delta > 500 ? 30 : delta < 16 ? 16 : delta;
          last = now;

          T = requestAnimationFrame(tick);

          // 实现关键点
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // 每一帧用 “半透明” 的背景色覆盖画布，使得之前画的内容隐藏一部分
          ctx.fillRect(0, 0, cvs.width, cvs.height);
          ctx.restore();

          shootingStar.draw(ctx, delta);
        };
      })();

      tick();
    });

    return {
      canvasRef,
    };
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  margin: 60px auto 0;
  text-align: center;

  #myCanvas {
    border: 1px solid gray;
  }
}
</style>
