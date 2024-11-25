<template>
    <div class="wrapper">
        <img src="/demo.jpg">
        <div>
            <ElButton @click="addCanvas()">
                生成Canvas
            </ElButton>
            <ElButton @click="generateImg()">
                生成图片
            </ElButton>
        </div>
    </div>
</template>

<script lang="ts">
import { ElButton } from 'element-plus';
import { defineComponent } from 'vue';

export default defineComponent({
    components: {
        ElButton,
    },
    setup() {
        let img: HTMLImageElement;
        let canvas: HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D;
        let imgData: ImageData;

        // pc，移动事件兼容写法
        const hastouch = 'ontouchstart' in window;
        const tapstart = hastouch ? 'touchstart' : 'mousedown';
        const tapmove = hastouch ? 'touchmove' : 'mousemove';
        const tapend = hastouch ? 'touchend' : 'mouseup';

        function addCanvas() {
            if (document.querySelector('canvas')) {
                console.warn('已有canvas元素，不支持重复添加');
                return;
            }

            img = document.querySelector('img') as HTMLImageElement;

            const newImg = new Image();
            newImg.src = '/demo.jpg'; // 这里放自己的图片
            newImg.onload = function () {
                const width = newImg.width;
                const height = newImg.height;

                const { canvas: newCanvas, ctx: newCtx } = createCanvasAndCtx(width, height);

                newCtx.drawImage(newImg, 0, 0, width, height);

                img?.parentNode?.insertBefore(newCanvas, img.nextSibling);
                canvas = newCanvas;
                ctx = newCtx;
                imgData = ctx.getImageData(0, 0, img.clientWidth, img.clientHeight);
            };
        }

        function createCanvasAndCtx(
            width: number,
            height: number,
        ): {
                canvas: HTMLCanvasElement;
                ctx: CanvasRenderingContext2D;
            } {
            const canvas = document.createElement('canvas');

            canvas.setAttribute('width', `${width}px`);
            canvas.setAttribute('height', `${height}px`);

            // 鼠标按下
            canvas.addEventListener(tapstart, start);
            // 鼠标抬起
            canvas.addEventListener(tapend, end);
            // PC 鼠标移出
            canvas.addEventListener('mouseout', end);

            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

            return {
                canvas,
                ctx,
            };
        }

        function start() {
            // 鼠标移动
            canvas.addEventListener(tapmove, move);
        }
        function end() {
            canvas.removeEventListener(tapmove, move);
        }
        function move(e: TouchEvent | MouseEvent) {
            // 马赛克的程度，数字越大越模糊
            const num = 10;

            let xPointer = hastouch
                ? (e as TouchEvent).targetTouches[0].clientX - canvas.offsetLeft
                : (e as MouseEvent).clientX - canvas.offsetLeft;
            let yPointer = hastouch
                ? (e as TouchEvent).targetTouches[0].clientY - canvas.offsetTop
                : (e as MouseEvent).clientY - canvas.offsetTop;

            xPointer = Math.floor(xPointer);
            yPointer = Math.floor(yPointer);

            // 兼容移动端
            if (xPointer > canvas.width || yPointer > canvas.height) {
                return;
            }

            // 获取鼠标当前所在的像素 RGBA
            const color = getXY(imgData, xPointer, yPointer);

            for (let k = 0; k < num; k++) {
                for (let l = 0; l < num; l++) {
                    // 设置 imgData 上坐标为 (e.offsetX + l, e.offsetY + k) 的的颜色
                    setXY(imgData, xPointer + l, yPointer + k, color);
                }
            }

            // 更新 canvas 数据
            ctx.putImageData(imgData, 0, 0);
        }

        function generateImg() {
            if (!canvas) {
                console.warn('请先生成canvas');
                return;
            }
            const newImg = new Image();
            newImg.src = canvas.toDataURL('image/png');
            newImg.className = 'img-prevew';
            img?.parentNode?.appendChild(newImg);
        }

        function setXY(obj: ImageData, x: number, y: number, color: Array<number>) {
            const w = obj.width;

            obj.data[4 * (y * w + x)] = color[0];
            obj.data[4 * (y * w + x) + 1] = color[1];
            obj.data[4 * (y * w + x) + 2] = color[2];
            obj.data[4 * (y * w + x) + 3] = color[3];
        }

        function getXY(obj: ImageData, x: number, y: number): Array<number> {
            const w = obj.width;
            const color = [];

            color[0] = obj.data[4 * (y * w + x)];
            color[1] = obj.data[4 * (y * w + x) + 1];
            color[2] = obj.data[4 * (y * w + x) + 2];
            color[3] = obj.data[4 * (y * w + x) + 3];

            return color;
        }

        return {
            addCanvas,
            generateImg,
        };
    },
});
</script>

<style scoped lang="scss">
.wrapper {
  padding: 30px;
  max-width: 100%;

  :deep canvas {
    border: 1px solid #eee;
  }

  :deep .img-prevew {
    margin-top: 30px;
  }
}
</style>
