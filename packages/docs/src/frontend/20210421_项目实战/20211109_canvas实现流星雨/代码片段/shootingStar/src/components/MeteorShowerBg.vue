<template>
    <div class="wrapper">
        <div class="btn-wrapper">
            <button v-if="stoped" class="btn" @click="handleStart">
                开始
            </button>
            <button v-else class="btn" @click="handlePause">
                暂停
            </button>
        </div>
        <canvas id="myCanvas" ref="canvasRef" width="2000" height="1200" />
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

        // 飞行总时间，单位 ms
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

// 流星雨
class MeteorShower {
    public cvs: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public stars: ShootingStar[];
    public T: number;
    public stoped: boolean;
    public playing: boolean;

    constructor(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.cvs = cvs;
        this.ctx = ctx;
        this.stars = [];
        this.T = 0;
        this.stoped = false;
        this.playing = false;
    }

    // 生成随机位置的流星
    createStar() {
        const angle = Math.PI / 3;
        // Math.random() 为 (0, 1) 之间的随机值，所以 distance 区间为 (0, 400)
        const distance = Math.random() * 400; // 移动的距离
        const init = new Crood((Math.random() * this.cvs.width) | 0, (Math.random() * 100) | 0);
        const final = new Crood(init.x + distance * Math.cos(angle), init.y + distance * Math.sin(angle));

        const size = Math.random() * 2;
        const speed = Math.random() * 400 + 100; // 速度： 像素/s

        const star = new ShootingStar(init, final, size, speed, () => {
            this.remove(star);
        });
        return star;
    }

    remove(star: ShootingStar) {
        this.stars = this.stars.filter((s) => {
            return s !== star;
        });
    }

    update(delta: number) {
        if (!this.stoped && this.stars.length < 20) {
            this.stars.push(this.createStar());
        }
        this.stars.forEach((star) => {
            star.draw(this.ctx, delta);
        });
    }

    tick() {
        if (this.playing) {
            return;
        }
        this.playing = true;

        const now = new Date().getTime();
        let last = now;
        let delta;

        const _tick = () => {
            if (this.stoped && this.stars.length === 0) {
                cancelAnimationFrame(this.T);
                this.playing = false;
                return;
            }

            delta = now - last;
            delta = delta > 500 ? 30 : delta < 16 ? 16 : delta;
            last = now;

            this.T = requestAnimationFrame(_tick);

            // 关键点
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'destination-in';
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // 每一帧用 “半透明” 的背景色清除画布
            this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
            this.ctx.restore();
            this.update(delta);
        };

        _tick();
    }

    // 开始
    start() {
        this.stoped = false;
        this.tick();
    }

    // 暂停
    pause() {
        this.stoped = true;
    }
}

export default defineComponent({
    setup() {
        const canvasRef = ref<null | HTMLCanvasElement>(null);
        const stoped = ref(false);
        // meteorShower 不能为 ref 类型，否则 会影响到 stars 的处理
        let meteorShower: null | MeteorShower = null;

        const handleStart = () => {
            stoped.value = false;
            meteorShower?.start();
        };
        const handlePause = () => {
            stoped.value = true;
            meteorShower?.pause();
        };

        onMounted(() => {
            const cvs = canvasRef.value as HTMLCanvasElement;
            const ctx = cvs.getContext('2d') as CanvasRenderingContext2D;

            meteorShower = new MeteorShower(cvs, ctx);
            handleStart();
        });

        return {
            canvasRef,
            stoped,
            handleStart,
            handlePause,
        };
    },
});
</script>

<style scoped lang="scss">
.wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url(./bg.jpg) no-repeat center;
  background-size: cover;
  width: 100%;
  max-width: 1000px;

  .btn-wrapper {
    position: absolute;
    top: -50px;

    .btn {
      padding: 8px 16px;
    }
  }

  #myCanvas {
    position: relative;
    width: 100%;
    border: 1px solid gray;
    box-sizing: border-box;
  }
}
</style>
