<template>
  <div class="wrapper">
    <div style="margin-bottom: 10px; display: flex; align-items: center">
      <ElButton type="primary" @click="changeType('huabi')">
        画笔
      </ElButton>
      <ElButton type="success" @click="changeType('rect')">
        正方形
      </ElButton>
      <ElButton type="warning" style="margin-right: 10px" @click="changeType('arc')">
        圆形
      </ElButton>
      <div>颜色：</div>
      <el-color-picker v-model="state.color" />
      <ElButton @click="clear">
        清空
      </ElButton>
      <ElButton @click="saveImg">
        保存
      </ElButton>
    </div>
    <canvas
      id="canvas"
      ref="canvasDom"
      width="800"
      height="400"
      @mousedown="canvasDown"
      @mousemove="canvasMove"
      @mouseout="canvasUp"
      @mouseup="canvasUp"
      @touchstart="canvasDown"
      @touchmove="canvasMove"
      @touchend="canvasUp"
    />
  </div>
</template>

<script lang="ts">
import { ElButton } from 'element-plus';
import { defineComponent, onMounted, reactive, ref } from 'vue';

export default defineComponent({
  components: {
    ElButton,
  },
  setup() {
    const state = reactive({
      type: 'huabi',
      isDraw: false,
      beginX: 0,
      beginY: 0,
      color: '#000',
      imageData: null as any,
    });
    const canvasDom = ref<null | HTMLCanvasElement>(null);
    const ctx = ref<null | undefined | CanvasRenderingContext2D>(null);

    onMounted(() => {
      ctx.value = canvasDom.value?.getContext('2d');
    });

    function changeType(type: string) {
      state.type = type;
    }

    function canvasDown(e: MouseEvent | TouchEvent) {
      state.isDraw = true;
      const canvas = canvasDom.value as HTMLCanvasElement;

      const event: MouseEvent | Touch = (e as TouchEvent).targetTouches
        ? (e as TouchEvent).targetTouches[0]
        : (e as MouseEvent);

      state.beginX = event.pageX - canvas.offsetLeft;
      state.beginY = event.pageY - canvas.offsetTop;
    }
    function canvasMove(e: MouseEvent | TouchEvent) {
      if (!state.isDraw) {
        return;
      }
      const canvas = canvasDom.value as HTMLCanvasElement;

      const event: MouseEvent | Touch = (e as TouchEvent).targetTouches
        ? (e as TouchEvent).targetTouches[0]
        : (e as MouseEvent);

      const x = event.pageX - canvas.offsetLeft;
      const y = event.pageY - canvas.offsetTop;

      // 兼容移动端
      if (x > canvas.width || y > canvas.height) {
        return;
      }

      switch (state.type) {
        case 'huabi':
          huabiFn(ctx.value as CanvasRenderingContext2D, x, y);
          break;
        case 'rect':
          rectFn(ctx.value as CanvasRenderingContext2D, x, y);
          break;
        case 'arc':
          arcFn(ctx.value as CanvasRenderingContext2D, x, y);
          break;
      }
    }
    function canvasUp() {
      state.imageData = (ctx.value as CanvasRenderingContext2D).getImageData(0, 0, 800, 400);
      state.isDraw = false;
    }

    function huabiFn(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = state.color;
      ctx.fill();
      ctx.closePath();
    }

    function rectFn(ctx: CanvasRenderingContext2D, x: number, y: number) {
      const beginX = state.beginX;
      const beginY = state.beginY;
      ctx.clearRect(0, 0, 800, 400);

      state.imageData && ctx.putImageData(state.imageData, 0, 0, 0, 0, 800, 400);

      ctx.beginPath();
      ctx.strokeStyle = state.color;
      ctx.rect(beginX, beginY, x - beginX, y - beginY);
      ctx.stroke();
      ctx.closePath();
    }

    function arcFn(ctx: CanvasRenderingContext2D, x: number, y: number) {
      const beginX = state.beginX;
      const beginY = state.beginY;
      state.isDraw && ctx.clearRect(0, 0, 800, 400);

      state.imageData && ctx.putImageData(state.imageData, 0, 0, 0, 0, 800, 400);

      ctx.beginPath();
      ctx.strokeStyle = state.color;
      ctx.arc(
        beginX,
        beginY,
        Math.round(Math.sqrt((x - beginX) * (x - beginX) + (y - beginY) * (y - beginY))),
        0,
        2 * Math.PI,
      );
      ctx.stroke();
      ctx.closePath();
    }
    function saveImg() {
      const url = (canvasDom.value as HTMLCanvasElement).toDataURL();
      const a = document.createElement('a');
      a.download = 'sunshine';
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    function clear() {
      state.imageData = null
      ;(ctx.value as CanvasRenderingContext2D).clearRect(0, 0, 800, 400);
    }

    return {
      state,
      canvasDom,
      changeType,
      clear,
      saveImg,
      canvasDown,
      canvasMove,
      canvasUp,
    };
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  width: 800px;
  margin: 60px auto 0;
  border: 1px solid #eee;

  #canvas {
    border: 1px solid black;
  }
}
</style>
